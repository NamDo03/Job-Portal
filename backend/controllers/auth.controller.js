import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken"

export const signup = async (req, res) => {
    const { fullname, email, password, gender, role } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                fullname, email, password: hashedPassword, gender, role,
            }
        })
        console.log("New User Created:", newUser);
        res.status(201).json({ message: "Account successfully created!" });
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