'use client';

import Toast from '@/components/Toast';
import { apiService } from '@/services/api.service';
import AuthGuard from '@/utils/auth-guard';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Dashboard = () => {
    const router = useRouter();
    const [toast, setToast] = useState<{
        message: string;
        type: 'success' | 'error';
        key: number;
    } | null>(null);

    const handleLogout = async () => {
        try {
            await apiService.logout();
            localStorage.clear();
            router.push('/login');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = error.response.data?.Message || 'An unknown error occurred';
                setToast({
                    message: errorMessage,
                    type: 'error',
                    key: Date.now()
                });
            } else {
                setToast({
                    message: 'Get user profile failed. Try again later.',
                    type: 'error',
                    key: Date.now()
                });
            }
        }
    };

    // API call to get user profile
    const getUserProfile = async () => {
        try {
            await apiService.getUserProfile();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401) {
                    localStorage.clear();
                    router.push('/login');
                    return;
                }

                const errorMessage = error.response.data?.Message || 'An unknown error occurred';
                setToast({
                    message: errorMessage,
                    type: 'error',
                    key: Date.now()
                });
            } else {
                localStorage.clear();
                router.push('/login');
                return;
            }
        }
    };

    useEffect(() => {
        getUserProfile();
    });

    return (
        <AuthGuard>
            <div className="min-h-screen flex justify-center items-center bg-white">
                <div className="max-w-lg w-full p-8 bg-white shadow-lg rounded-lg text-center">
                    <h2 className="text-3xl font-semibold text-blue-600 mb-8">
                        Welcome to the Application
                    </h2>
                    <button
                        onClick={handleLogout}
                        className="w-full py-3 px-6 bg-red-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 transition duration-300 ease-in-out"
                    >
                        Logout
                    </button>
                </div>
            </div>
            {toast && <Toast message={toast.message} type={toast.type} key={toast.key} />}
        </AuthGuard>
    );
};

export default Dashboard;
