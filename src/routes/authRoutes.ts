import express from "express";
import { login, logout, signup } from "../controllers/authController";
import { isAdmin, isCustomer } from "../middleware/adminMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);

//Admin customer dasboard
// Admin-only route
router.get("/admin-dashboard", authMiddleware, isAdmin, (req, res) => {
  res.json({ message: "Welcome to the Admin Dashboard" });
});

// Customer-only route
router.get("/customer-dashboard", authMiddleware, isCustomer, (req, res) => {
  res.json({ message: "Welcome to the Customer Dashboard" });
});

export default router;
