import express from "express";
import { loginUser } from "../controllers/authController"; // ✅ Ensure correct import

const router = express.Router();

router.post("/login", loginUser); // ✅ Now TypeScript will recognize it properly

export default router;
