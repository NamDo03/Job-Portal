import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8800/api";

export const apiGetProvinces = async () => {
    try {
        const response = await axios.get('https://provinces.open-api.vn/api');
        const formattedProvinces = response.data
            .map(province => ({
                ...province,
                name: province.name.replace(/^(Tỉnh|Thành phố)\s+/i, ""),
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
        return formattedProvinces;
    } catch (error) {
        console.error('Error fetching provinces:', error);
        throw error;
    }
};

export const apiRequest = axios.create({
    baseURL: `${BACKEND_URL}`,
    withCredentials: true,
});

