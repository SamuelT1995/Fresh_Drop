import 'dotenv/config'; // Import dotenv to load environment variables
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js'; // Import the database connection function
import userRouter from './routes/userRoute.js'; // Import the user router
import sellerRoute from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/ProductRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express();
const port = process.env.PORT || 4000; 

connectDB(); // Connect to MongoDB
connectCloudinary(); // Connect to Cloudinary

// 1. Custom CORS middleware FIRST (before any body parsers)
app.use((req, res, next) => {
    const origin = req.headers.origin || 'https://fresh-drop-fe.vercel.app';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, token, X-Requested-With');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// 2. Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/user', userRouter); // Use the user router for user-related routes
app.use('/api/seller', sellerRoute); // Use the seller router for seller-related routes
app.use('/api/product', productRouter); // Use the product router for product-related routes
app.use('/api/cart', cartRouter); // Use the cart router for cart-related routes
app.use('/api/address', addressRouter) // Use the address router for address-related routes
app.use('/api/orders', orderRouter) // Use the order router for order-related routes

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Server running on port http://localhost:${port}`);
    });
}

export default app;