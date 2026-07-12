import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Message from '../components/Message';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, subtotal, loading } = useCart();
  const navigate = useNavigate();

  if (loading) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <Message type="info">
          Your cart is empty. <Link to="/" className="text-brand-600 font-medium hover:underline">Continue shopping</Link>
        </Message>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product} className="bg-white rounded-lg shadow p-4 flex gap-4 items-center">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product}`} className="font-medium text-gray-800 hover:text-brand-600 line-clamp-1">
                    {item.name}
                  </Link>
                  <p className="text-gray-500 text-sm">${item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.product, Number(e.target.value))}
                    className="border rounded-md px-2 py-1.5 text-sm"
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div className="w-20 text-right font-semibold text-gray-800">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button
                  onClick={() => removeFromCart(item.product)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h2 className="font-bold text-lg text-gray-800 mb-4">Order Summary</h2>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Items ({cartItems.reduce((a, i) => a + i.quantity, 0)})</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 mb-4">Tax and shipping calculated at checkout</p>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-md"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
