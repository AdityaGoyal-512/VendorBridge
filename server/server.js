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

// Basic Route
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'active', message: 'VendorBridge API is running!' });
});

app.use('/api/v1/vendors', vendorRoutes);
app.use('/api/v1/rfqs', rfqRoutes);

// Connect to MongoDB and start server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`✅ Connected to MongoDB`);
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });
