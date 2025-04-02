import { apiRequest } from './app';

export const signup = async (data) => {
    try {
        const response = await apiRequest.post("/auth/signup", data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error Response:', error.response.data);
            return { error: error.response.data.message || "An error occurred during signup." };
        }
        console.error('Network Error:', error.message);
    }
};

export const login = async (data) => {
    try {
        const response = await apiRequest.post("/auth/login", data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error Response:', error.response.data);
            return { error: error.response.data.message || "An error occurred during signup." };
        }
        console.error('Network Error:', error.message);
    }
};


export const logout = async () => {
    try {
        const response = await apiRequest.post("/auth/logout");
        return response.data;
    } catch (error) {
        console.error("Logout failed:", error.response?.data || error.message);
        return { error: error.response?.data?.message || "Logout failed" };
    }
};

