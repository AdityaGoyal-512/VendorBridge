import Vendor from "../models/Vendor.js";

export const createVendor = async (req, res) => {
  try {
    const vendor = await Vendor.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json(vendor);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(vendors);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(vendor);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteVendor = async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Vendor deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};