import request from 'supertest';
import { app } from '../../app';
import { buildTicket, createOrder } from './utils';

it('fetches orders for a particular user', async () => {
  // Create three tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  // Create one order as User #1
  const userOne = global.signin();
  await createOrder(userOne, ticketOne.id, 201);

  // Create two orders as User #2
  const userTwo = global.signin();
  const { body: orderOne } = await createOrder(userTwo, ticketTwo.id, 201);
  const { body: orderTwo } = await createOrder(userTwo, ticketThree.id, 201);

  // Make request to get orders from User #2
  const { body } = await request(app).get('/api/orders').set('Cookie', userTwo);

  // Make sure we only got the orders for User #2
  expect(body.length).toEqual(2);
  expect(body[0].id).toEqual(orderOne.id);
  expect(body[1].id).toEqual(orderTwo.id);
  expect(body[0].ticket.id).toEqual(ticketTwo.id);
  expect(body[1].ticket.id).toEqual(ticketThree.id);
});
