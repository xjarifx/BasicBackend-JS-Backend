import express from "express";
import {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/itemController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getAllItems);
router.post("/", authenticate, authorize("admin"), createItem);
router.put("/:id", authenticate, authorize("admin"), updateItem);
router.delete("/:id", authenticate, authorize("admin"), deleteItem);

export default router;
