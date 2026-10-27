import { Cents, cents, parseMoney } from './money';

// Adapted from the preserved Expo prototype. Fixture aliases belong to the adapter.
export type WorkspaceId = string;
export type Role = 'owner' | 'editor' | 'viewer';
export function workspaceId(input: unknown): WorkspaceId {
  return recordId(input);
}
export function recordId(input: unknown): string {
  if (typeof input !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input) || input.length > 80) throw new Error('Invalid record identifier.');
  return input;
}
export function isoDate(input: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input) || input < '0001-01-01' || !Number.isFinite(Date.parse(`${input}T00:00:00Z`)) || new Date(`${input}T00:00:00Z`).toISOString().slice(0, 10) !== input) throw new Error('Use a valid date: YYYY-MM-DD.');
  return input;
}
export function period(start: string, end: string) {
  isoDate(start); isoDate(end);
  if (end <= start) throw new Error('Planning end must be after the start.');
  return { start, endExclusive: end };
}
export function dateInPeriod(date: string, boundary: ReturnType<typeof period>): boolean {
  isoDate(date); period(boundary.start, boundary.endExclusive);
  return date >= boundary.start && date < boundary.endExclusive;
}
export function validateDraft(input: { workspaceId: unknown; amount: string; date: string }) {
  const amount = parseMoney(input.amount);
  if (amount === 0) throw new Error('Enter an amount greater than zero.');
  return { workspaceId: workspaceId(input.workspaceId), amount, date: isoDate(input.date), currency: 'USD' as const };
}
export const reasonCodes = ['USER_LOCK', 'DUE_ESSENTIAL', 'MINIMUM_DEBT', 'VARIABLE_ESSENTIAL', 'BUFFER_TOP_UP', 'WEIGHTED_REMAINDER', 'TARGET_CAP', 'INSUFFICIENT_FUNDS', 'STALE_SNAPSHOT'] as const;
export type ReasonCode = typeof reasonCodes[number];
export interface AllocationDemand { id: string; envelopeId: string; tier: 'essential' | 'minimum-debt' | 'variable' | 'buffer' | 'weighted'; dueDate?: string; target: Cents; reserved: Cents; cap?: Cents; priority: number }
export interface AllocationInput {
  workspaceId: WorkspaceId; currency: 'USD'; ledgerVersion: number; ruleVersion: string; settingsVersion: number;
  period: ReturnType<typeof period>; postedCash: readonly { id: string; balance: Cents }[];
  reservations: readonly { envelopeId: string; amount: Cents }[]; demands: readonly AllocationDemand[];
  locks: readonly { requestId: string; amount: Cents }[];
  weights: readonly { envelopeId: string; basisPoints: number }[];
}
export interface AllocationResult {
  workspaceId: WorkspaceId; status: 'ready' | 'shortfall' | 'blocked'; available: Cents;
  additions: readonly { envelopeId: string; amount: Cents; reason: ReasonCode; explanation: string }[];
  unmet: readonly { requestId: string; amount: Cents; reason: ReasonCode }[]; unassigned: Cents;
  ledgerVersion: number; settingsVersion: number; ruleVersion: string; inputHash: string;
}
export function basisPoints(value: number): number {
  if (!Number.isInteger(value) || value < 0 || value > 10000) throw new Error('Weight must be whole basis points from 0 to 10000.');
  return value;
}
export function validateWeights(values: readonly number[]) {
  if (values.reduce((sum, value) => sum + basisPoints(value), 0) !== 10000) throw new Error('Weights must total 10000.');
}
export function signedBalance(value: number) { return cents(value, true); }

// Input validation only. This does not rank demands, allocate cash, or accept a plan.
export function validateAllocationInput(input: AllocationInput): AllocationInput {
  workspaceId(input.workspaceId);
  if (input.currency !== 'USD') throw new Error('Only USD is supported.');
  period(input.period.start, input.period.endExclusive);
  for (const version of [input.ledgerVersion, input.settingsVersion]) {
    if (!Number.isSafeInteger(version) || version < 0) throw new Error('Invalid snapshot version.');
  }
  recordId(input.ruleVersion);
  const unique = (ids: readonly string[]) => {
    ids.forEach(recordId);
    if (new Set(ids).size !== ids.length) throw new Error('Duplicate record identifiers.');
  };
  unique(input.postedCash.map(row => row.id));
  unique(input.reservations.map(row => row.envelopeId));
  unique(input.demands.map(row => row.id));
  unique(input.locks.map(row => row.requestId));
  unique(input.weights.map(row => row.envelopeId));
  input.postedCash.forEach(row => cents(row.balance, true));
  input.reservations.forEach(row => cents(row.amount));
  input.demands.forEach(row => {
    recordId(row.envelopeId); cents(row.target); cents(row.reserved);
    if (row.cap !== undefined) cents(row.cap);
    if (!['essential', 'minimum-debt', 'variable', 'buffer', 'weighted'].includes(row.tier)) throw new Error('Invalid demand tier.');
    if (!Number.isSafeInteger(row.priority) || row.priority < 0) throw new Error('Invalid priority.');
    if (row.tier === 'essential' || row.tier === 'minimum-debt' || row.dueDate !== undefined) isoDate(row.dueDate ?? '');
  });
  input.locks.forEach(row => {
    cents(row.amount);
    if (!input.demands.some(demand => demand.id === row.requestId)) throw new Error('Lock references an unknown demand.');
  });
  if (input.weights.length) validateWeights(input.weights.map(row => row.basisPoints));
  return input;
}
