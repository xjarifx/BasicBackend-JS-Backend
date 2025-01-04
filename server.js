import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// ==================== Database Connection ====================
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  });

// ==================== Routes ====================
app.use("/auth", authRoutes);
app.use("/items", itemRoutes);

// ==================== Start Server ====================
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
