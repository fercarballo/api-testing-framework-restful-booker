import { Booking } from '@schemas/booking.schema';

/**
 * Builder de datos de reserva (mismo patrón que el Proyecto 1).
 *
 * Permite construir un payload válido por defecto y variar solo lo que cada
 * test necesita, de forma legible:
 *
 *     new BookingBuilder().withTotalPrice(500).build();
 *     new BookingBuilder().withoutAdditionalNeeds().build();
 */
export class BookingBuilder {
  private booking: Booking = {
    firstname: 'Fernando',
    lastname: 'Carballo',
    totalprice: 150,
    depositpaid: true,
    bookingdates: { checkin: '2026-08-01', checkout: '2026-08-10' },
    additionalneeds: 'Breakfast',
  };

  withFirstName(value: string): this {
    this.booking.firstname = value;
    return this;
  }

  withLastName(value: string): this {
    this.booking.lastname = value;
    return this;
  }

  withTotalPrice(value: number): this {
    this.booking.totalprice = value;
    return this;
  }

  withDepositPaid(value: boolean): this {
    this.booking.depositpaid = value;
    return this;
  }

  /** Quita el campo opcional additionalneeds (para probar ese caso). */
  withoutAdditionalNeeds(): this {
    delete this.booking.additionalneeds;
    return this;
  }

  /**
   * Devuelve una copia PROFUNDA (deep clone). Usamos structuredClone y no
   * `{ ...this.booking }` porque el spread es una copia SUPERFICIAL: dejaría
   * `bookingdates` (un objeto anidado) compartido entre distintos builds, lo
   * que provocaría que dos tests se pisen. La copia profunda evita ese bug.
   */
  build(): Booking {
    return structuredClone(this.booking);
  }
}
