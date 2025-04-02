import prisma from "../lib/prisma.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const getCategories = async (req, res) => {
    try {
        const { page = 1, name, all } = req.query;
        const pageNumber = parseInt(page, 10);
        const pageSize = 8;

        if (isNaN(pageNumber) || isNaN(pageSize) || pageNumber < 1 || pageSize < 1) {
            return res.status(400).json({ message: "Invalid pagination parameters!" });
        }

        const whereCondition = name ? { name: { contains: name } } : {};

        if (all === "true") {
            const categories = await prisma.category.findMany({
                where: whereCondition,
            });
            return res.status(200).json({
                categories,
                totalCategories: categories.length,
            });
        }

        const categories = await prisma.category.findMany({
            where: whereCondition,
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
        });

        const totalCategories = await prisma.category.count({ where: whereCondition });
        const totalPages = Math.ceil(totalCategories / pageSize);

        res.status(200).json({
            categories,
            totalPages,
            currentPage: pageNumber,
            totalCategories,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get categories!" });
    }
};

export const getCategory = async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
        const category = await prisma.category.findUnique({
            where: { id },
        });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(category);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get category!" });
    }
};


export const createCategory = async (req, res) => {
    const { name } = req.body;
    const image = req.files?.image ? req.files.image[0].path : null;

    if (!name) return res.status(400).json({ message: "Category name is required!" });
    if (!image) return res.status(400).json({ message: "Category image is required!" });

    try {
        const existingCategory = await prisma.category.findFirst({
            where: {
                name: {
                    equals: name.toLowerCase(),
                },
            },
        });

        if (existingCategory) {
            return res.status(400).json({ message: "Category name already exists!" });
        }
        const uploadImage = await uploadToCloudinary(image, "imgCategory");
        const imageUrl = uploadImage.secure_url;

        const newCategory = await prisma.category.create({
            data: { name, image: imageUrl },
        });

        res.status(201).json(newCategory);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create category!" });
    }
};

export const updateCategory = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { name } = req.body;
    const image = req.files?.image ? req.files.image[0].path : null;

    if (!name) return res.status(400).json({ message: "Category name is required!" });

    try {
        const existingCategory = await prisma.category.findUnique({ where: { id } });
        if (!existingCategory) return res.status(404).json({ message: "Category not found" });

        let imageUrl = existingCategory.image;

        if (image) {
            const uploadImage = await uploadToCloudinary(image, "imgCategory");
            imageUrl = uploadImage.secure_url;
        }
        const duplicateCategory = await prisma.category.findFirst({
            where: {
                name: { equals: name.toLowerCase() },
            },
        });

        if (duplicateCategory) {
            return res.status(400).json({ message: "Category name already exists!" });
        }

        const updatedCategory = await prisma.category.update({
            where: { id },
            data: { name, image: imageUrl },
        });

        res.status(200).json(updatedCategory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update category!" });
    }
};


export const deleteCategory = async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
        const existingCategory = await prisma.category.findUnique({
            where: { id },
        });

        if (!existingCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        await prisma.category.delete({
            where: { id },
        });

        res.status(200).json({ message: "Category deleted successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete category!" });
    }
};

export const getTopCategories = async (req, res) => {
    try {
        const topCategories = await prisma.category.findMany({
            take: 8,
            orderBy: {
                jobs: {
                    _count: 'desc'
                }
            },
            include: {
                _count: {
                    select: {
                        jobs: {
                            where: {
                                status: 'APPROVED'
                            }
                        }
                    }
                }
            }
        });

        const formattedCategories = topCategories.map(category => ({
            id: category.id,
            name: category.name,
            image: category.image,
            jobCount: category._count.jobs
        }));

        res.status(200).json(formattedCategories);
    } catch (error) {
        console.error("Error fetching top categories:", error);
        res.status(500).json({ error: "Failed to fetch top categories" });
    }
};