// Production process smoke: built code, real socket, safe startup failure, clean shutdown.
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { once } from 'node:events';
const child = spawn(process.execPath, ['dist/local.mjs'], {env:{...process.env,PORT:'3007'},stdio:['ignore','pipe','pipe']});
let output='';
child.stdout.on('data', data => { output += data; });
child.stderr.on('data', data => { output += data; });
try {
  let response;
  for(let i=0;i<100;i++) {
    assert.equal(child.exitCode,null,output);
    try { response=await fetch('http://127.0.0.1:3007/health'); break; } catch { await new Promise(resolve=>setTimeout(resolve,50)); }
  }
  assert.ok(response,'Backend did not start');
  assert.equal(response.status,200);
  assert.deepEqual(await response.json(),{status:'ok'});
  console.log('PASS production startup and GET /health');
} finally {
  if(child.exitCode===null) { const exited=once(child,'exit'); child.kill('SIGTERM'); await exited; }
}
const invalid=spawn(process.execPath,['dist/local.mjs'],{env:{...process.env,PORT:'invalid'},stdio:['ignore','pipe','pipe']});
let error=''; invalid.stderr.on('data',data=>{error+=data;});
const [code]=await once(invalid,'exit');
assert.equal(code,1); assert.match(error,/PORT must be an integer/); assert.ok(!error.includes(' at '));
console.log('PASS invalid configuration exits clearly');
