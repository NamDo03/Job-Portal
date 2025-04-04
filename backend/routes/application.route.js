import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { changeApplicationStatus, createApplication, getApplicationById, getApplicationsByCompanyId, getApplicationsByUserId, hasUserApplied } from "../controllers/application.controller.js";
import { upload } from "../middleware/uploadFile.js";

const router = express.Router();

router.post("/create", verifyToken, upload.fields([{ name: 'resume', maxCount: 1 }]), createApplication)
router.put("/:applicationId/status", verifyToken, changeApplicationStatus)
router.get("/user/:userId", verifyToken, getApplicationsByUserId)
router.get("/company/:companyId", verifyToken, getApplicationsByCompanyId)
router.get("/:applicationId", verifyToken, getApplicationById)
router.get("/has-applied/:jobId", verifyToken, hasUserApplied);

export default router