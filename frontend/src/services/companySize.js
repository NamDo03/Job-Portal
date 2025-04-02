import { apiRequest } from './app';

export const getComanySize = async (page = 1, keyword, all = false) => {
    try {
        const params = { page };
        if (keyword) params.keyword = keyword;
        if (all) params.all = true;

        const response = await apiRequest.get(`/companySize`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching company size:", error);
        return null;
    }
};

export const getCompanySizeById = async (id) => {
    try {
        const response = await apiRequest.get(`/companySize/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching company size:", error);
        return null;
    }
};

export const createCompanySize = async (minEmployees, maxEmployees) => {
    try {
        const response = await apiRequest.post(`/companySize/create`, { minEmployees, maxEmployees });
        return response.data;
    } catch (error) {
        console.error("Error creating company size:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to create company size");
    }
};

export const updateComanySize = async (id, minEmployees, maxEmployees) => {
    try {
        const response = await apiRequest.put(`/companySize/${id}`, { minEmployees, maxEmployees });
        return response.data;
    } catch (error) {
        console.error("Error updating company size:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to update company size");
    }
};

export const deleteComanySize = async (id) => {
    try {
        const response = await apiRequest.delete(`/companySize/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting company size:", error);
        return null;
    }
};