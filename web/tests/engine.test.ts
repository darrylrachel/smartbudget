import { test } from 'node:test';
import assert from 'node:assert/strict';
import { previewAllocation, previewEdits } from '../src/domain/allocator';
import { paycheckDates, type PaySchedule } from '../src/domain/recurrence';
import { type AllocationInput, type AllocationDemand, period } from '../src/domain/contracts';
import { cents as c } from '../src/domain/money';

// Synthetic fixtures only.
const d = (id: string, target: number, tier: AllocationDemand['tier'] = 'weighted', extra: Partial<AllocationDemand> = {}): AllocationDemand => ({ id, envelopeId: id, target: c(target), reserved: c(0), tier, priority: 0, ...extra });
const s = (cash: number, demands: AllocationDemand[] = [], extra: Partial<AllocationInput> = {}): AllocationInput => ({ workspaceId: 'synthetic', currency: 'USD', ledgerVersion: 1, settingsVersion: 1, ruleVersion: 'v1', period: period('2024-02-15', '2024-03-01'), postedCash: [{ id: 'cash', balance: c(cash, true) }], reservations: [], demands, weights: [], locks: [], ...extra });
const weights = [{ envelopeId: 'a', basisPoints: 5000 }, { envelopeId: 'b', basisPoints: 5000 }];
const amounts = (r: Awaited<ReturnType<typeof previewAllocation>>) => Object.fromEntries(r.additions.map(a => [a.envelopeId, a.amount]));

