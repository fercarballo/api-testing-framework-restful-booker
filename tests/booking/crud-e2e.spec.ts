import { test, expect } from '@fixtures/api.fixture';
import { BookingSchema, CreateBookingResponseSchema } from '@schemas/booking.schema';
import { BookingBuilder } from '@data/booking.builder';
import { ENV } from '@config/env';

/**
 * Test estrella: el ciclo de vida COMPLETO de una reserva en una sola prueba.
 *
 * Esto es ENCADENAMIENTO (chaining): el resultado de un paso alimenta al
 * siguiente. Creamos una reserva, tomamos su id de la respuesta, la leemos,
 * la actualizamos, la borramos y verificamos que ya no existe.
 *
 * Este test NO usa el fixture `createdBooking` a propósito: como maneja todo el
 * ciclo (incluida la baja), crea y elimina su propia reserva para controlar el
 * flujo entero de punta a punta.
 */
test.describe('CRUD end-to-end de una reserva', () => {
  test('crear → leer → actualizar → borrar → verificar 404 @smoke @regression', async ({
    bookingClient,
    authClient,
  }) => {
    // ── CREATE ──────────────────────────────────────────────
    const original = new BookingBuilder().build();
    const createRes = await bookingClient.create(original);
    expect(createRes.status()).toBe(200);
    const { bookingid } = CreateBookingResponseSchema.parse(await createRes.json());

    // ── READ: confirmamos que se persistió tal cual la enviamos ──
    const readRes = await bookingClient.getById(bookingid);
    expect(readRes.status()).toBe(200);
    expect(BookingSchema.parse(await readRes.json())).toEqual(original);

    // ── UPDATE: requiere autenticación ──────────────────────
    const token = await authClient.getToken(ENV.username, ENV.password);
    const modificado = new BookingBuilder().withFirstName('Modificado').withTotalPrice(500).build();
    const updateRes = await bookingClient.update(bookingid, modificado, token);
    expect(updateRes.status()).toBe(200);
    expect(BookingSchema.parse(await updateRes.json()).firstname).toBe('Modificado');

    // ── DELETE ──────────────────────────────────────────────
    // ⚠️ RAREZA REAL: Restful-Booker devuelve 201 Created al borrar (no 200/204).
    const deleteRes = await bookingClient.delete(bookingid, token);
    expect(deleteRes.status()).toBe(201);

    // ── VERIFY: la reserva ya no existe ─────────────────────
    const verifyRes = await bookingClient.getById(bookingid);
    expect(verifyRes.status()).toBe(404);
  });
});
