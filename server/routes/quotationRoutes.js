import express from 'express';
import { 
  submitQuotation, 
  getQuotationsForRFQ, 
  getAllQuotations,
  updateQuotationStatus 
} from '../controllers/quotationController.js';

import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Vendors submit quotations
router.post('/', authorize('vendor'), submitQuotation);

// General route for dashboards (all authenticated)
router.get('/', getAllQuotations);

// Managers compare quotations and update status
router.get('/rfq/:rfqId', authorize('admin', 'manager', 'procurement_officer'), getQuotationsForRFQ);
router.put('/:id/status', authorize('admin', 'manager', 'procurement_officer'), updateQuotationStatus);

export default router;
