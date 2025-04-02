import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { changePassword, changeUserStatus, createUser, deleteUser, getUser, getUsers, updateUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/uploadFile.js";

const router = express.Router();

router.get("/", getUsers)
router.get("/:id", verifyToken, getUser)
router.post("/create", verifyToken, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), createUser)
router.put("/:id", verifyToken, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), updateUser)
router.delete("/:id", verifyToken, deleteUser)
router.put("/change-password/:id", verifyToken, changePassword);
router.put("/status/:id", verifyToken, changeUserStatus);

export default router