const Orders = ({ orders }) => {
  const orderList = orders.map(order => {
    const { id, ticket, status } = order;
    return (
      <tr key={id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>{status}</td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Orders</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{orderList}</tbody>
      </table>
    </div>
  );
};

Orders.getInitialProps = async (context, client) => {
  const { data: orders } = await client.get('/api/orders');
  return { orders };
};

export default Orders;
