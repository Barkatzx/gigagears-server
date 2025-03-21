import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db";
import { errorHandler } from "./middleware/errorOrder";
import authRoutes from "./routes/authRoutes";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/v1", authRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Hello, Express with TypeScript!");
});

app.use(errorHandler);

// Start Server
const PORT = 5000;
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
});
