import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken"
import { sendVerificationEmail } from "../lib/mailer.js";
import { deleteVerificationCode, getVerificationCode, saveVerificationCode } from "../lib/verificationStore.js";

export const signup = async (req, res) => {
    const { fullname, email, password, gender, role } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered." });
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        await sendVerificationEmail(email, verificationCode);
        saveVerificationCode(email, verificationCode);

        res.status(200).json({
            message: "Verification code sent to email. Please verify to complete registration.",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred while creating the account. Please try again later." });
    }
}
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // CHECK IF THE USER EXISTS
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                skills: {
                    include: {
                        skill: true,
                    },
                },
                companyMemberships: {
                    include: {
                        company: true
                    }
                },
                applications: {
                    include: {
                        job: true,
                    },
                },
                savedJobs: {
                    include: {
                        job: true,
                    },
                },
            },
        });
        if (!user) return res.status(401).json({ message: "User not found" });

        // CHECK IF THE PASSWORD IS CORRECT
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Incorrect password" });

        const age = 1000 * 60 * 60 * 24 * 7;

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: age })

        const { password: userPassword, ...userInfo } = user;
        const userSkills = user.skills.map(s => ({
            id: s.skill.id,
            name: s.skill.name
        }));


        const userApplications = user.applications.map(a => ({
            id: a.id,
        }));

        const userSavedJobs = user.savedJobs.map(sj => ({
            id: sj.id,
        }));

        res
            .cookie("token", token, {
                // httpOnly: true,
                secure: false,
                maxAge: age,
            })
            .status(200)
            .json({
                ...userInfo,
                skills: userSkills,
                applications: userApplications,
                savedJobs: userSavedJobs
            });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "An error occurred, please try again later" });
    }
}
export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({ message: "Logout Successful" });
}

export const verifyAccount = async (req, res) => {
    const { fullname, email, password, gender, role, code } = req.body;

    const stored = getVerificationCode(email);
    if (!stored || stored.code !== code || stored.expiresAt < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                fullname,
                email,
                password: hashedPassword,
                gender,
                role,
            },
        });

        deleteVerificationCode(email);

        console.log("New user", newUser)
        res.status(201).json({ success: true, message: "Account successfully created!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to create account." });
    }
};
