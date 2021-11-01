import { useState, useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import StripeCheckout from 'react-stripe-checkout';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const [doRequest, errors] = useRequest({
    url: '/api/payments',
    method: 'post',
    body: { orderId: order.id },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => clearInterval(timerId);
  }, []);

  if (timeLeft < 0) return <div>Order Expired</div>;

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id: token }) => doRequest({ token })}
        stripeKey="pk_test_51Jq3PYDiQ5HwMbwPtXeRdHOTFjo89oB7VYFXPheuiO37QONwoxqxGXL9bXUKP6ukWBe9tNmPG9PIh7OhN6Coljon00OuaSelPD"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;
