// Run with: npm run seed        -> imports sample data
//           npm run seed:destroy -> deletes all data
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

dotenv.config();
connectDB();

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
  },
];

// Images are real photos from Unsplash (images.unsplash.com), individually chosen to
// match each product category (e.g. an actual photo of headphones for the headphones
// listing). Free to use under the Unsplash License — https://unsplash.com/license
const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Over-ear wireless headphones with active noise cancellation and 30-hour battery life.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format',
    category: 'Electronics',
    brand: 'SoundMax',
    countInStock: 25,
  },
  {
    name: 'Smartphone 128GB',
    description: 'Latest generation smartphone with a 6.5 inch display, triple camera, and fast charging.',
    price: 499.99,
    image: 'https://images.unsplash.com/photo-1617300040847-369dee9d35f1?w=400&h=400&fit=crop&auto=format',
    category: 'Electronics',
    brand: 'TechPro',
    countInStock: 15,
  },
  {
    name: 'Men Running Shoes',
    description: 'Lightweight breathable running shoes ideal for daily training and long runs.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1675625500632-2d276bd51920?w=400&h=400&fit=crop&auto=format',
    category: 'Footwear',
    brand: 'RunFit',
    countInStock: 40,
  },
  {
    name: 'Cotton Casual T-Shirt',
    description: 'Soft, breathable 100% cotton t-shirt available in multiple colors.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop&auto=format',
    category: 'Clothing',
    brand: 'UrbanWear',
    countInStock: 100,
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated stainless steel water bottle, keeps drinks cold for 24 hours.',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1544003484-3cd181d17917?w=400&h=400&fit=crop&auto=format',
    category: 'Home & Kitchen',
    brand: 'HydroLife',
    countInStock: 60,
  },
  {
    name: 'Non-stick Frying Pan',
    description: '12-inch non-stick frying pan with heat-resistant handle, dishwasher safe.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1699811250903-ed5cd4dc63de?w=400&h=400&fit=crop&auto=format',
    category: 'Home & Kitchen',
    brand: 'ChefPro',
    countInStock: 30,
  },
  {
    name: 'Yoga Mat',
    description: 'Extra thick non-slip yoga mat with carrying strap, perfect for home workouts.',
    price: 22.5,
    image: 'https://images.unsplash.com/photo-1548966268-b978ed7b2e83?w=400&h=400&fit=crop&auto=format',
    category: 'Sports & Fitness',
    brand: 'FlexFit',
    countInStock: 50,
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical keyboard with blue switches, ideal for gaming and typing.',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1756694938594-e760b4bd3bfb?w=400&h=400&fit=crop&auto=format',
    category: 'Electronics',
    brand: 'GameGear',
    countInStock: 20,
  },
  {
    name: 'Leather Wallet',
    description: 'Genuine leather bifold wallet with RFID blocking technology.',
    price: 27.99,
    image: 'https://images.unsplash.com/photo-1512415073221-64c70eee25bc?w=400&h=400&fit=crop&auto=format',
    category: 'Accessories',
    brand: 'ClassicLeather',
    countInStock: 45,
  },
  {
    name: 'Backpack 30L',
    description: 'Durable water-resistant backpack with laptop compartment, ideal for travel and college.',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1594299447935-e5b840f54b9b?w=400&h=400&fit=crop&auto=format',
    category: 'Accessories',
    brand: 'TrailPack',
    countInStock: 35,
  },
  {
    name: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 ceramic coffee mugs, microwave and dishwasher safe.',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1504033238493-e87141ad2960?w=400&h=400&fit=crop&auto=format',
    category: 'Home & Kitchen',
    brand: 'HomeStyle',
    countInStock: 55,
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with adjustable DPI and silent clicks.',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1618176729090-253077a8f948?w=400&h=400&fit=crop&auto=format',
    category: 'Electronics',
    brand: 'GameGear',
    countInStock: 70,
  },
];

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.create(users);
    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((p) => ({ ...p, createdBy: adminUser }));
    await Product.insertMany(sampleProducts);

    console.log('Data imported successfully!');
    console.log('Admin login: admin@example.com / admin123');
    console.log('User login: john@example.com / password123');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Data destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
