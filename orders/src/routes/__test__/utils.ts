import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

export const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'ticket',
    price: 20,
  });
  await ticket.save();
  return ticket;
};

export const createOrder = async (
  user: string[],
  ticketId: any,
  expectedStatus: number
) => {
  return await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId })
    .expect(expectedStatus);
};
