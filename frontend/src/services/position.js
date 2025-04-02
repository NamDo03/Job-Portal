import { apiRequest } from './app';

export const getPositions = async (page = 1, name = "", all = false) => {
    try {
        const params = { page };
        if (name) params.name = name;
        if (all) params.all = true;

        const response = await apiRequest.get(`/positions`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching positions:", error);
        return null;
    }
};

export const getPositionById = async (id) => {
    try {
        const response = await apiRequest.get(`/positions/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching position:", error);
        return null;
    }
};

export const createPosition = async (name) => {
    try {
        const response = await apiRequest.post(`/positions/create`, { name });
        return response.data;
    } catch (error) {
        console.error("Error creating position:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to create position");
    }
};

export const updatePosition = async (id, name) => {
    try {
        const response = await apiRequest.put(`/positions/${id}`, { name });
        return response.data;
    } catch (error) {
        console.error("Error updating position:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to update position");
    }
};

export const deletePosition = async (id) => {
    try {
        const response = await apiRequest.delete(`/positions/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting position:", error);
        return null;
    }
};