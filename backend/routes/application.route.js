import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { changeApplicationStatus, createApplication, getApplicationsByCompanyId, getApplicationsByUserId } from "../controllers/application.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createApplication)
router.put("/:applicationId/status", verifyToken, changeApplicationStatus)
router.get("/user/:userId", verifyToken, getApplicationsByUserId)
router.get("/company/:companyId", verifyToken, getApplicationsByCompanyId)

export default router