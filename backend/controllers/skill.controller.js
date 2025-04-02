import prisma from "../lib/prisma.js";

export const getSkills = async (req, res) => {
    try {
        const { page, limit, name } = req.query;

        const whereCondition = name ? { name: { contains: name } } : {};

        let skills, totalSkills, totalPages = 1, pageNumber = 1;

        if (!limit || limit === "all" || parseInt(limit, 10) === 0) {
            skills = await prisma.skill.findMany({ where: whereCondition });
            totalSkills = skills.length;
        } else {
            pageNumber = parseInt(page, 10) || 1;
            const pageSize = parseInt(limit, 10) || 8;

            if (pageNumber < 1 || pageSize < 1) {
                return res.status(400).json({ message: "Invalid pagination parameters!" });
            }

            skills = await prisma.skill.findMany({
                where: whereCondition,
                skip: (pageNumber - 1) * pageSize,
                take: pageSize,
            });

            totalSkills = await prisma.skill.count({ where: whereCondition });
            totalPages = Math.ceil(totalSkills / pageSize);
        }

        res.status(200).json({
            skills,
            totalPages,
            currentPage: pageNumber,
            totalSkills,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get skills!" });
    }
};


export const getSkill = async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
        const skill = await prisma.skill.findUnique({
            where: { id },
        });
        if (!skill) {
            return res.status(404).json({ message: "Skill not found" });
        }
        res.status(200).json(skill);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get skill!" });
    }
};


export const createSkill = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: "Skill name is required!" });
    }
    try {
        const existingSkill = await prisma.skill.findFirst({
            where: {
                name: {
                    equals: name.toLowerCase(),
                },
            },
        });

        if (existingSkill) {
            return res.status(400).json({ message: "Skill name already exists!" });
        }
        const newSkill = await prisma.skill.create({
            data: {
                name
            },
        });

        res.status(201).json(newSkill);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create skill!" });
    }
};

export const updateSkill = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Skill name is required!" });
    }

    try {
        const existingSkill = await prisma.skill.findUnique({
            where: { id },
        });

        if (!existingSkill) {
            return res.status(404).json({ message: "Skill not found" });
        }

        const duplicateSkill = await prisma.skill.findFirst({
            where: {
                name: { equals: name.toLowerCase() },
            },
        });

        if (duplicateSkill) {
            return res.status(400).json({ message: "Skill name already exists!" });
        }


        const updatedSkill = await prisma.skill.update({
            where: { id },
            data: {
                name
            },
        });

        res.status(200).json(updatedSkill);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update skill!" });
    }
};


export const deleteSkill = async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
        const existingSkill = await prisma.skill.findUnique({
            where: { id },
        });

        if (!existingSkill) {
            return res.status(404).json({ message: "Skill not found" });
        }

        await prisma.skill.delete({
            where: { id },
        });

        res.status(200).json({ message: "Skill deleted successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete skill!" });
    }
};
