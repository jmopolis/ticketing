import { createCharge, buildOrder } from './utils';
import { OrderStatus, Payment } from '../../models';
import { stripe } from '../../stripe';

it('returns a 404 when purchasing an order that does not exist', async () => {
  await createCharge(signin(), mongoId(), 404);
});

it('returns a 401 when purchasing an order from a different user', async () => {
  const order = await buildOrder(mongoId());

  await createCharge(signin(), order.id, 401);
});

it('returns a 400 when purchasing an order that is cancelled', async () => {
  const userId = mongoId();
  const order = await buildOrder(userId);
  order.set({ status: OrderStatus.Cancelled });
  await order.save();

  await createCharge(signin(userId), order.id, 400);
});

it('returns a 201 with valid inputs', async () => {
  const price = Math.floor(Math.random() * 100000);
  const userId = mongoId();
  const order = await buildOrder(userId, price);
  await order.save();

  await createCharge(signin(userId), order.id, 201, 'tok_visa');

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find(charge => {
    return charge.amount === price * 100;
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('usd');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });

  expect(payment).not.toBeNull();
});
