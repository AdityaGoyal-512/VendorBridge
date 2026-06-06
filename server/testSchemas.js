import mongoose from 'mongoose';
import { User, Vendor } from './models/index.js';

// Replace with your MongoDB connection string (e.g., local MongoDB or Atlas)
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://atharvachhaparwal_db_user:BYAQpHHfXQXQaR0A@clusterx.yjk6jut.mongodb.net/vendorbridge_test?appName=ClusterX';

async function testSchemas() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected successfully!');

    // Clean up the test database before testing
    await mongoose.connection.db.dropDatabase();
    console.log('🧹 Cleaned up test database.');

    // 1. Test Valid User Creation
    console.log('\n--- Testing Valid User ---');
    const adminUser = new User({
      name: 'Aditya Goyal',
      email: 'aditya@example.com',
      password: 'hashedpassword123',
      role: 'admin'
    });
    
    await adminUser.save();
    console.log('✅ Valid User saved successfully:', adminUser.email);

    // 2. Test Invalid User Creation (Missing Required Field)
    console.log('\n--- Testing Invalid User (Missing Role) ---');
    try {
      const invalidUser = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'pass'
        // role is intentionally left out
      });
      await invalidUser.save();
      console.log('❌ Error: This should not have saved!');
    } catch (err) {
      console.log('✅ Successfully caught validation error for missing role:', err.message);
    }

    // 3. Test Valid Vendor Creation
    console.log('\n--- Testing Valid Vendor ---');
    const validVendor = new Vendor({
      name: 'TechCorp Supplies',
      gstNumber: '22AAAAA0000A1Z5', // Valid 15-char GST format
      email: 'contact@techcorp.com',
      phone: '1234567890',
      category: 'Electronics',
      createdBy: adminUser._id
    });
    
    await validVendor.save();
    console.log('✅ Valid Vendor saved successfully:', validVendor.name);

    // 4. Test Invalid Vendor Creation (Bad GST Format)
    console.log('\n--- Testing Invalid Vendor (Bad GST) ---');
    try {
      const invalidVendor = new Vendor({
        name: 'Bad Vendor',
        gstNumber: 'INVALID_GST_123', // Does not match regex
        email: 'bad@vendor.com',
        phone: '000000',
        category: 'Supplies',
        createdBy: adminUser._id
      });
      await invalidVendor.save();
      console.log('❌ Error: This should not have saved!');
    } catch (err) {
      console.log('✅ Successfully caught validation error for invalid GST:', err.message);
    }

    console.log('\n🎉 Schema tests completed successfully!');

  } catch (error) {
    console.error('❌ Database connection or unexpected error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB.');
  }
}

testSchemas();
