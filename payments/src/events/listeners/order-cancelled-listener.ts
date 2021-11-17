import {
  OrderCancalledEvent,
  Subjects,
  Listener,
  OrderStatus,
} from "@mk_tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
export class OrderCancelledListener extends Listener<OrderCancalledEvent> {
  subject: Subjects.OrderCancalled = Subjects.OrderCancalled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancalledEvent["data"], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    if (!order) {
      throw new Error("Order not found");
    }
    order.set({ status: OrderStatus.Cancalled });
    await order.save();

    msg.ack();
  }
}
