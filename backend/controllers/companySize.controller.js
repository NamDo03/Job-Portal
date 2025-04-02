import prisma from "../lib/prisma.js";

export const getCompanySizes = async (req, res) => {
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
                    { minEmployees: { lte: parsedKeyword } },
                    { maxEmployees: { gte: parsedKeyword } }
                ],
            }
            : {};

        if (all === "true") {
            const companySize = await prisma.companySize.findMany({
                where: whereCondition,
            });
            return res.status(200).json({
                companySize,
                totalcompanySizes: companySize.length,
            });
        }

        const companySizes = await prisma.companySize.findMany({
            where: whereCondition,
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
        });

        const totalcompanySizes = await prisma.companySize.count({ where: whereCondition });
        const totalPages = Math.ceil(totalcompanySizes / pageSize);

        res.status(200).json({
            companySizes,
            totalPages,
            currentPage: pageNumber,
            totalcompanySizes,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get companySizes!" });
    }
};

export const getCompanySize = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format!" });
    }
    try {
        const companySize = await prisma.companySize.findUnique({
            where: { id },
        });
        if (!companySize) {
            return res.status(404).json({ message: "Company Size not found" });
        }
        res.status(200).json(companySize);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get company size!" });
    }
};


export const createCompanySize = async (req, res) => {
    const { minEmployees, maxEmployees } = req.body;
    if (!minEmployees || !maxEmployees) {
        return res.status(400).json({ message: "Min and max are required!" });
    }
    if (minEmployees <= 0 || maxEmployees <= 0) {
        return res.status(400).json({ message: "Min and max must be positive numbers!" });
    }

    if (minEmployees >= maxEmployees) {
        return res.status(400).json({ message: "Min must be less than max!" });
    }
    try {
        const newCompanySize = await prisma.companySize.create({
            data: { minEmployees, maxEmployees },
        });

        res.status(201).json(newCompanySize);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create company size!" });
    }
};

export const updateCompanySize = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { minEmployees, maxEmployees } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format!" });
    }

    if (!minEmployees || !maxEmployees) {
        return res.status(400).json({ message: "Min and max are required!" });
    }

    if (minEmployees <= 0 || maxEmployees <= 0) {
        return res.status(400).json({ message: "Min and max must be positive numbers!" });
    }

    if (minEmployees >= maxEmployees) {
        return res.status(400).json({ message: "Min must be less than max!" });
    }

    try {
        const existingCompanySize = await prisma.companySize.findUnique({
            where: { id },
        });

        if (!existingCompanySize) {
            return res.status(404).json({ message: "Company size not found" });
        }


        const updatedCompanySize = await prisma.companySize.update({
            where: { id },
            data: { minEmployees, maxEmployees },
        });

        res.status(200).json(updatedCompanySize);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update updated company size!" });
    }
};


export const deleteCompanySize = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format!" });
    }

    try {
        const existingCompanySize = await prisma.companySize.findUnique({
            where: { id },
        });

        if (!existingCompanySize) {
            return res.status(404).json({ message: "Company size not found" });
        }

        await prisma.companySize.delete({
            where: { id },
        });

        res.status(200).json({ message: "Company size deleted successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete company size!" });
    }
};
