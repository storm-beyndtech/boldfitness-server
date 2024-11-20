import express from "express";
import {
  updateUtils,
  getAllUtils,
  sendContactMessage
} from "../controllers/utilController.js";

const router = express.Router();

router.put("/", updateUtils);
router.post("/contact", sendContactMessage);
router.get("/", getAllUtils);

export default router;
