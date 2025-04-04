import prisma from "../lib/prisma.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

export const getCompanies = async (req, res) => {
    try {
        const { page = 1, search, all, status = "", location, companySize } = req.query;
        const pageNumber = parseInt(page, 10);
        const pageSize = 8;

        if (isNaN(pageNumber)) {
            return res.status(400).json({ message: "Invalid page parameter!" });
        }
        if (isNaN(pageSize)) {
            return res.status(400).json({ message: "Invalid limit parameter!" });
        }
        if (pageNumber < 1 || pageSize < 1) {
            return res.status(400).json({ message: "Page and limit must be greater than 0!" });
        }

        const skip = (pageNumber - 1) * pageSize;

        const filter = {
            ...(status !== "" && { status }),
            ...(search && { name: { contains: search } }),
            ...(location && { location: { contains: location } }),
            ...(companySize && { sizeId: parseInt(companySize) }),
        };

        const totalCompanies = await prisma.company.count({ where: filter });

        const companies = await prisma.company.findMany({
            where: filter,
            skip: all ? undefined : skip,
            take: all ? undefined : pageSize,
            include: {
                owner: { select: { id: true, fullname: true, email: true } },
                members: { include: { user: true } },
                jobs: true,
                images: true,
                size: true,
            },
        });

        res.status(200).json({
            data: companies,
            pagination: all
                ? undefined
                : {
                    total: totalCompanies,
                    page: parseInt(page),
                    limit: parseInt(pageSize),
                    totalPages: Math.ceil(totalCompanies / pageSize),
                },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch companies" });
    }
};

export const getCompany = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Invalid company ID!" });
        }

        const company = await prisma.company.findUnique({
            where: { id: parseInt(id) },
            include: {
                owner: { select: { id: true, fullname: true, email: true } },
                members: { include: { user: true } },
                jobs: true,
                images: true,
                size: true,
            },
        });

        if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }

        res.status(200).json(company);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch company" });
    }
};

export const createCompany = async (req, res) => {
    const { name, location, description, website, ownerId, sizeId } = req.body;
    const logoFile = req.files?.logo ? req.files.logo[0].path : null;
    const imageFiles = req.files?.images ? req.files.images.map(file => file.path) : [];

    if (!name || !location || !ownerId) {
        return res.status(400).json({ message: "Name, location, and ownerId are required fields!" });
    }

    try {
        const existingCompany = await prisma.company.findFirst({
            where: {
                name: {
                    equals: name.toLowerCase(),
                },
            },
        });

        if (existingCompany) {
            return res.status(400).json({ message: "Company with this name already exists!" });
        }

        let logoUrl = null;
        if (logoFile) {
            const uploadLogo = await uploadToCloudinary(logoFile, "company_logos");
            if (!uploadLogo || !uploadLogo.secure_url) {
                throw new Error("Failed to upload logo to Cloudinary");
            }
            logoUrl = uploadLogo.secure_url;
        }

        const newCompany = await prisma.company.create({
            data: {
                name: name.toLowerCase(),
                location,
                description,
                website,
                logo: logoUrl,
                status: 'PENDING',
                ownerId: parseInt(ownerId),
                sizeId: sizeId ? parseInt(sizeId) : null,
            },
        });

        const companyMember = await prisma.companyMember.create({
            data: {
                userId: parseInt(ownerId),
                companyId: newCompany.id,
                role: "OWNER",
            },
        });

        if (imageFiles.length > 0) {
            const uploadedImages = await Promise.all(
                imageFiles.map(async (file) => {
                    try {
                        const uploadImage = await uploadToCloudinary(file, "company_images");
                        return uploadImage?.secure_url ? { companyId: newCompany.id, imageUrl: uploadImage.secure_url } : null;
                    } catch (error) {
                        console.error("Image upload failed:", error);
                        return null;
                    }
                })
            );

            const validImages = uploadedImages.filter(img => img !== null);
            if (validImages.length > 0) {
                await prisma.companyImage.createMany({ data: validImages });
            }
        }
        res.status(201).json({
            id: companyMember.id,
            userId: companyMember.userId,
            companyId: companyMember.companyId,
            role: companyMember.role,
            company: newCompany
        });
    } catch (err) {
        console.error("Error creating company:", err);
        res.status(500).json({ message: "Failed to create company!" });
    } finally {
        fs.unlinkSync(logoFile);
        fs.unlinkSync(imageFiles);
    }
};

export const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location, description, website, sizeId } = req.body;
        const logoFile = req.files?.logo ? req.files.logo[0].path : null;
        const imageFiles = req.files?.images ? req.files.images.map(file => file.path) : [];

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Invalid company ID!" });
        }

        const existingCompany = await prisma.company.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingCompany) {
            return res.status(404).json({ message: "Company not found!" });
        }

        let logoUrl = existingCompany.logo;
        if (logoFile) {
            const uploadLogo = await uploadToCloudinary(logoFile, "company_logos");
            if (!uploadLogo || !uploadLogo.secure_url) {
                throw new Error("Failed to upload logo to Cloudinary");
            }
            logoUrl = uploadLogo.secure_url;
        }

        let uploadedImages = [];
        if (imageFiles.length > 0) {
            uploadedImages = await Promise.all(
                imageFiles.map(async (file) => {
                    try {
                        const uploadImage = await uploadToCloudinary(file, "company_images");
                        return uploadImage?.secure_url ? { companyId: parseInt(id), imageUrl: uploadImage.secure_url } : null;
                    } catch (error) {
                        console.error("Image upload failed:", error);
                        return null;
                    }
                })
            );
        }

        const updatedCompany = await prisma.company.update({
            where: { id: parseInt(id) },
            data: {
                name: name ? name : existingCompany.name,
                location: location || existingCompany.location,
                description: description || existingCompany.description,
                website: website || existingCompany.website,
                logo: logoUrl,
                sizeId: sizeId ? parseInt(sizeId) : existingCompany.sizeId,
            },
        });

        if (uploadedImages.length > 0) {
            await prisma.companyImage.deleteMany({ where: { companyId: parseInt(id) } });
            const validImages = uploadedImages.filter(img => img !== null);
            if (validImages.length > 0) {
                await prisma.companyImage.createMany({ data: validImages });
            }
        }

        console.log(updatedCompany)
        res.status(200).json(updatedCompany);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update company" });
    }
};

