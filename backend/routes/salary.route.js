import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { createSalary, deleteSalary, getSalaries, getSalary, updateSalary } from "../controllers/salary.controller.js";

const router = express.Router();

router.get("/", getSalaries)
router.get("/:id", getSalary)
router.post("/create", verifyToken, createSalary)
router.put("/:id", verifyToken, updateSalary)
router.delete("/:id", verifyToken, deleteSalary)

export default router