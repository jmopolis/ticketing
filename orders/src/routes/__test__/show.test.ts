import request from 'supertest';
import { app } from '../../app';
import { buildTicket, createOrder } from './utils';

it('fetches the order', async () => {
  const user = global.signin();
  const ticket = await buildTicket();
  const { body: order } = await createOrder(user, ticket.id, 201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("returns a 401 if one user trys to fetch another user's order", async () => {
  const userOne = global.signin();
  const userTwo = global.signin();

  const ticket = await buildTicket();
  const { body: order } = await createOrder(userOne, ticket.id, 201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userTwo)
    .expect(401);
});
