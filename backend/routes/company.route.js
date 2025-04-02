import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { createCompany, deleteMember, getCompanies, getCompany, getCompanyMembers, hireUserByEmail, updateCompany, updateCompanyStatus, updateMemberRole } from "../controllers/company.controller.js";
import { upload } from "../middleware/uploadFile.js";

const router = express.Router();

router.get("/", getCompanies)
router.get("/:id", getCompany)
router.post("/create", verifyToken, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'images', maxCount: 10 }]), createCompany)
router.put("/:id", verifyToken, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'images', maxCount: 10 }]), updateCompany)
router.put("/:id/status", verifyToken, updateCompanyStatus);
router.get("/:id/members", verifyToken, getCompanyMembers);
router.post("/:id/hire", verifyToken, hireUserByEmail);
router.put("/:id/members/:memberId/role", verifyToken, updateMemberRole);
router.delete("/:id/members/:memberId", verifyToken, deleteMember); 

export default router