import useRequest from "../../hooks/use-request";
import Router from "next/router";

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push("/orders/[orderId]", `/orders/${order.id}`),
  });
  return (
    <div>
      <h1>{ticket.title}</h1>
      <h1>price:{ticket.price}</h1>
      {errors}
      <button onClick={() => doRequest()} className="btn btn-primary">
        purchase
      </button>
    </div>
  );
};

TicketShow.getInitialProps = async (content, client) => {
  const { ticketId } = content.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};

export default TicketShow;
