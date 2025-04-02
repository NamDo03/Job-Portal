import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { createPosition, deletePosition, getPosition, getPositions, updatePosition } from "../controllers/position.controller.js";

const router = express.Router();

router.get("/", getPositions)
router.get("/:id", getPosition)
router.post("/create", verifyToken, createPosition)
router.put("/:id", verifyToken, updatePosition)
router.delete("/:id", verifyToken, deletePosition)

export default router