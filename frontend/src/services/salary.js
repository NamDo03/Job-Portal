import { apiRequest } from './app';

export const getSalaries = async (page = 1, keyword, all = false) => {
    try {
        const params = { page };
        if (keyword) params.keyword = keyword;
        if (all) params.all = true;

        const response = await apiRequest.get(`/salaries`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching salaries:", error);
        return null;
    }
};

export const getSalaryById = async (id) => {
    try {
        const response = await apiRequest.get(`/salaries/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching salary:", error);
        return null;
    }
};

export const createSalary = async (min, max) => {
    try {
        const response = await apiRequest.post(`/salaries/create`, { min, max });
        return response.data;
    } catch (error) {
        console.error("Error creating salary:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to create salary");
    }
};

export const updateSalary = async (id, min, max) => {
    try {
        const response = await apiRequest.put(`/salaries/${id}`, { min, max });
        return response.data;
    } catch (error) {
        console.error("Error updating salary:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to update salary");
    }
};

export const deleteSalary = async (id) => {
    try {
        const response = await apiRequest.delete(`/salaries/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting salary:", error);
        return null;
    }
};