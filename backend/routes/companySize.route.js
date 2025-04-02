import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { createCompanySize, deleteCompanySize, getCompanySize, getCompanySizes, updateCompanySize } from "../controllers/companySize.controller.js";

const router = express.Router();

router.get("/", getCompanySizes)
router.get("/:id", getCompanySize)
router.post("/create", verifyToken, createCompanySize)
router.put("/:id", verifyToken, updateCompanySize)
router.delete("/:id", verifyToken, deleteCompanySize)

export default router