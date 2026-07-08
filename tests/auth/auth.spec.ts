import { test, expect } from '@fixtures/api.fixture';
import { AuthTokenResponseSchema, BadCredentialsSchema } from '@schemas/auth.schema';
import { ENV } from '@config/env';

test.describe('Autenticación (POST /auth)', () => {
  test('credenciales válidas devuelven un token con el contrato correcto @smoke @regression', async ({
    authClient,
  }) => {
    const response = await authClient.createToken(ENV.username, ENV.password);

    expect(response.status()).toBe(200);

    // Contract testing: la respuesta debe tener la forma { token: string }.
    const body = AuthTokenResponseSchema.parse(await response.json());
    expect(body.token).not.toHaveLength(0); // token no vacío
  });

  test('credenciales inválidas devuelven "Bad credentials" con status 200 @regression', async ({
    authClient,
  }) => {
    const response = await authClient.createToken(ENV.username, 'password_incorrecta');

    // ⚠️ RAREZA REAL de la API: no es 401, es 200. Verificamos el comportamiento REAL.
    expect(response.status()).toBe(200);

    const body = BadCredentialsSchema.parse(await response.json());
    expect(body.reason).toBe('Bad credentials');
  });
});
