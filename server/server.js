import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { User, Vendor, RFQ } from './models/index.js'; // Import models
import vendorRoutes from './routes/vendorRoutes.js';
import rfqRoutes from './routes/rfqRoutes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vendorbridge_test';

// Middleware
app.use(cors());
app.use(express.json());
import cookieParser from 'cookie-parser';
app.use(cookieParser());

import quotationRoutes from './routes/quotationRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Basic Route
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'active', message: 'VendorBridge API is running!' });
});

app.use('/api/v1/vendors', vendorRoutes);
app.use('/api/v1/rfqs', rfqRoutes);

// API Routes
app.use('/api/v1/quotations', quotationRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    console.log(`Connecting to MongoDB at: ${MONGO_URI.substring(0, 30)}...`);
    await mongoose.connect(MONGO_URI);
    console.log(`✅ Connected to MongoDB (Remote/Atlas)`);
  } catch (error) {
    console.error('❌ Remote MongoDB connection error:', error.message);
    const localUri = 'mongodb://127.0.0.1:27017/vendorbridge';
    try {
      console.log(`Attempting fallback to local MongoDB at: ${localUri}`);
      await mongoose.connect(localUri);
      console.log(`✅ Connected to local MongoDB`);
    } catch (localError) {
      console.error('❌ Local MongoDB fallback failed:', localError.message);
      console.warn('⚠️ Server starting without active database connection.');
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
};

startServer();
