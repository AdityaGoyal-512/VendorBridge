import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true
  },
  action: { 
    type: String, 
    required: true 
  },
  module: {
    type: String,
    enum: ["auth", "vendor", "rfq", "quotation", "approval", "po", "invoice"],
    required: true
  },
  targetId: { 
    type: mongoose.Schema.Types.ObjectId 
  },
  targetModel: { 
    type: String 
  },
  metadata: { 
    type: mongoose.Schema.Types.Mixed 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true
  }
});

// Avoid compiling model again if already compiled
export default mongoose.models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema);
