import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@jmoptickets/common';
import { Order } from '../../models/order';
import { queueGroupName } from './';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id, version, userId, ticket, status } = data;

    const order = Order.build({
      id,
      version,
      userId,
      price: ticket.price,
      status,
    });
    await order.save();

    msg.ack();
  }
}
