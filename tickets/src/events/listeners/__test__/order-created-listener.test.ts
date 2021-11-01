import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@jmoptickets/common';
import { OrderCreatedListener } from '../';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: global.mongoId(),
  });
  await ticket.save();

  const data: OrderCreatedEvent['data'] = {
    version: 0,
    id: global.mongoId(),
    status: OrderStatus.Created,
    userId: global.mongoId(),
    expiresAt: 'asdf',
    ticket: { id: ticket.id, price: ticket.price },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('sets the userId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const json = (natsWrapper.client.publish as jest.Mock).mock.calls[0][1];
  const ticketUpdatedData = JSON.parse(json);

  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
