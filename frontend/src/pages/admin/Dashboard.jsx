import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          api.get('/products', { params: { limit: 1 } }),
          api.get('/orders'),
          api.get('/users'),
        ]);

        const revenue = ordersRes.data
          .filter((o) => o.isPaid)
          .reduce((acc, o) => acc + o.totalPrice, 0);

        setStats({
          products: productsRes.data.total,
          orders: ordersRes.data.length,
          users: usersRes.data.length,
          revenue,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  const cards = [
    { label: 'Total Products', value: stats.products, link: '/admin/products', color: 'bg-blue-500' },
    { label: 'Total Orders', value: stats.orders, link: '/admin/orders', color: 'bg-purple-500' },
    { label: 'Total Users', value: stats.users, link: null, color: 'bg-green-500' },
    { label: 'Total Revenue', value: `$${stats.revenue.toFixed(2)}`, link: null, color: 'bg-amber-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((card) => {
          const content = (
            <div className="bg-white rounded-lg shadow p-6">
              <div className={`w-10 h-10 rounded-md ${card.color} mb-3`}></div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          );
          return card.link ? (
            <Link key={card.label} to={card.link}>{content}</Link>
          ) : (
            <div key={card.label}>{content}</div>
          );
        })}
      </div>

      <div className="flex gap-4 flex-wrap">
        <Link
          to="/admin/products"
          className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-md text-sm font-medium"
        >
          Manage Products
        </Link>
        <Link
          to="/admin/orders"
          className="bg-white border hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-md text-sm font-medium"
        >
          Manage Orders
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
