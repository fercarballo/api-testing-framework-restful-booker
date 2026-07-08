import { test, expect } from '@fixtures/api.fixture';

/**
 * Health check. El endpoint /ping confirma que la API está viva.
 * Detalle: Restful-Booker devuelve 201 (no 200) para el ping. Lo sabemos
 * porque lo verificamos, no porque lo asumimos.
 */
test('GET /ping responde 201 (la API está viva) @smoke', async ({ request }) => {
  const response = await request.get('/ping');
  expect(response.status()).toBe(201);
});
