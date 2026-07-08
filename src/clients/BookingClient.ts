import { APIRequestContext, APIResponse } from '@playwright/test';
import { Booking } from '@schemas/booking.schema';

/**
 * Client de reservas (bookings). Encapsula todos los endpoints de /booking.
 *
 * El tipo del payload es `Booking`, derivado del schema de Zod: una sola
 * fuente de verdad para la forma del dato, la validación y el tipado.
 *
 * Cada método devuelve la `APIResponse` cruda (no el body parseado) a propósito:
 * así el test puede assertar tanto el STATUS CODE como el BODY. El parseo y la
 * validación de contrato los hace el test con el schema.
 */
export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  /** GET /booking — lista de IDs de reservas. */
  getAll(): Promise<APIResponse> {
    return this.request.get('/booking');
  }

  /** GET /booking/{id} — detalle de una reserva. */
  getById(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  /** POST /booking — crea una reserva. No requiere autenticación. */
  create(payload: Booking): Promise<APIResponse> {
    return this.request.post('/booking', { data: payload });
  }

  /**
   * PUT /booking/{id} — reemplazo COMPLETO de la reserva. Requiere auth.
   * La API acepta el token vía header `Cookie: token=...` (lo verificamos).
   */
  update(id: number, payload: Booking, token: string): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, {
      data: payload,
      headers: { Cookie: `token=${token}` },
    });
  }

  /** PATCH /booking/{id} — actualización PARCIAL (solo los campos enviados). Requiere auth. */
  partialUpdate(id: number, partial: Partial<Booking>, token: string): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, {
      data: partial,
      headers: { Cookie: `token=${token}` },
    });
  }

  /** DELETE /booking/{id} — elimina la reserva. Requiere auth. */
  delete(id: number, token: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
    });
  }
}
