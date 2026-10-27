import { type AllocationInput, type AllocationDemand, type AllocationResult, type ReasonCode, validateAllocationInput } from './contracts';
import { cents, formatMoney, sumCents, type Cents } from './money';

const compare = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;
const minimum = (...values: number[]) => cents(Math.min(...values));
export type PlanPreview = AllocationResult & { requiresAcknowledgment: boolean; blockedReason?: string };
export type PlanEdit = { requestId: string; amount: Cents };

function prepare(input: AllocationInput) {
  validateAllocationInput(input);
  const envelopes = new Set<string>();
  for (const demand of input.demands) {
    // v1 uses one aggregate request per envelope; occurrence adapters must aggregate first.
    if (envelopes.has(demand.envelopeId)) throw new Error('Aggregate requests for the same envelope before allocation.');
    envelopes.add(demand.envelopeId);
    const reserved = input.reservations.find(r => r.envelopeId === demand.envelopeId)?.amount ?? 0;
    if (reserved !== demand.reserved) throw new Error('Demand reservation does not match snapshot.');
    if (demand.cap !== undefined && reserved > demand.cap) throw new Error('Existing reservation exceeds cap.');
  }
  for (const weight of input.weights) {
    if (!input.demands.some(d => d.envelopeId === weight.envelopeId && d.tier === 'weighted')) throw new Error('Weight requires a weighted demand.');
  }
  const cash = sumCents(input.postedCash.map(r => r.balance), true);
  const reserved = sumCents(input.reservations.map(r => r.amount));
  const blocked = cash < 0 || reserved > cash;
  return { blocked, available: blocked ? cents(0) : cents(cash - reserved) };
}

function eligible(d: AllocationDemand, input: AllocationInput) {
  return d.dueDate === undefined || d.dueDate < input.period.endExclusive;
}
function limit(d: AllocationDemand): Cents {
  return cents(Math.max(0, Math.min(d.target, d.cap ?? d.target) - d.reserved));
}

// Explicit field selection means transport extras (including forecast amounts) cannot fund a plan.
function canonical(input: AllocationInput): string {
  const sorted = <T,>(rows: readonly T[], key: (row: T) => string) => [...rows].sort((a, b) => compare(key(a), key(b)));
  return JSON.stringify({ workspaceId: input.workspaceId, currency: input.currency, ledgerVersion: input.ledgerVersion,
    settingsVersion: input.settingsVersion, ruleVersion: input.ruleVersion, period: { start: input.period.start, endExclusive: input.period.endExclusive },
    postedCash: sorted(input.postedCash.map(r => ({ id: r.id, balance: r.balance })), r => r.id),
    reservations: sorted(input.reservations.map(r => ({ envelopeId: r.envelopeId, amount: r.amount })), r => r.envelopeId),
    demands: sorted(input.demands.map(d => ({ id: d.id, envelopeId: d.envelopeId, tier: d.tier, dueDate: d.dueDate, target: d.target, reserved: d.reserved, cap: d.cap, priority: d.priority })), r => r.id),
    locks: sorted(input.locks.map(r => ({ requestId: r.requestId, amount: r.amount })), r => r.requestId),
    weights: sorted(input.weights.map(r => ({ envelopeId: r.envelopeId, basisPoints: r.basisPoints })), r => r.envelopeId) });
}
async function identity(input: AllocationInput) {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonical(input)));
  return Array.from(new Uint8Array(digest), n => n.toString(16).padStart(2, '0')).join('');
}