test('standard waterfall and posted-pay double counting protection', async () => {
  const input = s(100000, [d('rent', 40000, 'essential', { dueDate: '2024-02-20' }), d('food', 20000, 'variable'), d('buffer', 20000, 'buffer', { reserved: c(10000) }), d('a', 100000), d('b', 100000)], { reservations: [{ envelopeId: 'buffer', amount: c(10000) }, { envelopeId: 'other', amount: c(10000) }], weights: [{ envelopeId: 'a', basisPoints: 6000 }, { envelopeId: 'b', basisPoints: 4000 }] });
  const before = structuredClone(input), r = await previewAllocation(input);
  assert.equal(r.available, 80000); assert.equal(r.status, 'ready'); assert.equal(r.unassigned, 0);
  assert.deepEqual(amounts(r), { rent: 40000, food: 20000, buffer: 10000, a: 6000, b: 4000 });
  assert.deepEqual(input, before);
  assert.deepEqual(await previewAllocation(Object.assign(structuredClone(input), { forecast: 999999, confirmedPay: 80000 })), r);
});
test('shortfall orders overdue debt before bills and excludes end boundary', async () => {
  const r = await previewAllocation(s(25000, [d('b', 20000, 'essential', { dueDate: '2024-02-20' }), d('a', 20000, 'minimum-debt', { dueDate: '2024-01-01' }), d('boundary', 999, 'essential', { dueDate: '2024-03-01' })]));
  assert.deepEqual(amounts(r), { a: 20000, b: 5000 });
  assert.deepEqual(r.unmet, [{ requestId: 'b', amount: 15000, reason: 'INSUFFICIENT_FUNDS' }]);
  assert.equal(r.status, 'shortfall'); assert.equal(r.requiresAcknowledgment, true);
  const tied = await previewAllocation(s(1, ['b', 'a', 'c'].map(id => d(id, 1, 'essential', { dueDate: '2024-02-15', priority: id === 'c' ? 1 : 0 }))));
  assert.deepEqual(amounts(tied), { a: 1 });
});
test('rounding, caps without redistribution, zero weights and exact large products', async () => {
  assert.deepEqual(amounts(await previewAllocation(s(101, [d('a', 1000), d('b', 1000), d('zero', 1000)], { weights: [...weights, { envelopeId: 'zero', basisPoints: 0 }] }))), { a: 51, b: 50 });
  const r = await previewAllocation(s(10000, [d('a', 10000, 'weighted', { cap: c(2000) }), d('b', 10000)], { weights }));
  assert.deepEqual(amounts(r), { a: 2000, b: 5000 }); assert.equal(r.unassigned, 3000); assert.equal(r.unmet[0].reason, 'TARGET_CAP');
  const large = await previewAllocation(s(Number.MAX_SAFE_INTEGER, [d('a', Number.MAX_SAFE_INTEGER), d('b', Number.MAX_SAFE_INTEGER)], { weights }));
  assert.equal(large.additions.reduce((sum, a) => sum + BigInt(a.amount), 0n), BigInt(Number.MAX_SAFE_INTEGER));
  assert.equal((await previewAllocation(s(100))).unassigned, 100);
});
test('locks consume cash once, respect caps and require acknowledgment for unmet needs', async () => {
  const input = s(100, [d('need', 80, 'variable'), d('goal', 100, 'weighted', { cap: c(30) })], { locks: [{ requestId: 'goal', amount: c(30) }] });
  const r = await previewAllocation(input); assert.deepEqual(amounts(r), { goal: 30, need: 70 }); assert.equal(r.requiresAcknowledgment, true);
  await assert.rejects(previewAllocation({ ...input, locks: [{ requestId: 'goal', amount: c(31) }] }));
  await assert.rejects(previewAllocation({ ...input, locks: [{ requestId: 'goal', amount: c(30) }, { requestId: 'need', amount: c(80) }] }));
  const partial = await previewAllocation(s(100, [d('need', 100, 'variable', { reserved: c(20) })], { reservations: [{ envelopeId: 'need', amount: c(20) }], locks: [{ requestId: 'need', amount: c(10) }] }));
  assert.equal(partial.additions.reduce((sum, a) => sum + a.amount, 0), 80);
});
test('edits share validation, cannot reduce locks or silently fund future demands', async () => {
  const input = s(100, [d('need', 80, 'variable'), d('goal', 100, 'weighted', { cap: c(30) })], { locks: [{ requestId: 'goal', amount: c(10) }] });
  const r = await previewEdits(input, [{ requestId: 'need', amount: c(50) }, { requestId: 'goal', amount: c(30) }]);
  assert.equal(r.unassigned, 20); assert.equal(r.requiresAcknowledgment, true);
  for (const edits of [[{ requestId: 'goal', amount: c(31) }], [{ requestId: 'goal', amount: c(9) }], [{ requestId: 'missing', amount: c(1) }], [{ requestId: 'need', amount: c(80) }, { requestId: 'goal', amount: c(30) }], [{ requestId: 'need', amount: c(1) }, { requestId: 'need', amount: c(1) }]]) await assert.rejects(previewEdits(input, edits));
  const future = s(100, [d('future', 100, 'essential', { dueDate: '2024-03-01' })]);
  await assert.rejects(previewEdits(future, [{ requestId: 'future', amount: c(1) }]));
  assert.equal((await previewAllocation({ ...future, locks: [{ requestId: 'future', amount: c(100) }] })).additions[0].amount, 100);
});
test('fully reserved, zero cash, negative balances and overflow', async () => {
  assert.equal((await previewAllocation(s(0))).status, 'ready');
  assert.equal((await previewAllocation(s(100, [d('need', 1, 'variable')], { reservations: [{ envelopeId: 'other', amount: c(100) }] }))).status, 'shortfall');
  for (const input of [s(-1), s(90, [], { reservations: [{ envelopeId: 'other', amount: c(100) }] })]) {
    const r = await previewAllocation(input); assert.equal(r.status, 'blocked'); assert.deepEqual(r.additions, []);
  }
  assert.equal((await previewAllocation(s(0, [], { postedCash: [{ id: 'positive', balance: c(100) }, { id: 'negative', balance: c(-30, true) }] }))).available, 70);
  await assert.rejects(previewAllocation(s(0, [], { postedCash: [{ id: 'a', balance: c(Number.MAX_SAFE_INTEGER) }, { id: 'b', balance: c(1) }] })));
});
test('reject malformed and inconsistent snapshots', async () => {
  const base = s(100, [d('a', 100)]);
  for (const input of [
    { ...base, demands: [d('a', 100), d('b', 100, 'variable', { envelopeId: 'a' })] },
    { ...base, demands: [d('a', 100, 'weighted', { reserved: c(1) })] },
    { ...base, weights: [{ envelopeId: 'missing', basisPoints: 10000 }] },
    { ...base, demands: [d('a', 100, 'essential', { dueDate: '2023-02-29' })] },
    { ...base, demands: [...base.demands, ...base.demands] },
    { ...base, weights: [{ envelopeId: 'a', basisPoints: 9999 }] },
    { ...base, currency: 'EUR' as 'USD' },
  ]) await assert.rejects(previewAllocation(input));
});
test('200 generated cases conserve cash, respect caps and normalize input ordering', async () => {
  for (let seed = 0; seed < 200; seed++) {
    const cash = seed * 137;
    const input = s(cash, [d('need', seed * 47, 'variable'), d('a', cash + 1, 'weighted', { cap: c(seed * 19) }), d('b', cash + 1)], { weights: [{ envelopeId: 'a', basisPoints: seed }, { envelopeId: 'b', basisPoints: 10000 - seed }] });
    const r = await previewAllocation(input);
    assert.equal(r.additions.reduce<number>((sum, a) => sum + a.amount, r.unassigned), cash);
    assert.ok(r.additions.every(a => Number.isSafeInteger(a.amount) && a.amount >= 0));
    assert.ok((r.additions.find(a => a.envelopeId === 'a')?.amount ?? 0) <= seed * 19);
    assert.deepEqual(await previewAllocation({ ...input, demands: [...input.demands].reverse(), weights: [...input.weights].reverse() }), r);
  }
  const base = s(1), first = await previewAllocation(base);
  for (const input of [{ ...base, ledgerVersion: 2 }, { ...base, settingsVersion: 2 }, { ...base, workspaceId: 'other' }]) assert.notEqual((await previewAllocation(input)).inputHash, first.inputHash);
});
const pay = (config: object = {}) => ({ workspaceId: 'synthetic', id: 'pay', anchor: '2024-01-01', cadence: 'weekly', ...config }) as PaySchedule;
test('weekly and biweekly leap/year dates and exclusive boundaries', () => {
  assert.deepEqual(paycheckDates(pay({ anchor: '2024-02-22' }), period('2024-02-22', '2024-03-07')), ['2024-02-22', '2024-02-29']);
  assert.deepEqual(paycheckDates(pay({ anchor: '2023-12-29', cadence: 'biweekly' }), period('2024-01-01', '2024-02-01')), ['2024-01-12', '2024-01-26']);
  assert.deepEqual(paycheckDates(pay({ anchor: '2024-03-01' }), period('2024-02-01', '2024-03-01')), []);
});
test('monthly and semimonthly clamping preserves original calendar days', () => {
  assert.deepEqual(paycheckDates(pay({ cadence: 'monthly', day: 31 }), period('2024-01-01', '2024-05-01')), ['2024-01-31', '2024-02-29', '2024-03-31', '2024-04-30']);
  assert.deepEqual(paycheckDates(pay({ cadence: 'semimonthly', days: [15, 31] }), period('2024-02-01', '2024-04-01')), ['2024-02-15', '2024-02-29', '2024-03-15', '2024-03-31']);
  assert.deepEqual(paycheckDates(pay({ cadence: 'monthly', day: 31, anchor: '2023-01-01' }), period('2023-02-01', '2023-03-01')), ['2023-02-28']);
  assert.deepEqual(paycheckDates(pay({ cadence: 'semimonthly', days: [30, 31] }), period('2024-02-01', '2024-03-01')), ['2024-02-29']);
  for (const config of [{ cadence: 'monthly', day: 0 }, { cadence: 'monthly', day: 32 }, { cadence: 'semimonthly', days: [15, 15] }, { anchor: '2024-02-30' }, { workspaceId: '' }]) assert.throws(() => paycheckDates(pay(config), period('2024-01-01', '2024-04-01')));
});


