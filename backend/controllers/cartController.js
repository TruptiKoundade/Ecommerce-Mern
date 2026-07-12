const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart (or increase quantity if it already exists)
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const qty = Number(quantity) || 1;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.countInStock < qty) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    const user = await User.findById(req.user._id);
    const existingItem = user.cart.find((item) => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      user.cart.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: qty,
      });
    }

    await user.save();
    res.status(201).json(user.cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Update quantity of a cart item
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user._id);

    const item = user.cart.find((i) => i.product.toString() === req.params.productId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      user.cart = user.cart.filter((i) => i.product.toString() !== req.params.productId);
    } else {
      item.quantity = quantity;
    }

    await user.save();
    res.json(user.cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove an item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter((i) => i.product.toString() !== req.params.productId);
    await user.save();
    res.json(user.cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Clear the entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    res.json(user.cart);
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
