import { apiRequest } from './app';

export const saveJob = async (userId, jobId) => {
    try {
        const response = await apiRequest.post(`/saved-jobs`, { userId, jobId });
        return response.data;
    } catch (error) {
        console.error('Error saving job:', error.response?.data?.error || error.message);
        throw error;
    }
};

export const unsaveJob = async (userId, jobId) => {
    try {
        const response = await apiRequest.delete(`/saved-jobs/${userId}/${jobId}`);
        return response.data;
    } catch (error) {
        console.error('Error unsaving job:', error.response?.data?.error || error.message);
        throw error;
    }
};

export const getSavedJobsByUser = async (userId) => {
    try {
        const response = await apiRequest.get(`/saved-jobs/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching saved jobs:', error.response?.data?.error || error.message);
        throw error;
    }
};

export const isJobSavedByUser = async (userId, jobId) => {
    try {
        const response = await apiRequest.get(`/saved-jobs/check/${userId}/${jobId}`);
        return response.data.isSaved;
    } catch (error) {
        console.error('Error checking saved status:', error.response?.data?.error || error.message);
        throw error;
    }
};