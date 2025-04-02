import prisma from "../lib/prisma.js";

export const getSalaries = async (req, res) => {
    try {
        const { page = 1, keyword, all } = req.query;
        const pageNumber = parseInt(page, 10);
        const pageSize = 8;
        const parsedKeyword = keyword ? parseInt(keyword, 10) : null;

        if (isNaN(pageNumber) || isNaN(pageSize) || pageNumber < 1 || pageSize < 1) {
            return res.status(400).json({ message: "Invalid pagination parameters!" });
        }

        const whereCondition = parsedKeyword
            ? {
                AND: [
                    { min: { lte: parsedKeyword } },
                    { max: { gte: parsedKeyword } }
                ],
            }
            : {};


        if (all === "true") {
            const salaries = await prisma.salary.findMany({
                where: whereCondition,
            });
            return res.status(200).json({
                salaries,
                totalSalaries: salaries.length,
            });
        }

        const salaries = await prisma.salary.findMany({
            where: whereCondition,
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
        });

        const totalSalaries = await prisma.salary.count({ where: whereCondition });
        const totalPages = Math.ceil(totalSalaries / pageSize);

        res.status(200).json({
            salaries,
            totalPages,
            currentPage: pageNumber,
            totalSalaries,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get salaries!" });
    }
};

export const getSalary = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format!" });
    }
    try {
        const salary = await prisma.salary.findUnique({
            where: { id },
        });
        if (!salary) {
            return res.status(404).json({ message: "Salary not found" });
        }
        res.status(200).json(salary);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get salary!" });
    }
};


export const createSalary = async (req, res) => {
    const { min, max } = req.body;
    if (!min || !max) {
        return res.status(400).json({ message: "Min and max are required!" });
    }
    if (min <= 0 || max <= 0) {
        return res.status(400).json({ message: "Min and max must be positive numbers!" });
    }

    if (min >= max) {
        return res.status(400).json({ message: "Min must be less than max!" });
    }
    try {
        const newSalary = await prisma.salary.create({
            data: { min, max },
        });

        res.status(201).json(newSalary);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create salary!" });
    }
};

export const updateSalary = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { min, max } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format!" });
    }

    if (!min || !max) {
        return res.status(400).json({ message: "Min and max are required!" });
    }

    if (min <= 0 || max <= 0) {
        return res.status(400).json({ message: "Min and max must be positive numbers!" });
    }

    if (min >= max) {
        return res.status(400).json({ message: "Min must be less than max!" });
    }

    try {
        const existingSalary = await prisma.salary.findUnique({
            where: { id },
        });

        if (!existingSalary) {
            return res.status(404).json({ message: "Salary not found" });
        }


        const updatedSalary = await prisma.salary.update({
            where: { id },
            data: { min, max },
        });

        res.status(200).json(updatedSalary);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update salary!" });
    }
};


export const deleteSalary = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format!" });
    }

    try {
        const existingSalary = await prisma.salary.findUnique({
            where: { id },
        });

        if (!existingSalary) {
            return res.status(404).json({ message: "Salary not found" });
        }

        await prisma.salary.delete({
            where: { id },
        });

        res.status(200).json({ message: "Salary deleted successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete salary!" });
    }
};
