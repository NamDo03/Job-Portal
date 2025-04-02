import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { createSkill, deleteSkill, getSkill, getSkills, updateSkill } from "../controllers/skill.controller.js";

const router = express.Router();

router.get("/", getSkills)
router.get("/:id", getSkill)
router.post("/create", verifyToken, createSkill)
router.put("/:id", verifyToken, updateSkill)
router.delete("/:id", verifyToken, deleteSkill)

export default router