import request from 'supertest';
import { app } from '../../app';
import { buildTicket, createOrder } from './utils';
import { OrderStatus } from '../../models';
import { natsWrapper } from '../../nats-wrapper';

it("returns a 401 if user is trying to delete order they don't own", async () => {
  const ticket = await buildTicket();
  const { body: order } = await createOrder(global.signin(), ticket.id, 201);
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});

it('can successfully cancel an order', async () => {
  const user = global.signin();
  const ticket = await buildTicket();
  const { body: order } = await createOrder(user, ticket.id, 201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  const { body: updatedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(updatedOrder.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
  const user = global.signin();
  const ticket = await buildTicket();
  const { body: order } = await createOrder(user, ticket.id, 201);
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
