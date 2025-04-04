import { apiRequest } from './app';

export const getJobs = async (page = 1, search, status = "", filters = {}) => {
    try {
        const params = { page };
        if (search) params.search = search;
        if (status) params.status = status;
        if (filters.employmentType) params.employmentType = filters.employmentType;
        if (filters.categories) params.categories = filters.categories;
        if (filters.levels) params.levels = filters.levels;
        if (filters.salaries) params.salaries = filters.salaries;
        if (filters.location) params.location = filters.location;
        const response = await apiRequest.get('/jobs', {
            params,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching jobs:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch jobs");
    }
};

export const getJobById = async (id) => {
    try {
        const response = await apiRequest.get(`/jobs/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching job details:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch job details");
    }
};

export const createJob = async (data) => {
    try {
        const response = await apiRequest.post(`/jobs/create`, data);
        return response.data;
    } catch (error) {
        console.error("Error creating job:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to create job");
    }
};

export const deleteJob = async (id) => {
    try {
        const response = await apiRequest.delete(`/jobs/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting  job status:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to delete job status");
    }
};

export const changeJobStatus = async (id, status) => {
    try {
        const response = await apiRequest.put(`/jobs/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error("Error updating job status:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to update job status");
    }
};

export const getJobsByCompany = async (companyId, page = 1, search, status, all = false) => {
    try {
        const params = { page };
        if (search) params.search = search;
        if (status) params.status = status;
        if (all) params.all = all;

        const response = await apiRequest.get(`/jobs/company/${companyId}`, {
            params,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching jobs by company:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch jobs by company");
    }
};

export const getLatestJobs = async () => {
    try {
        const response = await apiRequest.get('/jobs/latest');
        return response.data;
    } catch (error) {
        console.error("Error fetching latest jobs:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch latest jobs");
    }
};

export const getFeaturedJobs = async () => {
    try {
        const response = await apiRequest.get('/jobs/featured');
        return response.data;
    } catch (error) {
        console.error("Error fetching featured jobs:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch featured jobs");
    }
};