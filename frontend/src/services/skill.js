import { apiRequest } from './app';

export const getSkills = async (page = 1, limit = 8, name = "", getAll = false) => {
    try {
        const params = getAll ? { limit: "all" } : { page, limit };
        if (name) params.name = name;
        const response = await apiRequest.get(`/skills`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching skills:", error);
        return null;
    }
};

export const getSkillById = async (id) => {
    try {
        const response = await apiRequest.get(`/skills/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching skill:", error);
        return null;
    }
};

export const createSkill = async (name) => {
    try {
        const response = await apiRequest.post(`/skills/create`, { name });
        return response.data;
    } catch (error) {
        console.error("Error creating skill:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to create skill");
    }
};

export const updateSkill = async (id, name) => {
    try {
        const response = await apiRequest.put(`/skills/${id}`, { name });
        return response.data;
    } catch (error) {
        console.error("Error updating skill:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to update skill");
    }
};

export const deleteSkill = async (id) => {
    try {
        const response = await apiRequest.delete(`/skills/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting skill:", error);
        return null;
    }
};