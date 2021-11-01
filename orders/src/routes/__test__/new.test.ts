import mongoose from 'mongoose';
import { buildTicket, createOrder } from './utils';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await createOrder(global.signin(), ticketId, 404);
});

it('returns an error if the ticket is aleady reserved', async () => {
  const ticket = await buildTicket();

  await createOrder(global.signin(), ticket.id, 201);

  await createOrder(global.signin(), ticket.id, 400);
});

it('emits an order created event', async () => {
  const ticket = await buildTicket();
  await createOrder(global.signin(), ticket.id, 201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
