import express from "express";
import { authenticate } from "../middleware/auth.js";
import { validate, rfqValidation } from "../middleware/validate.js";
import {
  createRFQ,
  getRFQs,
  getRFQById,
  updateRFQ,
  deleteRFQ,
  assignVendors,
  publishRFQ,
  closeRFQ
} from "../controllers/rfqController.js";

const router = express.Router();

router.use(authenticate);

router.post("/", rfqValidation, validate, createRFQ);

router.get("/", getRFQs);

router.get("/:id", getRFQById);

router.put("/:id", rfqValidation, validate, updateRFQ);

router.delete("/:id", deleteRFQ);

router.put("/:id/assign-vendors", assignVendors);

router.put("/:id/publish", publishRFQ);

router.put("/:id/close", closeRFQ);

export default router;