export async function previewAllocation(source: AllocationInput, edits?: readonly PlanEdit[]): Promise<PlanPreview> {
  // Copy before the first await so caller mutations cannot change the calculation/hash pair.
  const input = structuredClone(source);
  const state = prepare(input);
  const additions: AllocationResult['additions'][number][] = [];
  const allocated = new Map<string, Cents>();
  let remaining = state.available;
  const demands = [...input.demands].sort((a, b) => compare(a.id, b.id));
  const add = (d: AllocationDemand, amount: Cents, reason: ReasonCode) => {
    if (amount > remaining || amount > limit(d) - (allocated.get(d.id) ?? 0)) throw new Error('Allocation exceeds available cash or request cap.');
    allocated.set(d.id, cents((allocated.get(d.id) ?? 0) + amount));
    remaining = cents(remaining - amount);
    if (amount) additions.push({ envelopeId: d.envelopeId, amount, reason, explanation: `${reason}: assign ${formatMoney(amount)} toward ${formatMoney(d.target)}${d.dueDate ? ` due ${d.dueDate}` : ''}.` });
  };
  if (!state.blocked) {
    for (const lock of [...input.locks].sort((a, b) => compare(a.requestId, b.requestId))) {
      const d = demands.find(d => d.id === lock.requestId)!;
      add(d, lock.amount, 'USER_LOCK');
    }
    if (edits) {
      const seen = new Set<string>();
      // Edits are total additions per request, including its lock; omitted requests get only locks.
      for (const edit of [...edits].sort((a, b) => compare(a.requestId, b.requestId))) {
        const d = demands.find(d => d.id === edit.requestId);
        if (!d || seen.has(edit.requestId)) throw new Error('Unknown or duplicate edited request.');
        seen.add(edit.requestId); cents(edit.amount);
        const locked = allocated.get(d.id) ?? 0;
        if (edit.amount < locked) throw new Error('Edit cannot reduce a lock.');
        if (!eligible(d, input) && edit.amount > locked) throw new Error('Future funding requires an explicit lock.');
        add(d, cents(edit.amount - locked), 'USER_LOCK');
      }
    } else {
      const rank = { essential: 0, 'minimum-debt': 0, variable: 1, buffer: 2, weighted: 3 };
      const ordered = demands.filter(d => d.tier !== 'weighted' && eligible(d, input)).sort((a, b) => {
        const tierOrder = rank[a.tier] - rank[b.tier];
        // Only bills and minimum debt use dates to rank requests. Variable needs
        // follow the user's explicit priority, even if an adapter supplies a date.
        const dueOrder = rank[a.tier] === 0 && rank[b.tier] === 0
          ? compare(a.dueDate ?? '', b.dueDate ?? '') : 0;
        return tierOrder || dueOrder || a.priority - b.priority || compare(a.id, b.id);
      });
      for (const d of ordered) add(d, minimum(remaining, limit(d) - (allocated.get(d.id) ?? 0)), d.tier === 'essential' ? 'DUE_ESSENTIAL' : d.tier === 'minimum-debt' ? 'MINIMUM_DEBT' : d.tier === 'variable' ? 'VARIABLE_ESSENTIAL' : 'BUFFER_TOP_UP');
      const pool = BigInt(remaining);
      const shares = input.weights.map(w => { const product = pool * BigInt(w.basisPoints); return { ...w, amount: product / 10000n, fraction: product % 10000n }; });
      shares.sort((a, b) => a.fraction === b.fraction ? compare(a.envelopeId, b.envelopeId) : a.fraction > b.fraction ? -1 : 1);
      let rounding = pool - shares.reduce((sum, s) => sum + s.amount, 0n);
      for (const share of shares) { if (rounding > 0n) { share.amount++; rounding--; } }
      for (const share of shares.sort((a, b) => compare(a.envelopeId, b.envelopeId))) {
        const d = demands.find(d => d.envelopeId === share.envelopeId)!;
        if (eligible(d, input)) add(d, minimum(Number(share.amount), limit(d) - (allocated.get(d.id) ?? 0)), 'WEIGHTED_REMAINDER');
      }
    }
  } else if (edits?.length || input.locks.some(l => l.amount > 0)) {
    throw new Error('Cannot assign cash from an unreconciled snapshot.');
  }
  const unmet = demands.filter(d => eligible(d, input) && d.target > d.reserved + (allocated.get(d.id) ?? 0)).map(d => ({ requestId: d.id, amount: cents(d.target - d.reserved - (allocated.get(d.id) ?? 0)), reason: (limit(d) === (allocated.get(d.id) ?? 0) ? 'TARGET_CAP' : 'INSUFFICIENT_FUNDS') as ReasonCode }));
  const needsUnmet = unmet.some(u => demands.find(d => d.id === u.requestId)!.tier !== 'weighted');
  return { workspaceId: input.workspaceId, status: state.blocked ? 'blocked' : needsUnmet ? 'shortfall' : 'ready', available: state.available,
    additions, unmet, unassigned: remaining, ledgerVersion: input.ledgerVersion, settingsVersion: input.settingsVersion, ruleVersion: input.ruleVersion,
    inputHash: await identity(input), requiresAcknowledgment: !state.blocked && needsUnmet,
    ...(state.blocked ? { blockedReason: 'Cash and reservations require reconciliation.' } : {}) };
}

export function previewEdits(input: AllocationInput, edits: readonly PlanEdit[]) { return previewAllocation(input, edits); }
