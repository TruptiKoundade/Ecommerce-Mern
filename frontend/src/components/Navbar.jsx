import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { itemsCount } = useCart();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(keyword.trim() ? `/?keyword=${encodeURIComponent(keyword.trim())}` : '/');
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-brand-700 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        <Link to="/" className="text-xl font-bold tracking-tight whitespace-nowrap">
          🛍️ ShopEase
        </Link>

        <form onSubmit={handleSearch} className="flex-1 min-w-[180px] max-w-xl">
          <div className="flex">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search products..."
              className="w-full px-3 py-2 rounded-l-md text-gray-800 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="bg-brand-500 hover:bg-brand-600 px-4 rounded-r-md text-sm font-medium"
            >
              Search
            </button>
          </div>
        </form>

        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <nav
          className={`${
            menuOpen ? 'flex' : 'hidden'
          } md:flex items-center gap-4 text-sm font-medium w-full md:w-auto flex-col md:flex-row`}
        >
          <Link to="/cart" className="hover:text-blue-200 relative" onClick={() => setMenuOpen(false)}>
            Cart
            {itemsCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemsCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link to="/orders" className="hover:text-blue-200" onClick={() => setMenuOpen(false)}>
                My Orders
              </Link>
              {isAdmin && (
                <Link to="/admin" className="hover:text-blue-200" onClick={() => setMenuOpen(false)}>
                  Admin Dashboard
                </Link>
              )}
              <span className="hidden md:inline text-blue-200">Hi, {user.name.split(' ')[0]}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link
                to="/register"
                className="bg-brand-500 hover:bg-brand-600 px-3 py-1.5 rounded-md"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
