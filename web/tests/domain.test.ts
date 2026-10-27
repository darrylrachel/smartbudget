import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cents, formatMoney, parseMoney, sumCents } from '../src/domain/money';
import { AllocationInput, dateInPeriod, isoDate, period, validateAllocationInput, validateDraft, validateWeights, WorkspaceId } from '../src/domain/contracts';
import { mockRepository } from '../src/data/mockRepository';
import { loadSnapshot } from '../src/data/mockRepository';
import { lessons } from '../src/content/catalog';

test('decimal input converts exactly and formats safe boundaries without floating point rounding', () => {
  for (const [input, expected] of [['0', 0], ['0.01', 1], ['12.5', 1250], ['90071992547409.91', Number.MAX_SAFE_INTEGER]] as const) {
    assert.equal(parseMoney(input), expected);
  }
  assert.equal(formatMoney(parseMoney('90071992547409.91')), '$90,071,992,547,409.91');
  assert.equal(formatMoney(parseMoney('-0.01', true)), '-$0.01');
  assert.equal(formatMoney(cents(0)), '$0.00');
  assert.equal(parseMoney('-0', true), 0);
  assert.equal(sumCents([cents(10), cents(20)]), 30);
});
test('invalid, fractional, oversized and ambiguous amounts are rejected', () => {
  for (const input of ['', ' 1', '1 ', '.5', '1.', '01.00', '1.001', '1e2', '+1', '-1', '$1', '1,000', 'NaN', '90071992547409.92']) assert.throws(() => parseMoney(input), input);
  for (const input of [NaN, Infinity, 1.1, -1, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => cents(input));
  assert.throws(() => sumCents([cents(Number.MAX_SAFE_INTEGER), cents(1)]));
  assert.throws(() => parseMoney('-90071992547409.92', true));
});
test('date, period, weights and sample entry contracts reject invalid inputs', () => {
  assert.equal(isoDate('2024-02-29'), '2024-02-29');
  for (const date of ['2026-02-29', '2026-13-01', '2026-04-31', '2026-1-01', '0000-01-01']) assert.throws(() => isoDate(date));
  assert.throws(() => period('2026-10-22', '2026-10-22'));
  assert.throws(() => period('2026-10-23', '2026-10-22'));
  assert.equal(period('2026-10-22', '2026-11-05').endExclusive, '2026-11-05');
  validateWeights([6000, 4000]);
  for (const weights of [[1, 2], [-1, 10001], [5000.5, 4999.5]]) assert.throws(() => validateWeights(weights));
  assert.throws(() => validateDraft({ workspaceId: '../other', amount: '1', date: '2026-10-22' }));
  assert.throws(() => validateDraft({ workspaceId: 'personal-demo', amount: '0', date: '2026-10-22' }));
});
test('repository isolates all financial reads, rejects IDs, and returns defensive copies', () => {
  const personal = mockRepository.snapshot('personal-demo');
  const household = mockRepository.snapshot('household-demo');
  assert.equal(mockRepository.goal('household-demo', personal.goals[0].id), undefined);
  assert.equal(household.transactions.length, 0);
  assert.equal(household.goals.length, 0);
  assert.ok(personal.transactions.every(row => row.workspaceId === personal.id));
  assert.ok(!JSON.stringify(household).includes('personal-'));
  personal.name = 'Mutated';
  assert.equal(mockRepository.snapshot('personal-demo').name, 'Personal sample');
  assert.throws(() => mockRepository.snapshot('unknown' as WorkspaceId));
  assert.throws(() => mockRepository.goal('personal-demo', '../personal-cushion'));
});
test('allocation input boundary rejects malformed snapshots without executing an engine', () => {
  const input: AllocationInput = {
    workspaceId: 'personal-demo', currency: 'USD', ledgerVersion: 1, settingsVersion: 1, ruleVersion: 'v1',
    period: period('2026-10-22', '2026-11-05'), postedCash: [{ id: 'checking', balance: cents(10000) }],
    reservations: [], demands: [], locks: [], weights: [],
  };
  assert.equal(validateAllocationInput(input), input);
  assert.throws(() => validateAllocationInput({ ...input, postedCash: [...input.postedCash, ...input.postedCash] }));
  assert.throws(() => validateAllocationInput({ ...input, currency: 'EUR' as 'USD' }));
  assert.throws(() => validateAllocationInput({ ...input, settingsVersion: NaN }));
  assert.throws(() => validateAllocationInput({ ...input, locks: [{ requestId: 'missing', amount: cents(1) }] }));
  assert.throws(() => validateAllocationInput({ ...input, demands: [{ id: 'rent', envelopeId: 'rent-envelope', tier: 'essential', priority: 0, target: cents(100), reserved: cents(0) }] }));
});
test('fixture previews conserve available cash and Academy has exactly one sample manuscript', () => {
  for (const id of ['personal-demo', 'household-demo'] as const) {
    const data = mockRepository.snapshot(id);
    assert.equal(sumCents([...data.preview.additions.map(row => row.amount), data.preview.unassigned]), data.available);
    assert.equal(sumCents([data.reserved, data.available]), data.cash);
    assert.equal(data.preview.workspaceId, id);
  }
  assert.equal(lessons.length, 15);
  assert.equal(new Set(lessons.map(lesson => lesson.slug)).size, 15);
  assert.equal(lessons.filter(lesson => lesson.status === 'sample').length, 1);
});

test('pay boundary excludes next pay date and async reads are cancelled', async () => {
  const boundary = period('2026-10-22', '2026-11-05');
  assert.equal(dateInPeriod('2026-10-22', boundary), true);
  assert.equal(dateInPeriod('2026-11-04', boundary), true);
  assert.equal(dateInPeriod('2026-11-05', boundary), false);
  assert.equal(dateInPeriod('2026-10-21', boundary), false);
  const controller = new AbortController();
  const pending = loadSnapshot('personal-demo', controller.signal);
  controller.abort();
  await assert.rejects(pending, { name: 'AbortError' });
  const shared = await loadSnapshot('household-demo', new AbortController().signal);
  assert.equal(shared.id, 'household-demo');
  assert.ok(!JSON.stringify(shared).includes('personal-'));
});
