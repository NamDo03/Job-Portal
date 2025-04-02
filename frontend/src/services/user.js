import { apiRequest } from './app';

export const getUsers = async (page = 1, search = "", status = "") => {
    try {
        const params = {
            page,
            ...(search && { name: search }),
            ...(status && { status })
        };
        const response = await apiRequest.get(`/users`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        return null;
    }
};

export const getUserById = async (id) => {
    try {
        const response = await apiRequest.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};

export const createUser = async (userData) => {
    try {
        console.log(userData)
        const response = await apiRequest.post(`/users/create`, userData);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error creating user:', error.response.data);
            return { error: error.response.data.message || "An error occurred during user creation." };
        }
        console.error('Network Error:', error.message);
    }
};


export const updateUser = async (userId, data) => {
    try {
        const response = await apiRequest.put(`/users/${userId}`, data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error updating user:', error.response.data);
            return { error: error.response.data.message || "An error occurred during updating user." };
        }
        console.error('Network Error:', error.message);
    }
};

export const changePassword = async (userId, oldPassword, newPassword) => {
    try {
        const response = await apiRequest.put(`/users/change-password/${userId}`, { oldPassword, newPassword });
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error updating user:', error.response.data);
            return { error: error.response.data.message || "An error occurred during updating user." };
        }
        console.error('Network Error:', error.message);
    }
};
export const changeUserStatus = async (userId) => {
    try {
        const response = await apiRequest.put(`/users/status/${userId}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error changing status user:', error.response.data);
            return { error: error.response.data.message || "An error occurred during changing status user." };
        }
        console.error('Network Error:', error.message);
    }
};