export const updateCompanyStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Invalid company ID!" });
        }

        const existingCompany = await prisma.company.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingCompany) {
            return res.status(404).json({ message: "Company not found!" });
        }

        const updatedCompany = await prisma.company.update({
            where: { id: parseInt(id) },
            data: { status },
        });

        res.status(200).json(updatedCompany);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update company status" });
    }
};

export const getCompanyMembers = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, search } = req.query;
        const pageNumber = parseInt(page, 10);
        const pageSize = 8;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Invalid company ID!" });
        }


        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Invalid company ID!" });
        }

        if (isNaN(pageNumber) || isNaN(pageSize)) {
            return res.status(400).json({ message: "Invalid page or limit parameter!" });
        }

        if (pageNumber < 1 || pageSize < 1) {
            return res.status(400).json({ message: "Page and limit must be greater than 0!" });
        }

        const skip = (pageNumber - 1) * pageSize;

        const filter = {
            companyId: parseInt(id),
            ...(search && {
                OR: [
                    {
                        user: {
                            fullname: {
                                contains: search
                            },
                        },
                    },
                    {
                        user: {
                            email: {
                                contains: search
                            },
                        },
                    },
                ],
            }),
        };

        const company = await prisma.company.findUnique({
            where: { id: parseInt(id) },
            include: {
                members: {
                    include: {
                        user: true,
                    },
                    skip: skip,
                    take: pageSize,
                },
            },
        });

        const members = await prisma.companyMember.findMany({
            where: filter,
            include: {
                user: true,
            },
            skip: skip,
            take: pageSize,
        });

        const totalMembers = await prisma.companyMember.count({
            where: filter,
        });

        res.status(200).json({
            data: members,
            pagination: {
                total: totalMembers,
                page: pageNumber,
                limit: pageSize,
                totalPages: Math.ceil(totalMembers / pageSize),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch company members" });
    }
};

export const hireUserByEmail = async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Invalid company ID!" });
        }

        const company = await prisma.company.findUnique({
            where: { id: parseInt(id) },
        });

        if (!company) {
            return res.status(404).json({ message: "Company not found!" });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        if (user.role === "ADMIN") {
            return res.status(403).json({ message: "Cannot add user with ADMIN role!" });
        }


        const existingMember = await prisma.companyMember.findFirst({
            where: {
                companyId: parseInt(id),
                userId: user.id,
            },
        });

        if (existingMember) {
            return res.status(400).json({ message: "User is already a member of this company!" });
        }

        const newMember = await prisma.companyMember.create({
            data: {
                companyId: parseInt(id),
                userId: user.id,
                role: "REVIEWER",
            },
        });
        await prisma.user.update({
            where: { id: user.id },
            data: { role: "RECRUITER" },
        });

        res.status(201).json(newMember);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to hire user" });
    }
};

export const updateMemberRole = async (req, res) => {
    try {
        const { id, memberId } = req.params;
        const { role } = req.body;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Invalid company ID!" });
        }
        if (isNaN(parseInt(memberId))) {
            return res.status(400).json({ message: "Invalid member ID!" });
        }

        const company = await prisma.company.findUnique({
            where: { id: parseInt(id) },
        });
        if (!company) {
            return res.status(404).json({ message: "Company not found!" });
        }

        const existingMember = await prisma.companyMember.findFirst({
            where: {
                companyId: parseInt(id),
                userId: parseInt(memberId),
            },
        });
        if (!existingMember) {
            return res.status(404).json({ message: "Member not found in this company!" });
        }

        const updatedMember = await prisma.companyMember.update({
            where: {
                id: existingMember.id,
            },
            data: {
                role: role,
            },
            include: {
                user: true,
            },
        });

        res.status(200).json(updatedMember);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update member role" });
    }
};

export const deleteMember = async (req, res) => {
    try {
        const { id, memberId } = req.params;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Invalid company ID!" });
        }
        if (isNaN(parseInt(memberId))) {
            return res.status(400).json({ message: "Invalid member ID!" });
        }

        const company = await prisma.company.findUnique({
            where: { id: parseInt(id) },
        });
        if (!company) {
            return res.status(404).json({ message: "Company not found!" });
        }

        const existingMember = await prisma.companyMember.findFirst({
            where: {
                companyId: parseInt(id),
                userId: parseInt(memberId),
            },
        });
        if (!existingMember) {
            return res.status(404).json({ message: "Member not found in this company!" });
        }

        await prisma.companyMember.delete({
            where: {
                id: existingMember.id,
            },
        });

        res.status(200).json({ message: "Member deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete member" });
    }
};