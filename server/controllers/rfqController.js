import RFQ from "../models/RFQ.js";

// Create RFQ
export const createRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "RFQ created successfully",
      data: rfq,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All RFQs
export const getRFQs = async (req, res) => {
  try {
    const {
      search,
      status,
      priority,
      category,
      page = 1,
      limit = 10,
    } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          productName: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    const rfqs = await RFQ.find(query)
      .populate(
        "assignedVendors",
        "name email category rating status"
      )
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await RFQ.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: rfqs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single RFQ
export const getRFQById = async (req, res) => {
  try {
    const rfq = await RFQ.findById(req.params.id)
      .populate("assignedVendors")
      .populate("createdBy", "name email");

    if (!rfq) {
      return res.status(404).json({
        success: false,
        message: "RFQ not found",
      });
    }

    res.status(200).json({
      success: true,
      data: rfq,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update RFQ
export const updateRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!rfq) {
      return res.status(404).json({
        success: false,
        message: "RFQ not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "RFQ updated successfully",
      data: rfq,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete RFQ
export const deleteRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.findByIdAndDelete(req.params.id);

    if (!rfq) {
      return res.status(404).json({
        success: false,
        message: "RFQ not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "RFQ deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Assign Vendors
export const assignVendors = async (req, res) => {
  try {
    const { vendorIds } = req.body;

    const rfq = await RFQ.findByIdAndUpdate(
      req.params.id,
      {
        assignedVendors: vendorIds,
      },
      {
        new: true,
      }
    ).populate("assignedVendors");

    if (!rfq) {
      return res.status(404).json({
        success: false,
        message: "RFQ not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendors assigned successfully",
      data: rfq,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Publish RFQ
export const publishRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.findByIdAndUpdate(
      req.params.id,
      {
        status: "published",
      },
      {
        new: true,
      }
    );

    if (!rfq) {
      return res.status(404).json({
        success: false,
        message: "RFQ not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "RFQ published successfully",
      data: rfq,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Close RFQ
export const closeRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.findByIdAndUpdate(
      req.params.id,
      {
        status: "closed",
      },
      {
        new: true,
      }
    );

    if (!rfq) {
      return res.status(404).json({
        success: false,
        message: "RFQ not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "RFQ closed successfully",
      data: rfq,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};