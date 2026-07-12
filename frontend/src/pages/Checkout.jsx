import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Message from '../components/Message';

const Checkout = () => {
  const { cartItems, subtotal, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    address: user?.address?.address || '',
    city: user?.address?.city || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || '',
    phone: user?.address?.phone || '',
  });
  const [paymentMethod, setPaymentMethod] = useState('Simulated');
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  const taxPrice = subtotal * 0.08;
  const shippingPrice = subtotal > 100 ? 0 : 10;
  const totalPrice = subtotal + taxPrice + shippingPrice;

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    try {
      setPlacing(true);
      const orderItems = cartItems.map((item) => ({
        product: item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      }));

      const { data } = await api.post('/orders', {
        orderItems,
        shippingAddress,
        paymentMethod,
      });

      await fetchCart();
      navigate(`/orders/${data._id}`, { state: { justPlaced: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Message type="info">Your cart is empty. Add some products before checking out.</Message>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

      {error && <div className="mb-4"><Message type="error">{error}</Message></div>}

      <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-bold text-lg text-gray-800 mb-4">Shipping Address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-bold text-lg text-gray-800 mb-4">Payment Method</h2>
            <div className="space-y-2">
              {[
                { value: 'Simulated', label: 'Credit / Debit Card (Simulated Payment)' },
                { value: 'UPI', label: 'UPI (Simulated Payment)' },
                { value: 'COD', label: 'Cash on Delivery' },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 border rounded-md px-4 py-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={opt.value}
                    checked={paymentMethod === opt.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              This is a demo checkout — no real payment is processed. Card/UPI payments are marked as paid instantly for demonstration purposes.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="font-bold text-lg text-gray-800 mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax (8%)</span><span>${taxPrice.toFixed(2)}</span></div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 border-t pt-2 text-base">
              <span>Total</span><span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={placing}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-medium py-2.5 rounded-md"
          >
            {placing ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
