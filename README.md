# ShopEase — MERN E-Commerce Platform

A complete full-stack online shopping platform built with **MongoDB, Express, React, and Node.js**. Users can browse products, add them to a cart, and place orders. Admins can manage products and orders through a dedicated dashboard.

## Features

**Customer**
- Register / login with JWT authentication
- Browse products with search, category filter, sorting, and pagination
- View product details and customer reviews, and leave your own review
- Add / update / remove items in a persistent cart (stored per-user in the database)
- Checkout with shipping address form and simulated payment (Card / UPI / Cash on Delivery)
- View order history and individual order details
- Cancel an order before it ships
- Edit profile and save a default shipping address

**Admin**
- Dashboard with product/order/user/revenue stats
- Full product CRUD (create, edit, delete)
- View all orders and update order status (Pending → Processing → Shipped → Delivered)
- View all registered users

**Technical**
- JWT-based auth with role-based access control (user vs admin)
- Passwords hashed with bcrypt
- RESTful API with centralized error handling
- Stock is validated and decremented server-side at checkout (never trusts client prices)
- Responsive UI built with React + Tailwind CSS (via CDN, no extra build config needed)


## Tech Stack

| Layer      | Technology                              |
|------------|------------------------------------------|
| Frontend   | React 18, React Router, Axios, Tailwind CSS, Vite |
| Backend    | Node.js, Express                         |
| Database   | MongoDB with Mongoose                    |
| Auth       | JSON Web Tokens (JWT), bcryptjs          |

## 📁 Project Structure

```
ecommerce-mern/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route handler logic
│   ├── middleware/      # Auth, admin, and error-handling middleware
│   ├── models/          # Mongoose schemas (User, Product, Order)
│   ├── routes/          # Express route definitions
│   ├── utils/           # JWT helper + database seeder
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/          # Axios instance with interceptors
    │   ├── components/   # Reusable UI components
    │   ├── context/      # Auth & Cart React Context providers
    │   ├── pages/        # Route-level pages (incl. pages/admin)
    │   ├── styles/
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites
-  [Node.js] v18 or later
-  [MongoDB] running locally, **or** a free [MongoDB Atlas] cluster

### 1. Backend Setup

-  cd backend
-  npm install
-  
  Create `.env` and set your own values:

PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce_mern
JWT_SECRET=replace_this_with_a_long_random_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173

> If you're using MongoDB Atlas, replace `MONGO_URI` with your connection string, e.g.
> `mongodb+srv://<username>:<password>@cluster0.mongodb.net/ecommerce_mern`

**(Optional but recommended)** Seed the database with sample products and demo accounts:

-  npm run seed

This creates:
- Admin login: `admin@example.com` / `admin123`
- User login: `john@example.com` / `password123`
- 12 sample products across several categories

To wipe all data later: `npm run seed:destroy`

Start the backend server:
-  npm run dev

The API will run at `http://localhost:5000`. Visit `http://localhost:5000/api/health` to confirm it's working.

### 2. Frontend Setup

Open a **new terminal window**:

-  cd frontend
-  npm install
-  npm run dev

The app will run at `http://localhost:5173`. 

### 3. Try it out

1. Go to `http://localhost:5173`
2. Log in with the seeded admin account (`admin@example.com` / `admin123`) to access `/admin` and manage products/orders
3. Log in with the seeded user account (or register a new one) to browse, add to cart, and check out

### OUTPUT

<img width="1904" height="898" alt="e1" src="https://github.com/user-attachments/assets/2d1ee5fe-4ca6-46fa-b4ab-7672a948a990" />

<img width="1920" height="908" alt="e2" src="https://github.com/user-attachments/assets/37850b80-da3f-4fc3-840e-068f43cace23" />



