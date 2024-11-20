import express from "express";
import { verifyTransaction, saveUserData } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/verify", verifyTransaction);
router.post("/handle-success", saveUserData);

export default router;
