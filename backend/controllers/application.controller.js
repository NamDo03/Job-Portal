import prisma from "../lib/prisma.js";

export const createApplication = async (req, res) => {
    try {
        const { jobId, coverLetter, resume, fullname, email } = req.body;
        const userId = req.user.id;

        if (!jobId || !coverLetter || !resume || !fullname || !email) {
            return res.status(400).json({ message: "All fields are required!" });
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
                resume,
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
        const userId = req.user.id;

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
            },
        });

        if (!application) {
            return res.status(404).json({ message: "Application not found!" });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        const isCompanyMember = application.job.company.members.some(
            (member) => member.userId === userId
        );

        if (!isCompanyMember && user.member.role !== "REVIEWER" && user.member.role !== "OWNER") {
            return res.status(403).json({ message: "Unauthorized to change status!" });
        }

        const updatedApplication = await prisma.application.update({
            where: { id: parseInt(applicationId) },
            data: { status },
            include: {
                job: true,
            },
        });

        res.status(200).json(updatedApplication);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to update application status!" });
    }
};

export const getApplicationsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status, page = 1 } = req.query;
        const limit = 8;

        const whereClause = {
            userId: parseInt(userId),
        };

        if (status) {
            whereClause.status = status;
        }

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
        const { jobId, status, page = 1 } = req.query;
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
            },
        };

        if (jobIdNum) {
            whereClause.job = {
                ...whereClause.job,
                id: jobIdNum,
            };
        }

        if (status) {
            whereClause.status = status;
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
