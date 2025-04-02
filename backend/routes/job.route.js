import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { changeStatusJob, createJob, deleteJob, getAllJobs, getFeaturedJobs, getJobById, getJobsByCompany, getLatestJobs } from "../controllers/job.controller.js";

const router = express.Router();

router.get("/latest", getLatestJobs);
router.get("/featured", getFeaturedJobs);

router.get("/", verifyToken, getAllJobs)
router.get("/:id", verifyToken, getJobById)
router.post("/create", verifyToken, createJob);
router.delete("/:id", verifyToken, deleteJob);
router.put("/:id/status", verifyToken, changeStatusJob);
router.get("/company/:companyId", verifyToken, getJobsByCompany);

export default router