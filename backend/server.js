import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/products.route.js';
import cartRoutes from './routes/cart.route.js';
import couponRoutes from './routes/coupon.route.js';
import paymentRoutes from './routes/payment.route.js';
import analyticsRoutes from './routes/analytics.route.js';
import { connectDB } from './lib/db.js';
import { connectRedis } from './lib/redis.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  connectDB();
  connectRedis();
});