test('hash is canonical across all input arrays and stable while caller mutates', async () => {
  const input = s(100, [d('a', 20, 'variable'), d('b', 20, 'variable')], {
    postedCash: [{ id: 'one', balance: c(60) }, { id: 'two', balance: c(40) }],
    reservations: [{ envelopeId: 'old-a', amount: c(1) }, { envelopeId: 'old-b', amount: c(1) }],
    locks: [{ requestId: 'a', amount: c(1) }, { requestId: 'b', amount: c(1) }],
  });
  const expected = await previewAllocation(input);
  assert.deepEqual(await previewAllocation({ ...input, demands: [...input.demands].reverse(), postedCash: [...input.postedCash].reverse(), reservations: [...input.reservations].reverse(), locks: [...input.locks].reverse() }), expected);
  const pending = previewAllocation(input);
  input.demands[0].target = c(999);
  assert.deepEqual(await pending, expected);
});

test('variable essentials use priority then ID even when optional dates differ', async () => {
  const input = s(100, [
    d('earlier-date', 100, 'variable', { priority: 2, dueDate: '2024-02-16' }),
    d('priority-first', 100, 'variable', { priority: 0, dueDate: '2024-02-28' }),
  ]);
  assert.deepEqual(amounts(await previewAllocation(input)), { 'priority-first': 100 });
  const tied = s(1, [d('b', 1, 'variable', { dueDate: '2024-02-16' }), d('a', 1, 'variable', { dueDate: '2024-02-28' })]);
  assert.deepEqual(amounts(await previewAllocation(tied)), { a: 1 });
});

