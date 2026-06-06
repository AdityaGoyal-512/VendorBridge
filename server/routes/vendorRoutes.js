import express from "express";
import { authenticate } from "../middleware/auth.js";
import { validate, vendorValidation } from "../middleware/validate.js";
import {
  createVendor,
  getVendors,
  updateVendor,
  deleteVendor,
} from "../controllers/vendorController.js";

const router = express.Router();

router.use(authenticate);

router.post("/", vendorValidation, validate, createVendor);
router.get("/", getVendors);
router.put("/:id", vendorValidation, validate, updateVendor);
router.delete("/:id", deleteVendor);

export default router;