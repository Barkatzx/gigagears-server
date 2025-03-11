import express from "express";
import { getUserProfile, login, signup } from "../controllers/authController";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/users", getUserProfile);

export default router;
