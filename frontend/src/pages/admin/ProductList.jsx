import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products', { params: { page, limit: 10 } });
      setProducts(data.products);
      setPages(data.pages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>
        <Link
          to="/admin/products/new"
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + Add Product
        </Link>
      </div>

      {error && <div className="mb-4"><Message type="error">{error}</Message></div>}

      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Image</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Price</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Stock</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="px-4 py-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-md" />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">{p.name}</td>
                  <td className="px-4 py-3 text-gray-600">{p.category}</td>
                  <td className="px-4 py-3 text-gray-800">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={p.countInStock === 0 ? 'text-red-500' : 'text-gray-600'}>
                      {p.countInStock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link to={`/admin/products/${p._id}/edit`} className="text-brand-600 hover:underline font-medium">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:underline font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-md text-sm font-medium ${
                p === page ? 'bg-brand-600 text-white' : 'bg-white border text-gray-700 hover:bg-gray-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
