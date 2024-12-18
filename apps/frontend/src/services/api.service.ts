import { APP_CONFIG } from '@/config';
import { API_ENDPOINT } from '@/utils/constants';
import { LoginFormData, SignupFormData } from '@/utils/types';
import axios, { AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
    baseURL: APP_CONFIG.apiUrl,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

export const apiService = {
    async signup(data: SignupFormData) {
        const response = await apiClient.post(API_ENDPOINT.V1.SignUp, data);
        return response.data;
    },

    async login(data: LoginFormData) {
        const response = await apiClient.post(API_ENDPOINT.V1.Login, data);
        return response.data;
    },

    async logout() {
        const response = await apiClient.post(API_ENDPOINT.V1.Logout);
        return response.data;
    },

    async getUserProfile() {
        const response = await apiClient.get(API_ENDPOINT.V1.Profile);
        return response.data;
    }
};
