import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';
import Message from '../components/Message';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my-orders');
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

      {error && <Message type="error">{error}</Message>}

      {!error && orders.length === 0 ? (
        <Message type="info">
          You haven't placed any orders yet. <Link to="/" className="text-brand-600 font-medium hover:underline">Start shopping</Link>
        </Message>
      ) : (
        <div className="bg-white rounded-lg shadow divide-y">
          {orders.map((order) => (
            <Link
              to={`/orders/${order._id}`}
              key={order._id}
              className="flex flex-wrap items-center justify-between p-4 hover:bg-gray-50 gap-3"
            >
              <div>
                <p className="font-medium text-gray-800 text-sm">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-sm text-gray-600">{order.orderItems.length} item(s)</div>
              <div className="font-semibold text-gray-800">${order.totalPrice.toFixed(2)}</div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
                {order.status}
              </span>
              <span className={`text-xs font-medium ${order.isPaid ? 'text-green-600' : 'text-red-500'}`}>
                {order.isPaid ? 'Paid' : 'Not Paid'}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
