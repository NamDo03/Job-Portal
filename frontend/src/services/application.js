import { apiRequest } from "./app";

export const getApplicationsByUserId = async (userId, page = 1) => {
    try {
        const response = await apiRequest.get(`/applications/user/${userId}?page=${page}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching applications:", error);
        return null;
    }
};

export const getApplicationsByCompanyId = async (companyId, search, jobId = "", status = "", page = 1) => {
    try {
        const params = { page };
        if (search) params.search = search;
        if (jobId) params.jobId = jobId;
        if (status) params.status = status;
        const response = await apiRequest.get(`/applications/company/${companyId}`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching company applications:", error);
        return null;
    }
};

export const getApplicationById = async (applicationId) => {
    try {
        const response = await apiRequest.get(`/applications/${applicationId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching application:", error);
        return null;
    }
};

export const createApplication = async (data) => {
    try {
        const response = await apiRequest.post(`/applications/create`, data);
        return response.data;
    } catch (error) {
        console.error("Error creating application:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to create application");
    }
};

export const changeApplicationStatus = async (applicationId, status) => {
    try {
        const response = await apiRequest.put(`/applications/${applicationId}/status`, { status });
        return response.data;
    } catch (error) {
        console.error("Error updating application status:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to update application status");
    }
};

export const hasUserApplied = async (jobId) => {
    try {
        const response = await apiRequest.get(`/applications/has-applied/${jobId}`);
        return response.data.hasApplied;
    } catch (error) {
        console.error("Error checking application status:", error.response?.data?.message || error.message);
        return false;
    }
};
