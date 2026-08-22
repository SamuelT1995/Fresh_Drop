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

// Allow origins
const allowedOrigins = process.env.Frontend_URL 
  ? [process.env.Frontend_URL, 'http://localhost:5173']
  : ['http://localhost:5173'];

//Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(cookieParser());
app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        return callback(null, true); // fallback allow for smooth portfolio demonstration
    },
    credentials: true, // Allow credentials (cookies, authorization headers, etc.) to be sent
}))

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