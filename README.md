# FreshDrop 🛒

FreshDrop is a full-stack e-commerce web application built using the **MERN stack** (MongoDB, Express, React, Node.js). It provides a seamless shopping experience for customers and a complete management dashboard for sellers.

## 🚀 Features

### For Users (Shoppers)
* **User Authentication:** Secure signup and login using JWT and bcrypt.
* **Browse Products:** View all available products and filter them by category.
* **Shopping Cart:** Add products to the cart, update quantities, and seamlessly remove items.
* **Secure Checkout:** Full payment integration utilizing Stripe.
* **Order Tracking:** Users can view their order history and current status.

### For Sellers (Admins)
* **Admin Dashboard:** A dedicated layout for sellers to manage the store.
* **Inventory Management:** Add new products with image uploads via Cloudinary, and toggle product stock status.
* **Order Management:** View all incoming orders from customers.

## 🛠️ Tech Stack

**Frontend:**
* React 19
* Vite (Build Tool)
* Tailwind CSS (Styling)
* React Router DOM (Navigation)
* Axios (HTTP Client)

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose (Database)
* JSON Web Tokens (JWT) & bcrypt (Security)
* Stripe (Payment Gateway)
* Cloudinary (Image Hosting)

## 💻 Getting Started (Local Development)

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) installed on your machine.

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Fresh_Drop
```

### 2. Backend Setup
Navigate into the `server` folder, install dependencies, and set up your environment variables.
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add the following:
```env
MONGODB_URI="your_mongodb_connection_string"
JWT_SECRET="your_secret_string"
NODE_ENV="development"
Frontend_URL="http://localhost:5173"

# Admin Credentials
SELLER_EMAIL="admin@example.com"
SELLER_PASSWORD="your_admin_password"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Stripe
STRIPE_SECRET_KEY="your_stripe_secret_key"
```
Start the backend server:
```bash
npm run server
```

### 3. Frontend Setup
Open a new terminal, navigate to the `client` folder, install dependencies, and configure environment variables.
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_BACKEND_URL="http://localhost:4000"
```
Start the frontend development server:
```bash
npm run dev
```

Your app will now be running at `http://localhost:5173`!
