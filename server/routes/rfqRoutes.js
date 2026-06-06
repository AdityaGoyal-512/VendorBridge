import express from "express";

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

router.post("/", createRFQ);

router.get("/", getRFQs);

router.get("/:id", getRFQById);

router.put("/:id", updateRFQ);

router.delete("/:id", deleteRFQ);

router.put("/:id/assign-vendors", assignVendors);

router.put("/:id/publish", publishRFQ);

router.put("/:id/close", closeRFQ);

export default router;