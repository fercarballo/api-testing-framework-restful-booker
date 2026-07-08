import { test, expect } from '@fixtures/api.fixture';
import { BookingListSchema, BookingSchema } from '@schemas/booking.schema';

test.describe('Leer reservas (GET /booking)', () => {
  test('GET /booking devuelve una lista de IDs con el contrato correcto @regression', async ({
    bookingClient,
  }) => {
    const response = await bookingClient.getAll();
    expect(response.status()).toBe(200);

    // La respuesta debe ser un array de objetos { bookingid: number }.
    const body = BookingListSchema.parse(await response.json());
    expect(body.length).toBeGreaterThan(0);
  });

  test('GET /booking/{id} de una reserva existente respeta el contrato @smoke @regression', async ({
    bookingClient,
    createdBooking, // ← setup por API: la reserva ya existe cuando arranca el test
  }) => {
    const response = await bookingClient.getById(createdBooking.id);
    expect(response.status()).toBe(200);

    const body = BookingSchema.parse(await response.json());
    expect(body.firstname).toBe(createdBooking.payload.firstname);
    expect(body.lastname).toBe(createdBooking.payload.lastname);
  });

  test('GET /booking/{id} inexistente devuelve 404 @regression', async ({ bookingClient }) => {
    const response = await bookingClient.getById(99_999_999);
    expect(response.status()).toBe(404);
  });
});
