import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import config from './config/index.js';
import { errorHandler } from './utils/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// ─── Core Middleware ───
app.use(cors(config.cors));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Request Logger (dev only) ───
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ─── Health Check ───
app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'VendorBridge API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

// ─── 404 Handler ───
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ─── Global Error Handler ───
app.use(errorHandler);

// ─── Database Connection & Server Start ───
async function startServer() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB');

    app.listen(config.port, () => {
      console.log(`🚀 VendorBridge API server running on port ${config.port}`);
      console.log(`   Health: http://localhost:${config.port}/api/v1/health`);
      console.log(`   Auth:   http://localhost:${config.port}/api/v1/auth`);
      console.log(`   Users:  http://localhost:${config.port}/api/v1/users`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
  process.exit(1);
});

startServer();

export default app;
