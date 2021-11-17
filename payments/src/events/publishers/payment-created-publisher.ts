import { PaymentCreatedEvent, Subjects, Publisher } from "@mk_tickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
