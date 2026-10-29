import { test } from 'node:test';
import assert from 'node:assert/strict';
import { previewAllocation } from '../../web/src/domain/allocator';
import { type AllocationInput, period } from '../../web/src/domain/contracts';
import { cents } from '../../web/src/domain/money';
test('actual financial engine runs on Node: needs first, exact rounding, identity and immutability', async () => {
  // Synthetic cents fixture. 1001 cash - 200 rent = 801; equal weights give a=401, b=400.
  const input: AllocationInput = {
    workspaceId:'synthetic', currency:'USD', ledgerVersion:1, settingsVersion:1, ruleVersion:'v1',
    period:period('2024-02-01','2024-03-01'), postedCash:[{id:'cash',balance:cents(1001)}], reservations:[], locks:[],
    demands:[{id:'rent',envelopeId:'rent',tier:'essential',dueDate:'2024-02-15',target:cents(200),reserved:cents(0),priority:0},
      ...['a','b'].map(id => ({id,envelopeId:id,tier:'weighted' as const,target:cents(1000),reserved:cents(0),priority:0}))],
    weights:[{envelopeId:'a',basisPoints:5000},{envelopeId:'b',basisPoints:5000}],
  };
  const original = structuredClone(input);
  const result = await previewAllocation(input);
  assert.equal(result.status,'ready');
  assert.equal(result.available,1001);
  assert.deepEqual(result.additions.map(({envelopeId,amount}) => ({envelopeId,amount})), [{envelopeId:'rent',amount:200},{envelopeId:'a',amount:401},{envelopeId:'b',amount:400}]);
  assert.equal(result.unassigned,0);
  assert.match(result.inputHash,/^[a-f0-9]{64}$/);
  assert.deepEqual(input,original);
  assert.deepEqual(await previewAllocation({...input, demands:[...input.demands].reverse(),weights:[...input.weights].reverse()}),result);
});
