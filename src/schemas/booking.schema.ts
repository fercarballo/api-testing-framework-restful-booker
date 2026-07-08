import { z } from 'zod';

/**
 * SCHEMAS de Zod = CONTRATOS de la API.
 *
 * Un schema describe la FORMA esperada de un dato: qué campos tiene y de qué
 * tipo. Cumple DOS funciones a la vez:
 *
 *   1. Validación en runtime (contract testing): en un test hacemos
 *      `BookingSchema.parse(respuesta)`. Si la API devuelve algo con la forma
 *      incorrecta (falta un campo, cambió un tipo), Zod LANZA un error y el
 *      test falla con un mensaje claro. Esto detecta cambios de contrato que un
 *      simple `status === 200` jamás vería.
 *
 *   2. Única fuente de verdad de los TIPOS: con `z.infer<typeof Schema>`
 *      derivamos el tipo TypeScript directamente del schema. No duplicamos la
 *      definición: el tipo y la validación salen del mismo lugar.
 */

export const BookingDatesSchema = z.object({
  checkin: z.string(),
  checkout: z.string(),
});

/** La forma de una reserva (booking) tal como la maneja la API. */
export const BookingSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  totalprice: z.number(),
  depositpaid: z.boolean(),
  bookingdates: BookingDatesSchema,
  additionalneeds: z.string().optional(), // campo opcional
});

/** La respuesta de POST /booking envuelve la reserva creada + su id. */
export const CreateBookingResponseSchema = z.object({
  bookingid: z.number(),
  booking: BookingSchema,
});

/** GET /booking devuelve una lista de objetos { bookingid }. */
export const BookingIdSchema = z.object({
  bookingid: z.number(),
});
export const BookingListSchema = z.array(BookingIdSchema);

// Tipos derivados del schema (única fuente de verdad).
export type Booking = z.infer<typeof BookingSchema>;
export type CreateBookingResponse = z.infer<typeof CreateBookingResponseSchema>;
