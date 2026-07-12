import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const OrderDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      setCancelling(true);
      await api.put(`/orders/${id}/cancel`);
      fetchOrder();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="max-w-4xl mx-auto px-4 py-8"><Message type="error">{error}</Message></div>;
  if (!order) return null;

  const canCancel = order.user?._id === user?._id && !['Shipped', 'Delivered', 'Cancelled'].includes(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {location.state?.justPlaced && (
        <div className="mb-4"><Message type="success">🎉 Your order has been placed successfully!</Message></div>
      )}

      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-gray-800">Order #{order._id.slice(-8).toUpperCase()}</h1>
        <span className={`text-sm font-medium px-3 py-1 rounded-full ${statusColors[order.status]}`}>
          {order.status}
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-bold text-gray-800 mb-2">Shipping Address</h2>
            <p className="text-sm text-gray-600">
              {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            <p className="text-sm text-gray-600 mt-1">Phone: {order.shippingAddress.phone}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-bold text-gray-800 mb-2">Payment</h2>
            <p className="text-sm text-gray-600">Method: {order.paymentMethod}</p>
            <p className={`text-sm font-medium mt-1 ${order.isPaid ? 'text-green-600' : 'text-red-500'}`}>
              {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleString()}` : 'Not Paid Yet'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-bold text-gray-800 mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.orderItems.map((item) => (
                <div key={item.product} className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-md" />
                  <Link to={`/product/${item.product}`} className="flex-1 text-sm text-gray-700 hover:text-brand-600">
                    {item.name}
                  </Link>
                  <span className="text-sm text-gray-500">{item.quantity} x ${item.price.toFixed(2)}</span>
                  <span className="text-sm font-semibold text-gray-800 w-20 text-right">
                    ${(item.quantity * item.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 h-fit space-y-2">
          <h2 className="font-bold text-gray-800 mb-2">Order Summary</h2>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Items</span><span>${order.itemsPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tax</span><span>${order.taxPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 border-t pt-2">
            <span>Total</span><span>${order.totalPrice.toFixed(2)}</span>
          </div>

          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="w-full mt-4 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 rounded-md text-sm"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
