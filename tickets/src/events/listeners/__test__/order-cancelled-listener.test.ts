import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, OrderStatus } from '@jmoptickets/common';
import { OrderCancelledListener } from '../';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = global.mongoId();
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: global.mongoId(),
  });
  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: { id: ticket.id },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, ticket, listener, orderId };
};

it('updates the tickets, publishes an event, and acks the message', async () => {
  const { msg, data, ticket, listener, orderId } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toBeUndefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
