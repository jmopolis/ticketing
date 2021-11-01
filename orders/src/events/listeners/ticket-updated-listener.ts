import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@jmoptickets/common';
import { Ticket } from '../../models';
import { queueGroupName } from './';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { id, title, price, version } = data;
    const ticket = await Ticket.findByEvent({ id, version });

    if (!ticket) throw new Error('Ticket not found');

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
