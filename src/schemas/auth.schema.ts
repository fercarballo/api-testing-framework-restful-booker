import { z } from 'zod';

/**
 * Contratos de autenticación.
 *
 * Detalle importante que descubrimos verificando la API (no asumiendo):
 * cuando las credenciales son INVÁLIDAS, Restful-Booker NO devuelve un 401.
 * Devuelve un 200 con un cuerpo { reason: "Bad credentials" }. Por eso
 * tenemos DOS schemas: uno para el token (éxito) y otro para el rechazo.
 */

/** Respuesta de POST /auth con credenciales válidas. */
export const AuthTokenResponseSchema = z.object({
  token: z.string(),
});

/** Respuesta de POST /auth con credenciales inválidas (¡con status 200!). */
export const BadCredentialsSchema = z.object({
  reason: z.string(),
});
