import { Publisher, Subjects, TicketUpdatedEvent } from "@mk_tickets/common";
export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
