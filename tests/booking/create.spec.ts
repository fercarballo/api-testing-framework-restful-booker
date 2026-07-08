import { test, expect } from '@fixtures/api.fixture';
import { CreateBookingResponseSchema } from '@schemas/booking.schema';
import { BookingBuilder } from '@data/booking.builder';

test.describe('Crear reserva (POST /booking)', () => {
  test('crea una reserva y respeta el contrato de respuesta @smoke @regression', async ({
    bookingClient,
  }) => {
    const payload = new BookingBuilder().build();

    const response = await bookingClient.create(payload);
    expect(response.status()).toBe(200);

    // Contract testing: validar la FORMA de la respuesta (bookingid + booking).
    const body = CreateBookingResponseSchema.parse(await response.json());

    // Verificación de datos: la reserva devuelta refleja exactamente lo enviado.
    expect(body.bookingid).toBeGreaterThan(0);
    expect(body.booking).toEqual(payload);
  });

  test('acepta una reserva sin el campo opcional additionalneeds @regression', async ({
    bookingClient,
  }) => {
    const payload = new BookingBuilder().withoutAdditionalNeeds().build();

    const response = await bookingClient.create(payload);
    expect(response.status()).toBe(200);

    const body = CreateBookingResponseSchema.parse(await response.json());
    expect(body.booking.additionalneeds).toBeUndefined();
  });
});
