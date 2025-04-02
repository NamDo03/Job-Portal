import prisma from "../lib/prisma.js";

export const saveJob = async (req, res) => {
    try {
        const { userId, jobId } = req.body;

        const existingSavedJob = await prisma.savedJob.findFirst({
            where: {
                userId: parseInt(userId),
                jobId: parseInt(jobId)
            }
        });

        if (existingSavedJob) {
            return res.status(400).json({ error: 'Job already saved' });
        }

        const savedJob = await prisma.savedJob.create({
            data: {
                userId: parseInt(userId),
                jobId: parseInt(jobId)
            },
            include: {
                job: {
                    include: {
                        company: true,
                        category: true,
                        salary: true,
                        experienceLevel: true
                    }
                }
            }
        });

        res.status(201).json(savedJob);
    } catch (error) {
        console.error('Error saving job:', error);
        res.status(500).json({ error: 'Failed to save job' });
    }
};


export const unsaveJob = async (req, res) => {
    try {
        const { userId, jobId } = req.params;

        const savedJob = await prisma.savedJob.findFirst({
            where: {
                userId: parseInt(userId),
                jobId: parseInt(jobId)
            }
        });

        if (!savedJob) {
            return res.status(404).json({ error: 'Saved job not found' });
        }

        await prisma.savedJob.delete({
            where: {
                id: savedJob.id
            }
        });

        res.status(200).json({ message: 'Job removed from saved list' });
    } catch (error) {
        console.error('Error removing saved job:', error);
        res.status(500).json({ error: 'Failed to remove saved job' });
    }
};


export const getSavedJobsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const savedJobs = await prisma.savedJob.findMany({
            where: {
                userId: parseInt(userId)
            },
            include: {
                job: {
                    include: {
                        company: true,
                        category: true,
                        salary: true,
                        experienceLevel: true,
                        position: true
                    }
                }
            },
            orderBy: {
                savedAt: 'desc'
            }
        });

        res.status(200).json(savedJobs);
    } catch (error) {
        console.error('Error fetching saved jobs:', error);
        res.status(500).json({ error: 'Failed to get saved jobs' });
    }
};


export const isJobSavedByUser = async (req, res) => {
    try {
        const { userId, jobId } = req.params;

        const savedJob = await prisma.savedJob.findFirst({
            where: {
                userId: parseInt(userId),
                jobId: parseInt(jobId)
            }
        });

        res.status(200).json({ isSaved: !!savedJob });
    } catch (error) {
        console.error('Error checking saved job:', error);
        res.status(500).json({ error: 'Failed to check saved status' });
    }
};