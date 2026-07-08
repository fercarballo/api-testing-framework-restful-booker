import { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * Client de autenticación.
 *
 * Un "API Client" es al testing de API lo que un Page Object es al de UI:
 * encapsula CÓMO se habla con un grupo de endpoints, para que los tests hablen
 * de negocio ("obtené un token") y no de detalles HTTP (rutas, headers, verbos).
 *
 * Recibe el `request` (APIRequestContext) de Playwright, que ya viene con la
 * baseURL y los headers por defecto configurados en playwright.config.ts.
 */
export class AuthClient {
  constructor(private readonly request: APIRequestContext) {}

  /** POST /auth — devuelve la respuesta cruda para poder assertar status + body. */
  createToken(username: string, password: string): Promise<APIResponse> {
    return this.request.post('/auth', { data: { username, password } });
  }

  /**
   * Atajo: hace login y devuelve directamente el token como string.
   * Útil como precondición en tests que necesitan estar autenticados.
   */
  async getToken(username: string, password: string): Promise<string> {
    const response = await this.createToken(username, password);
    const body = await response.json();
    return body.token;
  }
}
