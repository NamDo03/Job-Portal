import express from "express";
import { login, logout, signup, verifyAccount } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.post("/verify", verifyAccount)

export default router