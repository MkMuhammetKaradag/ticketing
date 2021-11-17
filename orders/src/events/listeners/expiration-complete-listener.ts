import {
  ExpirationCompleteEvent,
  Listener,
  Subjects,
  OrderStatus,
} from "@mk_tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queugroup-name";
import { Order } from "../../models/order";
import { OrderCancalledPublisher } from "../publishers/order-cancalled-publisher";

export class ExpiirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) {
      throw new Error("Order notr found");
    }
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }
    order.set({
      status: OrderStatus.Cancalled,
    });
    await order.save();
    await new OrderCancalledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
    msg.ack();
  }
}
