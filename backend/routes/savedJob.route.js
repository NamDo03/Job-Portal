import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getSavedJobsByUser, isJobSavedByUser, saveJob, unsaveJob } from "../controllers/savedJob.controller.js";

const router = express.Router();

router.post('/', verifyToken, saveJob);
router.delete('/:userId/:jobId', verifyToken, unsaveJob);
router.get('/user/:userId', verifyToken, getSavedJobsByUser);
router.get('/check/:userId/:jobId', verifyToken, isJobSavedByUser);

export default router