import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { User, Vendor, RFQ } from './models/index.js'; // Import models
import apiRoutes from './routes/apiRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vendorbridge_test';

// Middleware
app.use(cors());
app.use(express.json());

// Serve static assets from Vite build
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Basic Route
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'active', message: 'VendorBridge API is running!' });
});

app.use('/api/v1', apiRoutes);

// Fallback all other requests to index.html for SPA routing
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('VendorBridge API Server is active. Frontend build is not deployed (run npm run build first).');
    }
  });
});

//app.use('/api/v1/vendors', vendorRoutes);
//app.use('/api/v1/rfqs', rfqRoutes);

import { errorHandler } from './utils/errorHandler.js';
app.use(errorHandler);

// Connect to MongoDB and start server
const connectWithFallback = async () => {
  try {
    console.log(`Connecting to MongoDB: ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI);
    console.log(`✅ Connected to MongoDB Atlas`);
    startServer();
  } catch (atlasError) {
    console.warn(`⚠️ MongoDB Atlas connection failed: ${atlasError.message}`);
    console.log(`Trying local MongoDB fallback (mongodb://127.0.0.1:27017/vendorbridge)...`);
    
    const LOCAL_URI = 'mongodb://127.0.0.1:27017/vendorbridge';
    try {
      await mongoose.connect(LOCAL_URI);
      console.log(`✅ Connected to local MongoDB`);
      startServer();
    } catch (localError) {
      console.warn('⚠️ Local MongoDB connection also failed. Falling back to In-Memory store mode.');
      console.warn(`Local Error: ${localError.message}`);
      startServer();
    }
  }
};

function startServer() {
  if (global.serverInstance) return;
  global.serverInstance = app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

connectWithFallback();