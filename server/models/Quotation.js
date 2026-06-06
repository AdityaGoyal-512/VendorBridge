import mongoose from 'mongoose';

const quotationSchema = new mongoose.Schema({
  rfqId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'RFQ',
    required: true,
    index: true
  },
  vendorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vendor',
    required: true,
    index: true
  },
  unitPrice: { 
    type: Number, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  deliveryTime: { 
    type: Number, 
    required: true 
  }, // In days
  notes: { 
    type: String 
  },
  status: {
    type: String,
    enum: ["submitted", "under_review", "accepted", "rejected"],
    default: "submitted"
  },
  submittedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

export default mongoose.models.Quotation || mongoose.model('Quotation', quotationSchema);
