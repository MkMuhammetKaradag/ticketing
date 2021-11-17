import { Listener, OrderCancalledEvent, Subjects } from "@mk_tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/tickert-updated-publisher";

export class OrderCancalledListener extends Listener<OrderCancalledEvent> {
  subject: Subjects.OrderCancalled = Subjects.OrderCancalled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancalledEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("ticket not found");
    }
    ticket.set({ orderId: undefined });

    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId,
      userId: ticket.userId,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version,
    });

    msg.ack();
  }
}
