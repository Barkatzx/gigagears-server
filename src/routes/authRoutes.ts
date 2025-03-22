import express from "express";
import multer from "multer";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  getUserProfile,
  login,
  profilePicture,
  roleUpdate,
  signup,
} from "../controllers/authController";
import { createOrder, getAllOrders } from "../controllers/order";
import { createPaymentIntent } from "../controllers/payment";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/productController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();
// Configure Multer for file upload
const upload = multer({ dest: "/public/users-photo" });

// Users All Route
router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authMiddleware, getUserProfile);

//User All Route
router.get("/users", getAllUsers),
  router.get("/users/:id", authMiddleware, getUserById),
  router.post("/userphoto/:userId", upload.single("photo"), profilePicture);
router.put("/users/:userId/role", roleUpdate);
router.delete("/users/:userId", deleteUser);

//Product All Route
router.post("/addproducts", upload.single("photo"), createProduct);
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.put("/products/:id", upload.single("photo"), updateProduct);
router.delete("/products/:id", authMiddleware, deleteProduct);

//Payment Route
router.post("/create-payment-intent", createPaymentIntent);
router.post("/orders", createOrder);
router.get("/orders", getAllOrders);

export default router;
