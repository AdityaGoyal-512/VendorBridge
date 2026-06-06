import mongoose from 'mongoose';

const purchaseOrderSchema = new mongoose.Schema({
  poNumber: { 
    type: String, 
    required: true,
    unique: true,
    index: true
  },
  quotationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Quotation',
    required: true
  },
  vendorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vendor',
    required: true
  },
  items: [{
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    total: { type: Number, required: true }
  }],
  taxPercent: { 
    type: Number, 
    required: true 
  },
  taxAmount: { 
    type: Number, 
    required: true 
  },
  subtotal: { 
    type: Number, 
    required: true 
  },
  totalAmount: { 
    type: Number, 
    required: true 
  },
  status: {
    type: String,
    enum: ["generated", "sent", "acknowledged", "fulfilled", "draft", "pending", "approved", "shipped", "delivered"],
    default: "generated"
  },
  pdfUrl: { 
    type: String 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export default mongoose.models.PurchaseOrder || mongoose.model('PurchaseOrder', purchaseOrderSchema);
