import Vendor from "../models/Vendor.js";

// Create Vendor
export const createVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Vendors with search, filter, and pagination
export const getVendors = async (req, res, next) => {
  try {
    const {
      search,
      status,
      category,
      page = 1,
      limit = 10,
    } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          category: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (status) {
      query.status = status;
    }
    
    if (category) {
      query.category = category;
    }

    const vendors = await Vendor.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Vendor.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: vendors,
    });
  } catch (error) {
    next(error);
  }
};

// Update Vendor
export const updateVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Vendor
export const deleteVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.json({
      success: true,
      message: "Vendor deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};