import express from "express";
import {
  signup,
  login,
  getUser,
  getAllMembers,
  deleteUser,
  updateUser,
  validateNewUser
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", getUser);
router.get("/validate/:email", validateNewUser);
router.get("/members", getAllMembers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
