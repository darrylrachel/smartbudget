import { createApp } from './app';
import { localPort } from './config';
async function main() {
  const port = localPort(process.env);
  const app = createApp(true);
  let stopping = false;
  const shutdown = () => {
    if (stopping) return;
    stopping = true;
    const deadline = setTimeout(() => { process.exit(1); }, 10000);
    deadline.unref();
    void app.close().then(() => { clearTimeout(deadline); }, () => { process.stderr.write('Backend shutdown failed.\n'); process.exitCode = 1; });
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
  try { await app.listen({ port, host: '127.0.0.1' }); }
  catch {
    process.removeListener('SIGINT', shutdown);
    process.removeListener('SIGTERM', shutdown);
    await app.close();
    throw new Error('Backend could not listen on the configured local port. Check port availability.');
  }
}
void main().catch(error => {
  process.stderr.write(`${error instanceof Error ? error.message : 'Backend startup failed.'}\n`);
  process.exitCode = 1;
});