test('generated lock/reservation/weight combinations conserve cash and validate edited previews', async () => {
  for (let seed = 1; seed <= 200; seed++) {
    const existing = seed % 17, cash = seed * 73, cap = seed % 71, lock = Math.min(cap, seed % 13);
    const input = s(cash + existing, [
      d('need', existing + seed % 101, 'variable', { reserved: c(existing) }),
      d('a', cap + 20, 'weighted', { cap: c(cap) }),
      d('b', cash + 1),
    ], {
      reservations: [{ envelopeId: 'need', amount: c(existing) }],
      locks: [{ requestId: 'a', amount: c(lock) }],
      weights: [{ envelopeId: 'a', basisPoints: (seed * 7919) % 10001 }, { envelopeId: 'b', basisPoints: 10000 - (seed * 7919) % 10001 }],
    });
    const result = await previewAllocation(input);
    const totals = new Map<string, number>();
    for (const row of result.additions) totals.set(row.envelopeId, (totals.get(row.envelopeId) ?? 0) + row.amount);
    const assigned = [...totals.values()].reduce((sum, n) => sum + BigInt(n), 0n);
    assert.equal(assigned + BigInt(result.unassigned), BigInt(cash));
    assert.ok(assigned + BigInt(existing) <= BigInt(cash + existing));
    assert.ok((totals.get('a') ?? 0) <= cap);
    assert.ok((totals.get('a') ?? 0) >= lock);
    assert.ok(result.additions.every(row => Number.isSafeInteger(row.amount) && row.amount >= 0));
    const edits = [...totals].map(([requestId, amount]) => ({ requestId, amount: c(amount) }));
    // Revalidating the generated plan as an edit must preserve every total.
    const edited = await previewEdits(input, edits);
    const editedTotals = new Map<string, number>();
    for (const row of edited.additions) editedTotals.set(row.envelopeId, (editedTotals.get(row.envelopeId) ?? 0) + row.amount);
    assert.deepEqual([...editedTotals].sort(), [...totals].sort());
    assert.equal(edited.unassigned, result.unassigned);
    assert.deepEqual(edited.unmet, result.unmet);
    assert.deepEqual(await previewAllocation({ ...input, demands: [...input.demands].reverse(), weights: [...input.weights].reverse() }), result);
  }
});

test('snapshot identity changes for every relevant contract field while ignoring object property order', async () => {
  const input = s(100, [d('a', 100, 'weighted', { dueDate: '2024-02-20', cap: c(100) })], {
    weights: [{ envelopeId: 'a', basisPoints: 10000 }], locks: [{ requestId: 'a', amount: c(1) }],
    reservations: [{ envelopeId: 'other', amount: c(1) }],
  });
  const original = await previewAllocation(input);
  assert.match(original.inputHash, /^[a-f0-9]{64}$/);
  for (const modified of [
    { ...input, ruleVersion: 'v2' },
    { ...input, period: period('2024-02-16', '2024-03-01') },
    { ...input, postedCash: [{ id: 'cash', balance: c(101) }] },
    { ...input, reservations: [{ envelopeId: 'other', amount: c(2) }] },
    { ...input, demands: [d('a', 99, 'weighted', { dueDate: '2024-02-20', cap: c(100) })] },
    { ...input, demands: [{ ...input.demands[0], priority: 1 }] },
    { ...input, demands: [{ ...input.demands[0], cap: c(90) }] },
    { ...input, demands: [{ ...input.demands[0], dueDate: '2024-02-21' }] },
    { ...input, locks: [{ requestId: 'a', amount: c(2) }] },
    { ...input, weights: [] },
  ]) assert.notEqual((await previewAllocation(modified)).inputHash, original.inputHash);
  const reordered = Object.fromEntries(Object.entries(input).reverse()) as unknown as AllocationInput;
  assert.deepEqual(await previewAllocation(reordered), original);
});

