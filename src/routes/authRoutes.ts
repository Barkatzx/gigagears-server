import express from "express";
import {
  getAllUsers,
  getUserById,
  getUserProfile,
  login,
  signup,
} from "../controllers/authController";
import {
  createProduct,
  getAllProducts,
  getProductById,
} from "../controllers/productController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authMiddleware, getUserProfile);
router.get("/users", authMiddleware, getAllUsers),
  router.get("/users/:id", authMiddleware, getUserById),
  router.post("/products", authMiddleware, createProduct);
router.get("/products", authMiddleware, getAllProducts);
router.get("/products/:id", authMiddleware, getProductById);

export default router;
