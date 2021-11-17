import { Publisher, OrderCancalledEvent, Subjects } from "@mk_tickets/common";

export class OrderCancalledPublisher extends Publisher<OrderCancalledEvent> {
  subject: Subjects.OrderCancalled = Subjects.OrderCancalled;
}
