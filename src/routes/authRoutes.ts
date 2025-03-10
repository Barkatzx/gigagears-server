import express from "express";
import { login, logout, signup } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);

export default router;
