import { sendApplicationStatusEmail } from "../lib/mailer.js";
import prisma from "../lib/prisma.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

export const createApplication = async (req, res) => {
    const { jobId, coverLetter, fullname, email, resume } = req.body;
    const userId = req.userId;
    let resumeUrl = resume;
    let resumeFile = req.files?.resume
    try {
        if (!jobId || !fullname || !email) {
            return res.status(400).json({ message: "All fields are required!" });
        }
        if (resumeFile) {
            const uploadedResume = await uploadToCloudinary(resumeFile[0].path, "resume");
            resumeUrl = uploadedResume.secure_url;
        }

        const existingApplication = await prisma.application.findFirst({
            where: {
                jobId: parseInt(jobId),
                userId: userId,
            },
        });

        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied to this job!" });
        }


        const application = await prisma.application.create({
            data: {
                jobId: parseInt(jobId),
                userId: userId,
                coverLetter,
                resume: resumeUrl,
                fullname,
                email,
                status: "PENDING",
            },
            include: {
                job: {
                    include: {
                        company: true,
                    },
                },
            },
        });
        res.status(201).json(application);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create application!" });
    }
};

export const changeApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;
        const userId = req.userId;

        const validStatuses = ["PENDING", "VIEWED", "ACCEPTED", "REJECTED"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status!" });
        }

        const application = await prisma.application.findUnique({
            where: { id: parseInt(applicationId) },
            include: {
                job: {
                    include: {
                        company: {
                            include: {
                                members: true,
                            },
                        },
                    },
                },
                user: true
            },
        });

        if (!application) {
            return res.status(404).json({ message: "Application not found!" });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                companyMemberships: true,
            },
        });

        const isCompanyMember = application.job.company.members.some(
            (member) => member.userId === userId
        );

        if (!isCompanyMember || !user.companyMemberships[0] || (user.companyMemberships[0].role !== "REVIEWER" && user.companyMemberships[0].role !== "OWNER")) {
            return res.status(403).json({ message: "Unauthorized to change status!" });
        }

        const updatedApplication = await prisma.application.update({
            where: { id: parseInt(applicationId) },
            data: { status },
            include: {
                job: true,
            },
        });
        await sendApplicationStatusEmail(application.user.email, application.job.title, status)
        res.status(200).json(updatedApplication);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to update application status!" });
    }
};

export const getApplicationsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1 } = req.query;
        const limit = 8;

        const whereClause = {
            userId: parseInt(userId),
        };

        const [applications, total] = await Promise.all([
            prisma.application.findMany({
                where: whereClause,
                skip: (parseInt(page) - 1) * parseInt(limit),
                take: parseInt(limit),
                include: {
                    job: {
                        include: {
                            company: true,
                            category: true,
                            position: true,
                        },
                    },
                },
                orderBy: {
                    appliedAt: "desc",
                },
            }),
            prisma.application.count({
                where: whereClause,
            }),
        ]);

        res.status(200).json({
            data: applications,
            meta: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get applications!" });
    }
};

export const getApplicationsByCompanyId = async (req, res) => {
    try {
        const { companyId } = req.params;
        const { jobId, status, page = 1, search } = req.query;
        const limit = 8;

        const companyIdNum = parseInt(companyId);
        const jobIdNum = jobId ? parseInt(jobId) : null;
        const pageNum = parseInt(page) || 1;

        if (isNaN(companyIdNum)) {
            return res.status(400).json({ message: "Invalid company ID" });
        }

        const whereClause = {
            job: {
                companyId: companyIdNum,
                ...(jobIdNum ? { id: jobIdNum } : {}),
            },
        };


        if (status) {
            whereClause.status = status;
        }

        if (search) {
            whereClause.user = {
                OR: [
                    { email: { contains: search } },
                    { fullname: { contains: search } },
                ],
            };
        }


        const [applications, total] = await Promise.all([
            prisma.application.findMany({
                where: whereClause,
                skip: (pageNum - 1) * limit,
                take: limit,
                include: {
                    job: {
                        include: {
                            company: true,
                            category: true,
                            position: true,
                        },
                    },
                    user: true,
                },
                orderBy: {
                    appliedAt: "desc",
                },
            }),
            prisma.application.count({
                where: whereClause,
            }),
        ]);

        res.status(200).json({
            data: applications,
            meta: {
                total,
                page: pageNum,
                limit: limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error("Error fetching applications:", err);
        res.status(500).json({ message: "Failed to get company applications!", error: err.message });
    }
};

export const getApplicationById = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const applicationIdNum = parseInt(applicationId);

        if (isNaN(applicationIdNum)) {
            return res.status(400).json({ message: "Invalid application ID!" });
        }

        const application = await prisma.application.findUnique({
            where: { id: applicationIdNum },
            include: {
                job: {
                    include: {
                        company: true,
                        category: true,
                        position: true,
                    },
                },
                user: {
                    select: { id: true, fullname: true, email: true },
                },
            },
        });

        if (!application) {
            return res.status(404).json({ message: "Application not found!" });
        }

        res.status(200).json(application);
    } catch (err) {
        console.error("Error fetching application by ID:", err);
        res.status(500).json({ message: "Failed to get application details!", error: err.message });
    }
};


export const hasUserApplied = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.userId;

        if (!jobId || isNaN(parseInt(jobId))) {
            return res.status(400).json({ message: "Invalid job ID!" });
        }

        const existingApplication = await prisma.application.findFirst({
            where: {
                jobId: parseInt(jobId),
                userId: userId,
            },
        });

        res.status(200).json({ hasApplied: !!existingApplication });
    } catch (err) {
        console.error("Error checking application:", err);
        res.status(500).json({ message: "Failed to check application status!" });
    }
};

export const getApplicationsCountByStatus = async (req, res) => {
    try {
        const { companyId } = req.params;

        if (isNaN(parseInt(companyId))) {
            return res.status(400).json({ message: "Invalid company ID!" });
        }

        const dateSevenDaysAgo = new Date();
        dateSevenDaysAgo.setDate(dateSevenDaysAgo.getDate() - 7);

        const applications = await prisma.application.findMany({
            where: {
                job: {
                    companyId: parseInt(companyId),
                },
                appliedAt: {
                    gte: dateSevenDaysAgo,
                },
            },
        });

        const totalApplications = applications.length;

        const totalPendingApplications = applications.filter(application => application.status === 'PENDING').length;

        const result = applications.reduce((acc, application) => {
            const date = application.appliedAt.toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = { date, pending: 0, approved: 0, rejected: 0 };
            }

            if (application.status === 'PENDING' || application.status === 'VIEWED') {
                acc[date].pending += 1;
            } else if (application.status === 'ACCEPTED') {
                acc[date].approved += 1;
            } else if (application.status === 'REJECTED') {
                acc[date].rejected += 1;
            }

            return acc;
        }, {});

        const formattedData = Object.values(result);

        res.status(200).json({
            data: formattedData,
            totalApplications,
            totalPendingApplications
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch application count by status" });
    }
};
