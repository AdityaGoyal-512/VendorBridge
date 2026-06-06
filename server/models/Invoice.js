import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { 
    type: String, 
    required: true,
    unique: true,
    index: true
  },
  poId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'PurchaseOrder',
    required: true
  },
  vendorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vendor',
    required: true
  },
  gstBreakdown: {
    cgst: { type: Number, required: true },
    sgst: { type: Number, required: true },
    igst: { type: Number, required: true }
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
    enum: ["generated", "sent", "paid"],
    default: "generated"
  },
  pdfUrl: { 
    type: String 
  },
  emailSent: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

export default mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);
