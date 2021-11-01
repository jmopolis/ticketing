import { Message } from 'node-nats-streaming';
import { Subjects, Listener, PaymentCreatedEvent } from '@jmoptickets/common';
import { Order, OrderStatus } from '../../models';
import { queueGroupName } from './';
import { OrderCompletedPublisher } from '../publishers';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const { orderId } = data;
    const order = await Order.findById(orderId);
    if (!order) throw new Error('order not found');

    order.set({ status: OrderStatus.Complete });
    await order.save();

    new OrderCompletedPublisher(this.client).publish({
      id: order.id,
      version: order.version,
    });

    msg.ack();
  }
}
