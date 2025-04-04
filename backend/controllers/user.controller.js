import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const getUsers = async (req, res) => {
    try {
        const { page = 1, name, status = "" } = req.query;
        const pageNumber = parseInt(page, 10);
        const pageSize = 8;

        if (isNaN(pageNumber) || isNaN(pageSize) || pageNumber < 1 || pageSize < 1) {
            return res.status(400).json({ message: "Invalid pagination parameters!" });
        }

        const whereCondition = {
            ...(name && {
                OR: [
                    { fullname: { contains: name } },
                    { email: { contains: name } },
                ],
            }),
            ...(status !== "" && { status })
        };


        const users = await prisma.user.findMany({
            where: whereCondition,
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
        });
        const sanitizedUsers = users.map(({ password, ...user }) => user);
        const totalUsers = await prisma.user.count({ where: whereCondition });
        const totalPages = Math.ceil(totalUsers / pageSize);

        res.status(200).json({
            users: sanitizedUsers,
            totalPages,
            currentPage: pageNumber,
            totalUsers,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get users!" });
    }
};

export const getUser = async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                skills: {
                    include: {
                        skill: true
                    },
                },
                companyMemberships: true
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const skills = user.skills.map(s => ({
            id: s.skill.id,
            name: s.skill.name
        }));
        const { password: _, skills: __, ...rest } = user;

        res.status(200).json({ ...rest, skills });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get user!" });
    }
};

export const createUser = async (req, res) => {
    try {
        const { fullname, email, password, role, skills = [], gender } = req.body;
        if (!fullname || !email || !password || !gender) {
            return res.status(400).json({ message: "Please provide all required fields!" });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use!" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let avatarUrl = null;
        let resumeUrl = null;

        if (req.files?.avatar) {
            const avatarPath = req.files.avatar[0].path;
            const uploadedAvatar = await uploadToCloudinary(avatarPath, "avatars");
            avatarUrl = uploadedAvatar.secure_url;
        }

        if (req.files?.resume) {
            const resumePath = req.files.resume[0].path;
            const uploadedResume = await uploadToCloudinary(resumePath, "resumes");
            resumeUrl = uploadedResume.secure_url;
        }
        const newUser = await prisma.user.create({
            data: {
                fullname,
                email,
                password: hashedPassword,
                role,
                gender,
                avatar: avatarUrl,
                resume: resumeUrl,
            }
        });

        if (skills.length > 0) {
            for (const skill of skills) {
                await prisma.userSkill.create({
                    data: {
                        userId: newUser.id,
                        skillId: Number(skill),
                    }
                });
            }
        }
        const userWithSkills = await prisma.user.findUnique({
            where: { id: newUser.id },
            include: { skills: { include: { skill: true } } }
        });
        const { password: _, ...rest } = userWithSkills;
        console.log(rest)
        res.status(201).json({ message: "User created successfully!", user: rest });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create user!" });
    } 
};

export const updateUser = async (req, res) => {
    const id = parseInt(req.params.id, 10);

    const tokenUserId = req.userId;
    const tokenUserRole = req.role;

    if (Number(id) !== Number(tokenUserId) && tokenUserRole !== "ADMIN") {
        return res.status(403).json({ message: "Not Authorized!" });
    }

    const { skills, ...inputs } = req.body;
    let avatarUrl = null;
    let resumeUrl = null;

    try {
        if (req.files["avatar"]) {
            const avatarPath = req.files["avatar"][0].path;
            const uploadedAvatar = await uploadToCloudinary(avatarPath, 'avatars');
            avatarUrl = uploadedAvatar.secure_url;
        }

        if (req.files["resume"]) {
            const resumePath = req.files["resume"][0].path;
            const uploadedResume = await uploadToCloudinary(resumePath, 'resumes');
            resumeUrl = uploadedResume.secure_url;
        }

        const updateData = {
            ...inputs,
            ...(avatarUrl ? { avatar: avatarUrl } : {}),
            ...(resumeUrl ? { resume: resumeUrl } : {}),
        };

        if (skills && Array.isArray(skills) && skills.length > 0) {
            updateData.skills = {
                deleteMany: {}, // Xóa toàn bộ kỹ năng cũ
                create: skills.map(skillId => ({
                    skillId: parseInt(skillId, 10),
                })),
            };
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            include: {
                skills: {
                    include: { skill: true },
                },
            },
        });

        const formattedSkills = updatedUser.skills.map(s => ({
            id: s.skill.id,
            name: s.skill.name,
        }));

        const { password: _, skills: __, ...rest } = updatedUser;

        res.status(200).json({ ...rest, skills: formattedSkills });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to update users!" });
    }
};

export const deleteUser = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const tokenUserId = req.userId;

    if (id !== tokenUserId) {
        return res.status(403).json({ message: "Not Authorized!" });
    }

    try {
        await prisma.user.delete({
            where: { id },
        });
        res.status(200).json({ message: "User deleted" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to delete users!" });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = parseInt(req.params.id, 10);
        const tokenUserId = req.userId;

        if (Number(userId) !== Number(tokenUserId)) {
            return res.status(403).json({ message: "Not Authorized!" });
        }


        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Please provide all required fields!" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters long!" });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect old password!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        res.status(200).json({ message: "Password changed successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error!" });
    }
};

export const changeUserStatus = async (req, res) => {
    const { id } = req.params;
    const tokenUserRole = req.role;

    if (tokenUserRole !== "ADMIN") {
        return res.status(403).json({ message: "Not Authorized!" });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: Number(id) } });

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        const newStatus = user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";

        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { status: newStatus },
        });

        res.status(200).json({ message: "User status updated successfully!", user: updatedUser });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to update user status!" });
    }
};
