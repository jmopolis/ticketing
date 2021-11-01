import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

export const buildTicket = async (user: string[]) => {
  return await request(app)
    .post('/api/tickets')
    .set('Cookie', user)
    .send({ title: 'title', price: 20 })
    .expect(201);
};

export const updateTicket = async (
  user: string[],
  id: string,
  data: {},
  expectedStatus: number
) => {
  return await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', user)
    .send({ ...data })
    .expect(expectedStatus);
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
