import express from "express";
import multer from "multer";
import {
  getAllUsers,
  getUserById,
  getUserProfile,
  login,
  profilePicture,
  signup,
} from "../controllers/authController";
import {
  createProduct,
  getAllProducts,
  getProductById,
} from "../controllers/productController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();
// Configure Multer for file upload
const upload = multer({ dest: "/public/users-photo" });

// Users All Route
router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authMiddleware, getUserProfile);
router.get("/users", authMiddleware, getAllUsers),
  router.get("/users/:id", authMiddleware, getUserById),
  router.post("/userphoto/:userId", upload.single("photo"), profilePicture);
//Product All Route
router.post("/products", authMiddleware, createProduct);
router.get("/products", authMiddleware, getAllProducts);
router.get("/products/:id", authMiddleware, getProductById);

export default router;
