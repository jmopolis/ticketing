import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';

export const createCharge = async (
  user: string[],
  orderId: any,
  expectedStatus: number,
  token?: string
) => {
  return await request(app)
    .post('/api/payments')
    .set('Cookie', user)
    .send({ orderId, token: token || 'asdf' })
    .expect(expectedStatus);
};

export const buildOrder = async (userId: string, price?: number) => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: price || 20,
    userId,
    version: 0,
    status: OrderStatus.Created,
  });
  await order.save();
  return order;
};
