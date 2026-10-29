export function localPort(env: NodeJS.ProcessEnv): number {
  const value = env.PORT ?? '3001';
  if (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 65535) throw new Error('PORT must be an integer from 1 to 65535');
  return Number(value);
}
