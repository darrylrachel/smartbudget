import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app';
import { localPort } from '../src/config';
test('configuration validates explicit ports without secrets or services', () => {
  assert.equal(localPort({}), 3001);
  assert.equal(localPort({PORT: '4321'}), 4321);
  for (const PORT of ['', '0','65536','1.5',' 3001','NaN','3001oops']) assert.throws(() => localPort({PORT}), /PORT must/);
});
test('health over real HTTP returns exact JSON without external services', async () => {
  const app = createApp();
  try {
    await app.listen({port: 0, host: '127.0.0.1'});
    const address = app.server.address();
    assert.ok(address && typeof address !== 'string');
    const response = await fetch(`http://127.0.0.1:${address.port}/health`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type')!, /^application\/json/);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.deepEqual(await response.json(), {status:'ok'});
  } finally { await app.close(); }
});
test('errors are safe and route validation does not coerce input', async () => {
  const app = createApp();
  // Test-only routes exercise the actual error handler; they are never shipped.
  app.get('/failure', async () => { throw new Error('synthetic-secret-canary'); });
  app.post('/validation', {schema:{body:{type:'object',additionalProperties:false,required:['count'],properties:{count:{type:'integer'}}}}}, async () => ({ok:true}));
  try {
    const failure = await app.inject('/failure');
    assert.equal(failure.statusCode, 500);
    assert.deepEqual(failure.json(), {error:'Internal server error'});
    for (const payload of [{count:'1'}, {count:1, extra:true}, {}]) {
      const response = await app.inject({method:'POST',url:'/validation',payload});
      assert.equal(response.statusCode,400);
      assert.deepEqual(response.json(),{error:'Invalid request'});
    }
    assert.equal((await app.inject({method:'POST',url:'/validation',payload:{count:1}})).statusCode,200);
    for (const url of ['/missing','/api/health']) assert.deepEqual((await app.inject(url)).json(),{error:'Not found'});
  } finally { await app.close(); }
});
