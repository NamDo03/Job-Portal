import prisma from "../lib/prisma.js";

export const getAllJobs = async (req, res) => {
    const pageSize = 8
    try {
        const { page = 1, search, status = "", employmentType, categories, levels, salaries, location } = req.query;
        const pageNumber = parseInt(page, 10);

        if (isNaN(pageNumber)) {
            return res.status(400).json({ message: "Invalid page parameter!" });
        }

        if (pageNumber < 1) {
            return res.status(400).json({ message: "Page must be greater than 0!" });
        }

        const skip = (pageNumber - 1) * pageSize;

        const filter = {
            ...(status !== "" && { status }),
            ...(search && { title: { contains: search } }),
            ...(employmentType && { jobType: employmentType }),
            ...(categories && { categoryId: parseInt(categories) }),
            ...(levels && { experienceLevelId: parseInt(levels) }),
            ...(salaries && { salaryId: parseInt(salaries) }),
            ...(location && {
                company: {
                    location: {
                        contains: `, ${location.trim()}`
                    }
                }
            })
        };

        const totalJobs = await prisma.job.count({ where: filter });

        const jobs = await prisma.job.findMany({
            where: filter,
            skip,
            take: pageSize,
            orderBy: { postedAt: "desc" },
            include: {
                company: true,
                category: true,
                position: true,
                salary: true,
                experienceLevel: true,
                skills: { include: { skill: true } },
            },
        });

        res.status(200).json({
            data: jobs,
            pagination: {
                total: totalJobs,
                page: pageNumber,
                totalPages: Math.ceil(totalJobs / pageSize),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
};

export const getJobById = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Invalid job ID!" });
        }

        const job = await prisma.job.findUnique({
            where: { id: parseInt(id) },
            include: {
                company: {
                    include: {
                        images: true
                    }
                },
                category: true,
                position: true,
                salary: true,
                experienceLevel: true,
                skills: { include: { skill: true } },
                applications: true,
            },
        });

        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }

        res.status(200).json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch job" });
    }
};

export const createJob = async (req, res) => {
    const {
        companyId,
        categoryId,
        positionId,
        salaryId,
        experienceLevelId,
        title,
        jobDescription,
        candidateRequirements,
        benefits,
        workingHours,
        location,
        jobType,
        amount,
        skillIds,
    } = req.body;

    if (
        !companyId ||
        !categoryId ||
        !positionId ||
        !salaryId ||
        !experienceLevelId ||
        !title ||
        !jobDescription ||
        !candidateRequirements ||
        !benefits ||
        !workingHours ||
        !location ||
        !jobType ||
        !amount
    ) {
        return res.status(400).json({ message: "Missing required fields!" });
    }

    try {
        const companyExists = await prisma.company.findUnique({
            where: { id: parseInt(companyId) },
        });

        if (!companyExists) {
            return res.status(400).json({ message: "Company does not exist!" });
        }

        const postedAt = new Date();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        const newJob = await prisma.job.create({
            data: {
                companyId: parseInt(companyId),
                categoryId: parseInt(categoryId),
                positionId: parseInt(positionId),
                salaryId: parseInt(salaryId),
                experienceLevelId: parseInt(experienceLevelId),
                title,
                jobDescription,
                candidateRequirements,
                benefits,
                workingHours,
                location,
                jobType,
                postedAt,
                expiresAt,
                amount: parseInt(amount),
                status: "PENDING",
            },
        });

        if (skillIds && skillIds.length > 0) {
            await prisma.jobSkill.createMany({
                data: skillIds.map((skillId) => ({
                    jobId: newJob.id,
                    skillId: parseInt(skillId),
                })),
            });
        }

        res.status(201).json(newJob);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create job" });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Invalid job ID!" });
        }

        const job = await prisma.job.findUnique({
            where: { id: parseInt(id) },
        });

        if (!job) {
            return res.status(404).json({ message: "Job not found!" });
        }

        await prisma.jobSkill.deleteMany({
            where: { jobId: parseInt(id) },
        });

        await prisma.application.deleteMany({
            where: { jobId: parseInt(id) },
        });

        await prisma.savedJob.deleteMany({
            where: { jobId: parseInt(id) },
        });

        await prisma.job.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ message: "Job deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete job" });
    }
};

export const changeStatusJob = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Invalid job ID!" });
        }

        const job = await prisma.job.findUnique({
            where: { id: parseInt(id) },
        });

        if (!job) {
            return res.status(404).json({ message: "Job not found!" });
        }

        const updatedJob = await prisma.job.update({
            where: { id: parseInt(id) },
            data: { status },
        });

        res.status(200).json(updatedJob);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update job status" });
    }
};

export const getJobsByCompany = async (req, res) => {
    const pageSize = 8;
    try {
        const { companyId } = req.params;
        const { page = 1, search, status, all = false } = req.query;
        const pageNumber = parseInt(page, 10);

        if (isNaN(pageNumber)) {
            return res.status(400).json({ message: "Invalid page parameter!" });
        }

        if (pageNumber < 1) {
            return res.status(400).json({ message: "Page must be greater than 0!" });
        }

        const skip = (pageNumber - 1) * pageSize;

        const filter = {
            companyId: parseInt(companyId),
            ...(status && { status }),
            ...(search && { title: { contains: search } }),
        };
        
        if (all) {
            const jobs = await prisma.job.findMany({
                where: filter,
                orderBy: { postedAt: "desc" },
                include: {
                    company: true,
                    category: true,
                    position: true,
                    salary: true,
                    experienceLevel: true,
                    skills: { include: { skill: true } },
                },
            });

            return res.status(200).json({ data: jobs });
        }

        const totalJobs = await prisma.job.count({ where: filter });

        const jobs = await prisma.job.findMany({
            where: filter,
            skip,
            take: pageSize,
            orderBy: { postedAt: "desc" },
            include: {
                company: true,
                category: true,
                position: true,
                salary: true,
                experienceLevel: true,
                skills: { include: { skill: true } },
            },
        });

        res.status(200).json({
            data: jobs,
            pagination: {
                total: totalJobs,
                page: pageNumber,
                totalPages: Math.ceil(totalJobs / pageSize),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch jobs by company" });
    }
};

export const getLatestJobs = async (req, res) => {
    try {
        const jobs = await prisma.job.findMany({
            where: {
                status: 'APPROVED',
                expiresAt: { gt: new Date() }
            },
            take: 8,
            orderBy: { postedAt: 'desc' },
            include: {
                company: true,
                category: true,
                position: true,
                salary: true,
                experienceLevel: true
            }
        });
        res.status(200).json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch latest jobs" });
    }
};

export const getFeaturedJobs = async (req, res) => {
    try {


        const jobs = await prisma.job.findMany({
            where: {
                status: 'APPROVED',
                expiresAt: { gt: new Date() }
            },
            take: 8,
            orderBy: [
                { salary: { max: 'desc' } },
                { applications: { _count: 'desc' } },
                { postedAt: 'desc' }
            ],
            include: {
                company: true,
                category: true,
                position: true,
                salary: true,
                experienceLevel: true,
                _count: {
                    select: { applications: true }
                }
            }
        });

        res.status(200).json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch featured jobs" });
    }
};