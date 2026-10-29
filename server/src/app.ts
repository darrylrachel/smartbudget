import Fastify, { LogController, type FastifyError } from 'fastify';
export function createApp(logging = false) {
  const app = Fastify({
    logger: logging, logController: new LogController({ disableRequestLogging: true }), requestIdHeader: false,
    bodyLimit: 16384, requestTimeout: 10000,
    ajv: { customOptions: { coerceTypes: false, removeAdditional: false, useDefaults: false } },
  });
  app.addHook('onSend', async (_request, reply, payload) => {
    reply.header('Cache-Control', 'no-store').header('X-Content-Type-Options', 'nosniff');
    return payload;
  });
  app.setErrorHandler<FastifyError>((error, request, reply) => {
    const status = error.statusCode && error.statusCode >= 400 && error.statusCode < 500 ? error.statusCode : 500;
    // Never log raw errors, URLs, headers, bodies or financial inputs.
    request.log.error({ requestId: request.id, status }, 'Request failed');
    void reply.code(status).send({ error: status === 500 ? 'Internal server error' : 'Invalid request' });
  });
  app.setNotFoundHandler((_request, reply) => reply.code(404).send({ error: 'Not found' }));
  app.get('/health', { schema: { response: { 200: { type: 'object', additionalProperties: false, required: ['status'], properties: { status: { type: 'string', const: 'ok' } } } } } }, async () => ({ status: 'ok' }));
  return app;
}
