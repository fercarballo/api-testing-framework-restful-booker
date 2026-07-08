import { test, expect } from '@fixtures/api.fixture';
import { BookingSchema } from '@schemas/booking.schema';
import { BookingBuilder } from '@data/booking.builder';

test.describe('Actualizar reserva (requiere autenticación)', () => {
  test('PUT reemplaza la reserva completa con un token válido @regression', async ({
    bookingClient,
    authToken,
    createdBooking,
  }) => {
    const actualizado = new BookingBuilder()
      .withFirstName('Actualizado')
      .withTotalPrice(999)
      .build();

    const response = await bookingClient.update(createdBooking.id, actualizado, authToken);
    expect(response.status()).toBe(200);

    const body = BookingSchema.parse(await response.json());
    expect(body.firstname).toBe('Actualizado');
    expect(body.totalprice).toBe(999);
  });

  test('PUT sin token devuelve 403 Forbidden @regression', async ({ request, createdBooking }) => {
    // Hacemos la request "a mano" (sin el header Cookie) para probar el caso sin auth.
    const response = await request.put(`/booking/${createdBooking.id}`, {
      data: new BookingBuilder().build(),
    });
    expect(response.status()).toBe(403);
  });

  test('PATCH actualiza solo los campos enviados, dejando el resto intacto @regression', async ({
    bookingClient,
    authToken,
    createdBooking,
  }) => {
    const response = await bookingClient.partialUpdate(
      createdBooking.id,
      { firstname: 'Parcial' },
      authToken,
    );
    expect(response.status()).toBe(200);

    const body = BookingSchema.parse(await response.json());
    expect(body.firstname).toBe('Parcial'); // lo que cambiamos
    expect(body.lastname).toBe(createdBooking.payload.lastname); // lo que NO tocamos, intacto
  });
});
