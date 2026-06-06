import { Quotation, RFQ, Vendor } from '../models/index.js';

// @desc    Submit a new quotation
// @route   POST /api/v1/quotations
// @access  Private (Vendor)
export const submitQuotation = async (req, res) => {
  try {
    const { rfqId, vendorId, unitPrice, quantity, deliveryTime, notes } = req.body;

    // Validation
    if (!rfqId || !vendorId || !unitPrice || !quantity || !deliveryTime) {
      return res.status(400).json({ success: false, message: "Please provide all required fields." });
    }

    // Auto-calculations
    const totalPrice = unitPrice * quantity;

    const quotation = new Quotation({
      rfqId,
      vendorId,
      unitPrice,
      quantity,
      totalPrice,
      deliveryTime,
      notes,
      status: 'submitted'
    });

    await quotation.save();
    
    // Auto-update RFQ status to 'published' or handle assigned logic if needed
    // await RFQ.findByIdAndUpdate(rfqId, { status: 'published' });

    res.status(201).json({ success: true, data: quotation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all quotations for a specific RFQ
// @route   GET /api/v1/quotations/rfq/:rfqId
// @access  Private (Procurement Officer/Manager)
export const getQuotationsForRFQ = async (req, res) => {
  try {
    const { rfqId } = req.params;
    
    const quotations = await Quotation.find({ rfqId })
      .populate('vendorId', 'name rating status')
      .populate('rfqId', 'title deadline')
      .sort({ totalPrice: 1 }); // Sort by price ascending (lowest first)

    res.status(200).json({ success: true, data: quotations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all quotations (for general dashboard)
// @route   GET /api/v1/quotations
// @access  Private
export const getAllQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find()
      .populate('vendorId', 'name')
      .populate('rfqId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: quotations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update quotation status
// @route   PUT /api/v1/quotations/:id/status
// @access  Private (Manager)
export const updateQuotationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['under_review', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status." });
    }

    const quotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!quotation) {
      return res.status(404).json({ success: false, message: "Quotation not found." });
    }

    res.status(200).json({ success: true, data: quotation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
