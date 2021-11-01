import Link from 'next/link';

const Landing = ({ tickets }) => {
  const ticketList = tickets.map(ticket => {
    const { id, title, price } = ticket;
    return (
      <tr key={id}>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${id}`}>
            <a className="nav-link">{title}</a>
          </Link>
        </td>
        <td>{price}</td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

Landing.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default Landing;
