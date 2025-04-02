import prisma from "../lib/prisma.js";

export const getPositions = async (req, res) => {
    try {
        const { page = 1, name, all } = req.query;
        const pageNumber = parseInt(page, 10);
        const pageSize = 8;

        if (isNaN(pageNumber) || isNaN(pageSize) || pageNumber < 1 || pageSize < 1) {
            return res.status(400).json({ message: "Invalid pagination parameters!" });
        }

        const whereCondition = name ? { name: { contains: name } } : {};
        if (all === "true") {
            const positions = await prisma.position.findMany({
                where: whereCondition,
            });
            return res.status(200).json({
                positions,
                totalPositions: positions.length,
            });
        }
        const positions = await prisma.position.findMany({
            where: whereCondition,
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
        });
        const totalPositions = await prisma.position.count({ where: whereCondition });
        const totalPages = Math.ceil(totalPositions / pageSize);
        res.status(200).json({
            positions,
            totalPages,
            currentPage: pageNumber,
            totalPositions,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get positions!" });
    }
};

export const getPosition = async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
        const position = await prisma.position.findUnique({
            where: { id },
        });
        if (!position) {
            return res.status(404).json({ message: "Position not found" });
        }
        res.status(200).json(position);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get position!" });
    }
};


export const createPosition = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: "Position name is required!" });
    }
    try {
        const existingPosition = await prisma.position.findFirst({
            where: {
                name: {
                    equals: name.toLowerCase(),
                },
            },
        });

        if (existingPosition) {
            return res.status(400).json({ message: "Position name already exists!" });
        }
        const newPosition = await prisma.position.create({
            data: {
                name
            },
        });

        res.status(201).json(newPosition);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create position!" });
    }
};

export const updatePosition = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Position name is required!" });
    }

    try {
        const existingPosition = await prisma.position.findUnique({
            where: { id },
        });

        if (!existingPosition) {
            return res.status(404).json({ message: "Position not found" });
        }

        const duplicatePosition = await prisma.position.findFirst({
            where: {
                name: { equals: name.toLowerCase() },
            },
        });

        if (duplicatePosition) {
            return res.status(400).json({ message: "Position name already exists!" });
        }


        const updatedPosition = await prisma.position.update({
            where: { id },
            data: {
                name
            },
        });

        res.status(200).json(updatedPosition);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update position!" });
    }
};


export const deletePosition = async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
        const existingPosition = await prisma.position.findUnique({
            where: { id },
        });

        if (!existingPosition) {
            return res.status(404).json({ message: "Position not found" });
        }

        await prisma.position.delete({
            where: { id },
        });

        res.status(200).json({ message: "Position deleted successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete position!" });
    }
};
