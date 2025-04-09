import { apiRequest } from './app';

export const getCompanies = async (page = 1, search, all, status, location, companySize) => {
    try {
        const params = { page };
        if (search) params.search = search;
        if (all) params.all = true;
        if (status) params.status = status;
        if (location) params.location = location;
        if (companySize) params.companySize = companySize;
        const response = await apiRequest.get('/companies', {
            params,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching companies:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch companies");
    }
};

export const getCompanyById = async (id) => {
    try {
        const response = await apiRequest.get(`/companies/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching company details:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch company details");
    }
};

export const createCompany = async (data) => {
    try {
        const response = await apiRequest.post(`/companies/create`, data);
        return response.data;
    } catch (error) {
        console.error("Error creating company:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to create company");
    }
};

export const updateCompany = async (id, data) => {
    try {
        const response = await apiRequest.put(`/companies/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating company:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to update company");
    }
};

export const updateCompanyStatus = async (id, status) => {
    try {
        const response = await apiRequest.put(`/companies/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error("Error updating company status:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to update company status");
    }
};

export const getCompanyMembers = async (id, page = 1, search, all = false) => {
    if (!id || isNaN(parseInt(id))) {
        throw new Error("Invalid company ID!");
    }

    try {
        const response = await apiRequest.get(`/companies/${id}/members`, {
            params: {
                page,
                search,
                all
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching company members:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch company members");
    }
};

export const hireUserByEmail = async (id, email, role = "MEMBER") => {
    try {
        const response = await apiRequest.post(`/companies/${id}/hire`, { email, role });
        return response.data;
    } catch (error) {
        console.error("Error hiring user:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to hire user");
    }
};

export const updateMemberRole = async (companyId, memberId, role) => {
    try {
        const response = await apiRequest.put(`/companies/${companyId}/members/${memberId}/role`, { role });
        return response.data;
    } catch (error) {
        console.error("Error updating member role:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to update member role");
    }
};

export const deleteMember = async (companyId, memberId) => {
    try {
        const response = await apiRequest.delete(`/companies/${companyId}/members/${memberId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting member:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to delete member");
    }
};

export const getCompaniesStatics = async () => {
    try {
        const response = await apiRequest.get(`/companies/statics`);
        return response.data;
    } catch (error) {
        console.error("Error fetching company statics:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch company statics");
    }
};