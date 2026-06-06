import express from 'express';
import { 
  submitQuotation, 
  getQuotationsForRFQ, 
  updateQuotationStatus 
} from '../controllers/quotationController.js';

const router = express.Router();

router.post('/', submitQuotation);
router.get('/rfq/:rfqId', getQuotationsForRFQ);
router.put('/:id/status', updateQuotationStatus);

export default router;
