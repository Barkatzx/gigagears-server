import express from "express";
import {
  getUserProfile,
  login,
  logout,
  signup,
} from "../controllers/authController";
import { isAdmin, isCustomer } from "../middleware/adminMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);

//Admin customer dasboard
// Admin-only route
router.get("/admin", authMiddleware, isAdmin, (req, res) => {
  res.json({ message: "Welcome to the Admin Dashboard" });
});

// Customer-only route
router.get("/customer", authMiddleware, isCustomer, (req, res) => {
  res.json({ message: "Welcome to the Customer Dashboard" });
});

// Protected route - requires valid JWT
router.get("/me", authMiddleware, getUserProfile);

export default router;
