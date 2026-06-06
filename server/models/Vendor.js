import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  gstNumber: { 
    type: String, 
    required: true,
    unique: true,
    index: true,
    match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST format']
  },
  email: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  category: { 
    type: String, 
    required: true 
  },
  status: {
    type: String,
    enum: ["active", "inactive", "blacklisted"],
    default: "active"
  },
  rating: { 
    type: Number, 
    min: 0, 
    max: 5, 
    default: 0 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export default mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);
