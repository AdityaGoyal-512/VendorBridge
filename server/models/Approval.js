import mongoose from 'mongoose';

const approvalSchema = new mongoose.Schema({
  quotationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Quotation',
    required: true,
    index: true
  },
  rfqId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'RFQ',
    required: true
  },
  managerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
    index: true
  },
  remarks: { 
    type: String 
  },
  timeline: [{
    action: String,
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.models.Approval || mongoose.model('Approval', approvalSchema);
