# 🛍️ ShopEase — MERN E-Commerce Platform

A complete full-stack online shopping platform built with **MongoDB, Express, React, and Node.js**. Users can browse products, add them to a cart, and place orders. Admins can manage products and orders through a dedicated dashboard.

## ✨ Features

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

## 🧰 Tech Stack

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
- [Node.js](https://nodejs.org/) v18 or later
- [MongoDB](https://www.mongodb.com/try/download/community) running locally, **or** a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and set your own values:

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce_mern
JWT_SECRET=replace_this_with_a_long_random_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

> If you're using MongoDB Atlas, replace `MONGO_URI` with your connection string, e.g.
> `mongodb+srv://<username>:<password>@cluster0.mongodb.net/ecommerce_mern`

**(Optional but recommended)** Seed the database with sample products and demo accounts:

```bash
npm run seed
```

This creates:
- Admin login: `admin@example.com` / `admin123`
- User login: `john@example.com` / `password123`
- 12 sample products across several categories

To wipe all data later: `npm run seed:destroy`

Start the backend server:

```bash
npm run dev
```

The API will run at `http://localhost:5000`. Visit `http://localhost:5000/api/health` to confirm it's working.

### 2. Frontend Setup

Open a **new terminal window**:

```bash
cd frontend
npm install
npm run dev
```

The app will run at `http://localhost:5173`. The Vite dev server is pre-configured to proxy `/api` requests to `http://localhost:5000`, so no extra `.env` setup is required for local development.

### 3. Try it out

1. Go to `http://localhost:5173`
2. Log in with the seeded admin account (`admin@example.com` / `admin123`) to access `/admin` and manage products/orders
3. Log in with the seeded user account (or register a new one) to browse, add to cart, and check out

## 🔑 API Overview

| Method | Endpoint                       | Description                        | Access        |
|--------|----------------------------------|-------------------------------------|---------------|
| POST   | `/api/auth/register`            | Register new user                   | Public        |
| POST   | `/api/auth/login`                | Login                                | Public        |
| GET    | `/api/auth/profile`              | Get current user profile             | Private       |
| PUT    | `/api/auth/profile`              | Update profile                       | Private       |
| GET    | `/api/products`                  | List products (search/filter/paginate) | Public     |
| GET    | `/api/products/:id`               | Get single product                   | Public        |
| POST   | `/api/products`                  | Create product                       | Admin         |
| PUT    | `/api/products/:id`               | Update product                       | Admin         |
| DELETE | `/api/products/:id`               | Delete product                       | Admin         |
| POST   | `/api/products/:id/reviews`       | Add product review                   | Private       |
| GET    | `/api/cart`                      | Get current user's cart              | Private       |
| POST   | `/api/cart`                      | Add item to cart                     | Private       |
| PUT    | `/api/cart/:productId`            | Update cart item quantity            | Private       |
| DELETE | `/api/cart/:productId`            | Remove item from cart                | Private       |
| POST   | `/api/orders`                    | Place an order (checkout)            | Private       |
| GET    | `/api/orders/my-orders`           | Get logged-in user's orders          | Private       |
| GET    | `/api/orders/:id`                 | Get single order                     | Private/Admin |
| GET    | `/api/orders`                    | Get all orders                       | Admin         |
| PUT    | `/api/orders/:id/status`          | Update order status                  | Admin         |
| PUT    | `/api/orders/:id/cancel`          | Cancel an order                      | Private       |
| GET    | `/api/users`                     | List all users                       | Admin         |

## 💳 About Payments

This project **simulates** payment processing rather than integrating a live payment gateway (like Stripe or Razorpay), so you can test the full checkout flow without needing real API keys. Selecting "Card" or "UPI" at checkout instantly marks the order as paid; selecting "Cash on Delivery" leaves it unpaid until delivery. This is clearly noted in the checkout UI. If you'd like to wire up a real gateway later, the `paymentMethod` and `paymentResult` fields on the `Order` model are ready to be extended.

## 📦 Building for Production

```bash
cd frontend
npm run build
```

This outputs static files to `frontend/dist`, which you can deploy to any static host (Vercel, Netlify, etc.). Deploy the `backend` folder separately to a Node host (Render, Railway, Fly.io, etc.), and set `CLIENT_URL` in its `.env` to your deployed frontend URL.

## 📝 License

This project is provided as-is for learning purposes. Feel free to use and modify it freely.
