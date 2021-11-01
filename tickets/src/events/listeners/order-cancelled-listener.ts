import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCancelledEvent } from '@jmoptickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './';
import { TicketUpdatedPublisher } from '../publishers';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) throw new Error('Ticket not found');

    ticket.set({ orderId: undefined });
    await ticket.save();
    const { id, price, title, userId, orderId, version } = ticket;

    await new TicketUpdatedPublisher(this.client).publish({
      id,
      price,
      title,
      userId,
      orderId,
      version,
    });

    msg.ack();
  }
}
