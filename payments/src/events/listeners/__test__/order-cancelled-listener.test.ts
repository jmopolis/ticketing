import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent } from '@jmoptickets/common';
import { OrderCancelledListener } from '../';
import { natsWrapper } from '../../../nats-wrapper';
import { Order, OrderStatus } from '../../../models/order';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: mongoId(),
    userId: mongoId(),
    price: 100,
    version: 0,
    status: OrderStatus.Created,
  });
  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: { id: mongoId() },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('cancels the order', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order).toBeDefined();
  expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the msg', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
