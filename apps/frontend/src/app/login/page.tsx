'use client';

import Button from '@/components/Button';
import Input from '@/components/FormInput';
import Toast from '@/components/Toast';
import { apiService } from '@/services/api.service';
import AuthGuard from '@/utils/auth-guard';
import { LoginFormData } from '@/utils/types';
import { validateLogin } from '@/utils/validations';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Login = () => {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState<string[]>([]);
    const [toast, setToast] = useState<{
        message: string;
        type: 'success' | 'error';
        key: number;
    } | null>(null);
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [e.target.name]: value });
        setErrors((prevErrors) =>
            prevErrors.filter((error) => !error.toLowerCase().includes(name))
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateLogin(formData);
        if (validationErrors.length) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await apiService.login(formData);
            localStorage.setItem('userData', JSON.stringify(response.Data));
            setToast({ message: 'Login successful!', type: 'success', key: Date.now() });
            router.push('/dashboard');
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
                    message: 'Login failed. Try again later.',
                    type: 'error',
                    key: Date.now()
                });
            }
        }
    };

    return (
        <AuthGuard>
            <div className="min-h-screen flex justify-center items-center bg-white">
                <div className="max-w-lg w-full p-8 bg-white shadow-lg rounded-lg">
                    <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            type="email"
                            placeholder="Enter email"
                            error={errors.find((e) => e.includes('email'))}
                        />
                        <Input
                            label="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            type="password"
                            placeholder="Enter password"
                            error={errors.find((e) => e.includes('password'))}
                        />
                        <Button
                            onClick={handleSubmit}
                            label="Login"
                            className="w-full mt-4"
                            name="Login"
                        />
                    </form>
                    {toast && <Toast message={toast.message} type={toast.type} key={toast.key} />}
                    <p className="text-center mt-4 text-sm">
                        Don&apos;t have an account?{' '}
                        <button
                            onClick={() => router.push('/')}
                            className="text-blue-500 cursor-pointer"
                            role="link"
                            tabIndex={0}
                        >
                            Sign up here
                        </button>
                    </p>
                </div>
            </div>
        </AuthGuard>
    );
};

export default Login;
