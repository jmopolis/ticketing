import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCompletedEvent } from '@jmoptickets/common';
import { queueGroupName } from './';
import { Order, OrderStatus } from '../../models';

export class OrderCompletedListener extends Listener<OrderCompletedEvent> {
  readonly subject = Subjects.OrderCompleted;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCompletedEvent['data'], msg: Message) {
    const order = await Order.findById(data.id);
    if (!order) throw new Error('Order not found');
    order.set({ status: OrderStatus.Complete });
    await order.save();
    msg.ack();
  }
}
