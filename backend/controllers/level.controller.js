import prisma from "../lib/prisma.js";

export const getExperienceLevels = async (req, res) => {
    try {
        const { page = 1, name, all } = req.query;
        const pageNumber = parseInt(page, 10);
        const pageSize = 8;
        
        if (isNaN(pageNumber) || isNaN(pageSize) || pageNumber < 1 || pageSize < 1) {
            return res.status(400).json({ message: "Invalid pagination parameters!" });
        }

        const whereCondition = name ? { name: { contains: name } } : {};

        if (all === "true") {
            const levels = await prisma.experienceLevel.findMany({
                where: whereCondition,
            });
            return res.status(200).json({
                levels,
                totalLevels: levels.length,
            });
        }

        const levels = await prisma.experienceLevel.findMany({
            where: whereCondition,
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
        });
        const totalLevels = await prisma.experienceLevel.count({ where: whereCondition });
        const totalPages = Math.ceil(totalLevels / pageSize);

        res.status(200).json({
            levels,
            totalPages,
            currentPage: pageNumber,
            totalLevels,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get levels!" });
    }
};

export const getExperienceLevel = async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
        const level = await prisma.experienceLevel.findUnique({
            where: { id },
        });
        if (!level) {
            return res.status(404).json({ message: "Level not found" });
        }
        res.status(200).json(level);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get level!" });
    }
};


export const creatExperienceLevel = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: "Level name is required!" });
    }
    try {
        const existingLevel = await prisma.experienceLevel.findFirst({
            where: {
                name: {
                    equals: name.toLowerCase(),
                },
            },
        });

        if (existingLevel) {
            return res.status(400).json({ message: "Level name already exists!" });
        }
        const newLevel = await prisma.experienceLevel.create({
            data: {
                name
            },
        });

        res.status(201).json(newLevel);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create level!" });
    }
};

export const updateExperienceLevel = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Level name is required!" });
    }

    try {
        const existingLevel = await prisma.experienceLevel.findUnique({
            where: { id },
        });

        if (!existingLevel) {
            return res.status(404).json({ message: "Level not found" });
        }
        const duplicateLevel = await prisma.experienceLevel.findFirst({
            where: {
                name: { equals: name.toLowerCase() },
            },
        });

        if (duplicateLevel) {
            return res.status(400).json({ message: "Level name already exists!" });
        }

        const updatedLevel = await prisma.experienceLevel.update({
            where: { id },
            data: {
                name
            },
        });

        res.status(200).json(updatedLevel);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update level!" });
    }
};


export const deleteExperienceLevel = async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
        const existingLevel = await prisma.experienceLevel.findUnique({
            where: { id },
        });

        if (!existingLevel) {
            return res.status(404).json({ message: "Level not found" });
        }

        await prisma.experienceLevel.delete({
            where: { id },
        });

        res.status(200).json({ message: "Level deleted successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete level!" });
    }
};
