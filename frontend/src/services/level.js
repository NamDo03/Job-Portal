import { apiRequest } from './app';

export const getLevels = async (page = 1, name = "", all = false) => {
    try {
        const params = { page };
        if (name) params.name = name;
        if (all) params.all = true;
        const response = await apiRequest.get(`/levels`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching levels:", error);
        return null;
    }
};

export const getLevelById = async (id) => {
    try {
        const response = await apiRequest.get(`/levels/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching level:", error);
        return null;
    }
};

export const createLevel = async (name) => {
    try {
        const response = await apiRequest.post(`/levels/create`, { name });
        return response.data;
    } catch (error) {
        console.error("Error creating level:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to create level");
    }
};

export const updateLevel = async (id, name) => {
    try {
        const response = await apiRequest.put(`/levels/${id}`, { name });
        return response.data;
    } catch (error) {
        console.error("Error updating level:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to update level");
    }
};

export const deleteLevel = async (id) => {
    try {
        const response = await apiRequest.delete(`/levels/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting level:", error);
        return null;
    }
};