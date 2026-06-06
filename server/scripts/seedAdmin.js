import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import config from '../config/index.js';

dotenv.config();

/**
 * Seeds an initial admin user if one doesn't already exist.
 * Run with: node server/scripts/seedAdmin.js
 */
async function seedAdmin() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log(`Admin already exists: ${existingAdmin.email}`);
      process.exit(0);
    }

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@vendorbridge.com',
      password: 'Admin@2024', // Will be hashed by pre-save hook
      role: 'admin',
      phone: '+1 (555) 000-0001',
      isActive: true,
    });

    console.log('✅ Admin user created successfully:');
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Password: Admin@2024`);
    console.log(`   Role:     ${admin.role}`);
    console.log('\n⚠️  Change this password after first login!');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seedAdmin();
