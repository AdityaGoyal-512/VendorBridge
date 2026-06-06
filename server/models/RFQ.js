import mongoose from 'mongoose';

const rfqSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  productName: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  deadline: { 
    type: Date, 
    required: true 
  },
  attachmentUrl: { 
    type: String 
  },
  status: {
    type: String,
    enum: ["draft", "published", "closed"],
    default: "draft",
    index: true
  },
  assignedVendors: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vendor' 
  }],
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true
  }
}, { timestamps: true });

export default mongoose.models.RFQ || mongoose.model('RFQ', rfqSchema);
