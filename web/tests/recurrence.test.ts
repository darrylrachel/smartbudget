import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paycheckDates, type PaySchedule } from '../src/domain/recurrence';
import { period } from '../src/domain/contracts';
const range = period('2024-02-01', '2024-04-01');
const schedule = (days: unknown) => ({ workspaceId: 'synthetic', id: 'pay', anchor: '2024-01-01', cadence: 'semimonthly', days }) as PaySchedule;
test('semimonthly rejects malformed runtime days including sparse tuples', () => {
  for (const days of [undefined, null, {}, '15,31', [], [15], [1,15,31], Array(2), [15, ...Array(1)], [,31], [undefined,31], [null,31], ['15',31], [0,31], [1,32], [1.5,31], [NaN,31], [1,Infinity], [15,15], [31,15]]) {
    assert.throws(() => paycheckDates(schedule(days), range), Error, `days=${String(days)}`);
  }
});
test('valid semimonthly clamps month end and preserves inputs and boundaries', () => {
  const input = schedule(Object.freeze([15,31]));
  Object.freeze(input);
  assert.deepEqual(paycheckDates(input, range), ['2024-02-15','2024-02-29','2024-03-15','2024-03-31']);
  assert.deepEqual(paycheckDates({...schedule([30,31]), anchor: '2023-01-01'}, period('2023-02-01','2023-03-01')), ['2023-02-28']);
  assert.deepEqual(paycheckDates(schedule([30,31]), period('2024-02-01','2024-03-01')), ['2024-02-29']);
  // Existing contract selects fields by cadence; irrelevant adapter metadata remains ignored.
  assert.deepEqual(paycheckDates({...input, day: 1} as PaySchedule, range), paycheckDates(input, range));
});
