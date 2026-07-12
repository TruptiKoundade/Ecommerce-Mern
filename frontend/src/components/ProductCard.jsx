import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product._id}`}
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
    >
      <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover h-full w-full"
          loading="lazy"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <span className="text-xs text-brand-600 font-medium uppercase mb-1">{product.category}</span>
        <h3 className="font-semibold text-gray-800 line-clamp-2 mb-1">{product.name}</h3>
        <div className="flex items-center text-yellow-500 text-sm mb-2">
          {'★'.repeat(Math.round(product.rating || 0))}
          {'☆'.repeat(5 - Math.round(product.rating || 0))}
          <span className="text-gray-400 ml-1">({product.numReviews || 0})</span>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
          {product.countInStock === 0 ? (
            <span className="text-xs text-red-500 font-medium">Out of stock</span>
          ) : (
            <span className="text-xs text-green-600 font-medium">In stock</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
