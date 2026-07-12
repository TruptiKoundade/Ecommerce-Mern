import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="max-w-2xl mx-auto px-4 py-24 text-center">
    <h1 className="text-6xl font-bold text-brand-600 mb-4">404</h1>
    <p className="text-gray-600 mb-6">Oops! The page you're looking for doesn't exist.</p>
    <Link to="/" className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-md font-medium">
      Go Home
    </Link>
  </div>
);

export default NotFound;
