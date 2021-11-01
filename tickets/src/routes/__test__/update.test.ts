import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { buildTicket, updateTicket } from './utils';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await updateTicket(global.signin(), id, { title: 'title', price: 30 }, 404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'title', price: 20 })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const user = global.signin();
  const { body: ticket } = await buildTicket(user);

  await updateTicket(
    global.signin(),
    ticket.id,
    { title: 'title', price: 30 },
    401
  );
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();
  const { body: ticket } = await buildTicket(cookie);

  await updateTicket(cookie, ticket.id, { title: 'title' }, 400);

  await updateTicket(cookie, ticket.id, { price: 30 }, 400);
});

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signin();
  const { body: ticket } = await buildTicket(cookie);

  await updateTicket(
    cookie,
    ticket.id,
    {
      title: 'title 2',
      price: 100,
    },
    200
  );

  const ticketRes = await request(app).get(`/api/tickets/${ticket.id}`).send();

  expect(ticketRes.body.title).toEqual('title 2');
  expect(ticketRes.body.price).toEqual(100);
});

it('publishes an event', async () => {
  const cookie = global.signin();
  const { body: ticket } = await buildTicket(cookie);

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set('Cookie', cookie)
    .send({ title: 'title 2', price: 100 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {
  const user = global.signin();
  const { body: ticket } = await buildTicket(user);

  const updatedTicket = await Ticket.findById(ticket.id);
  updatedTicket!.set({ orderId: global.mongoId() });
  await updatedTicket!.save();

  await updateTicket(
    user,
    updatedTicket!.id,
    { title: 'new title', price: 1000 },
    400
  );
});
