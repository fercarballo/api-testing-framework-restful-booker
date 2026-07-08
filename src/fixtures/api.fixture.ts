import { test as base } from '@playwright/test';
import { AuthClient } from '@clients/AuthClient';
import { BookingClient } from '@clients/BookingClient';
import { BookingBuilder } from '@data/booking.builder';
import { Booking } from '@schemas/booking.schema';
import { ENV } from '@config/env';

/**
 * FIXTURES de API.
 *
 * Igual que en el Proyecto 1, extendemos el `test` de Playwright para inyectar
 * lo que los tests necesitan ya construido. Acá inyectamos:
 *   - los clients (AuthClient, BookingClient)
 *   - un token de autenticación ya obtenido (authToken)
 *   - una reserva YA CREADA por API (createdBooking) → el "setup por API"
 *
 * El fixture `request` es de Playwright: es el APIRequestContext con la baseURL
 * y los headers de playwright.config.ts ya aplicados.
 */

type ApiFixtures = {
  authClient: AuthClient;
  bookingClient: BookingClient;
  /** Token válido, obtenido una vez para el test que lo pida. */
  authToken: string;
  /**
   * SETUP POR API: crea una reserva vía POST /booking y entrega su id + payload.
   * Los tests de leer/actualizar/borrar arrancan desde una reserva real ya
   * existente, sin depender de datos preexistentes en el servidor compartido.
   * Al terminar, la borra (teardown) para no dejar basura.
   */
  createdBooking: { id: number; payload: Booking };
};

export const test = base.extend<ApiFixtures>({
  authClient: async ({ request }, use) => {
    await use(new AuthClient(request));
  },

  bookingClient: async ({ request }, use) => {
    await use(new BookingClient(request));
  },

  authToken: async ({ authClient }, use) => {
    const token = await authClient.getToken(ENV.username, ENV.password);
    await use(token);
  },

  createdBooking: async ({ bookingClient, authToken }, use) => {
    // --- setup: crear la reserva por API ---
    const payload = new BookingBuilder().build();
    const response = await bookingClient.create(payload);
    const body = await response.json();
    const id: number = body.bookingid;

    // --- entregar al test ---
    await use({ id, payload });

    // --- teardown: limpiar (best-effort, sin romper si ya no existe) ---
    await bookingClient.delete(id, authToken).catch(() => {
      /* si el test ya la borró o el server la purgó, no pasa nada */
    });
  },
});

export { expect } from '@playwright/test';
