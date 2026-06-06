import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { User, Vendor, RFQ } from './models/index.js'; // Import models

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

// Example Route: Get all Vendors
app.get('/api/v1/vendors', async (req, res) => {
  try {
    const vendors = await Vendor.find().populate('createdBy', 'name email');
    res.json({ success: true, data: vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

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
