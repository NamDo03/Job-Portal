import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { creatExperienceLevel, deleteExperienceLevel, getExperienceLevel, getExperienceLevels, updateExperienceLevel } from "../controllers/level.controller.js";

const router = express.Router();

router.get("/", getExperienceLevels)
router.get("/:id", getExperienceLevel)
router.post("/create", verifyToken, creatExperienceLevel)
router.put("/:id", verifyToken, updateExperienceLevel)
router.delete("/:id", verifyToken, deleteExperienceLevel)

export default router