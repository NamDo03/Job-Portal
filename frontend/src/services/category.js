import { apiRequest } from './app';

export const getCategories = async (page = 1, name = "", all = false) => {
    try {
        const params = { page };
        if (name) params.name = name;
        if (all) params.all = true;

        const response = await apiRequest.get(`/categories`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return null;
    }
};

export const getCategoryById = async (id) => {
    try {
        const response = await apiRequest.get(`/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching category:", error);
        return null;
    }
};

export const createCategory = async (data) => {
    try {
        const response = await apiRequest.post(`/categories/create`, data);
        return response.data;
    } catch (error) {
        console.error("Error creating category:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to create category");
    }
};

export const updateCategory = async (id, data) => {
    try {
        const response = await apiRequest.put(`/categories/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating category:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to update category");
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await apiRequest.delete(`/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting category:", error);
        return null;
    }
};

export const getTopCategories = async () => {
    try {
        const response = await apiRequest.get('/categories/top');
        return response.data;
    } catch (error) {
        console.error("Error fetching top categories:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch top categories");
    }
};