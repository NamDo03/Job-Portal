import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { upload } from "../middleware/uploadFile.js";
import { createCategory, deleteCategory, getCategories, getCategory, getTopCategories, updateCategory } from "../controllers/category.controller.js";

const router = express.Router();

router.get('/top', getTopCategories);

router.get("/", getCategories)
router.get("/:id", getCategory)
router.post("/create", verifyToken, upload.fields([{ name: 'image', maxCount: 1 }]), createCategory)
router.put("/:id", verifyToken, upload.fields([{ name: 'image', maxCount: 1 }]), updateCategory)
router.delete("/:id", verifyToken, deleteCategory)
export default router