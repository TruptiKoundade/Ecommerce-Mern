import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addedMsg, setAddedMsg] = useState('');

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');
  const [reviewError, setReviewError] = useState('');

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Product not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      setAdding(true);
      await addToCart(product._id, quantity);
      setAddedMsg('Added to cart!');
      setTimeout(() => setAddedMsg(''), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewMsg('');
    try {
      await api.post(`/products/${id}/reviews`, { rating, comment });
      setReviewMsg('Review submitted successfully!');
      setComment('');
      fetchProduct();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="max-w-4xl mx-auto p-8"><Message type="error">{error}</Message></div>;
  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-brand-600 text-sm mb-4 hover:underline">
        ← Back
      </button>

      <div className="grid md:grid-cols-2 gap-10 bg-white rounded-lg shadow p-6">
        <div className="bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden h-80 md:h-96">
          <img src={product.image} alt={product.name} className="object-contain h-full w-full" />
        </div>

        <div>
          <span className="text-xs text-brand-600 font-medium uppercase">{product.category}</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-1 mb-2">{product.name}</h1>
          <div className="flex items-center text-yellow-500 text-sm mb-3">
            {'★'.repeat(Math.round(product.rating || 0))}
            {'☆'.repeat(5 - Math.round(product.rating || 0))}
            <span className="text-gray-400 ml-2">({product.numReviews} reviews)</span>
          </div>

          <p className="text-gray-600 mb-4 leading-relaxed">{product.description}</p>

          <div className="text-3xl font-bold text-gray-900 mb-4">${product.price.toFixed(2)}</div>

          <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
            <span>Brand: <strong>{product.brand}</strong></span>
            <span>|</span>
            <span>
              Status:{' '}
              {product.countInStock > 0 ? (
                <strong className="text-green-600">In Stock ({product.countInStock})</strong>
              ) : (
                <strong className="text-red-500">Out of Stock</strong>
              )}
            </span>
          </div>

          {product.countInStock > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <label className="text-sm font-medium text-gray-700">Qty:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border rounded-md px-2 py-1.5"
              >
                {Array.from({ length: Math.min(product.countInStock, 10) }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0 || adding}
            className="w-full md:w-auto bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-medium px-6 py-2.5 rounded-md"
          >
            {adding ? 'Adding...' : product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          {addedMsg && <p className="text-green-600 text-sm mt-2">{addedMsg}</p>}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Customer Reviews</h2>

        {product.reviews.length === 0 && <p className="text-gray-500 text-sm mb-4">No reviews yet.</p>}

        <div className="space-y-4 mb-6">
          {product.reviews.map((r) => (
            <div key={r._id} className="border-b pb-3">
              <div className="flex items-center gap-2">
                <strong className="text-sm">{r.name}</strong>
                <span className="text-yellow-500 text-xs">
                  {'★'.repeat(r.rating)}
                  {'☆'.repeat(5 - r.rating)}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-1">{r.comment}</p>
            </div>
          ))}
        </div>

        {user ? (
          <form onSubmit={submitReview} className="max-w-md">
            <h3 className="font-semibold text-gray-800 mb-2">Write a Review</h3>
            {reviewError && <Message type="error">{reviewError}</Message>}
            {reviewMsg && <Message type="success">{reviewMsg}</Message>}
            <div className="mt-3 mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="border rounded-md px-3 py-2 w-full"
              >
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Good</option>
                <option value={3}>3 - Average</option>
                <option value={2}>2 - Poor</option>
                <option value={1}>1 - Terrible</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={3}
                className="border rounded-md px-3 py-2 w-full"
              />
            </div>
            <button
              type="submit"
              className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-md text-sm font-medium"
            >
              Submit Review
            </button>
          </form>
        ) : (
          <Message type="info">Please log in to write a review.</Message>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