test('edits and deeply frozen caller input remain immutable', async () => {
  const input = s(100, [d('need', 80, 'variable')]);
  Object.freeze(input.demands[0]); Object.freeze(input.demands); Object.freeze(input.postedCash[0]);
  Object.freeze(input.postedCash); Object.freeze(input.period); Object.freeze(input);
  const edits = Object.freeze([Object.freeze({ requestId: 'need', amount: c(60) })]);
  const before = JSON.stringify({ input, edits });
  const result = await previewEdits(input, edits);
  assert.equal(result.unassigned, 40);
  assert.equal(JSON.stringify({ input, edits }), before);
  const pending = previewEdits(s(100, [d('need', 80, 'variable')]), [{ requestId: 'need', amount: c(50) }]);
  assert.equal((await pending).unassigned, 50);
});

test('fully funded requests, caps with existing reserves, and malformed edits/locks', async () => {
  const funded = s(100, [d('need', 10, 'variable', { reserved: c(20) })], { reservations: [{ envelopeId: 'need', amount: c(20) }] });
  const result = await previewAllocation(funded);
  assert.equal(result.status, 'ready'); assert.deepEqual(result.unmet, []); assert.equal(result.unassigned, 80);
  const capped = s(100, [d('a', 100, 'weighted', { reserved: c(20), cap: c(30) })], { reservations: [{ envelopeId: 'a', amount: c(20) }], weights: [{ envelopeId: 'a', basisPoints: 10000 }], locks: [{ requestId: 'a', amount: c(5) }] });
  const capResult = await previewAllocation(capped);
  assert.equal(capResult.additions.reduce((sum, row) => sum + row.amount, 0), 10);
  assert.equal(capResult.unassigned, 70);
  for (const amount of [-1, 0.1, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    await assert.rejects(previewEdits(s(100, [d('a', 100)]), [{ requestId: 'a', amount: amount as ReturnType<typeof c> }]));
    await assert.rejects(previewAllocation(s(100, [d('a', 100)], { locks: [{ requestId: 'a', amount: amount as ReturnType<typeof c> }] })));
  }
  await assert.rejects(previewAllocation({ ...funded, demands: [{ ...funded.demands[0], cap: c(19) }] }));
});

test('recurrence crosses century leap rules, December and daylight saving without bank holiday shifts', () => {
  assert.deepEqual(paycheckDates(pay({ cadence: 'monthly', day: 31, anchor: '2099-01-01' }), period('2100-02-01', '2100-04-01')), ['2100-02-28', '2100-03-31']);
  assert.deepEqual(paycheckDates(pay({ cadence: 'monthly', day: 31, anchor: '2023-01-01' }), period('2023-12-01', '2024-02-01')), ['2023-12-31', '2024-01-31']);
  assert.deepEqual(paycheckDates(pay({ anchor: '2024-03-03' }), period('2024-03-01', '2024-03-25')), ['2024-03-03', '2024-03-10', '2024-03-17', '2024-03-24']);
  assert.deepEqual(paycheckDates(pay({ anchor: '2024-07-04' }), period('2024-07-01', '2024-07-12')), ['2024-07-04', '2024-07-11']);
  for (const config of [{ cadence: 'unknown' }, { cadence: 'monthly', day: 1.5 }, { cadence: 'semimonthly', days: [31, 15] }, { cadence: 'semimonthly', days: [1] }]) assert.throws(() => paycheckDates(pay(config), period('2024-01-01', '2024-04-01')));
});
