'use client';

import Button from '@/components/Button';
import Input from '@/components/FormInput';
import Toast from '@/components/Toast';
import { apiService } from '@/services/api.service';
import AuthGuard from '@/utils/auth-guard';
import { SignupFormData } from '@/utils/types';
import { validateSignup } from '@/utils/validations';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Signup = () => {
    const [formData, setFormData] = useState<SignupFormData>({
        firstName: '',
        lastName: '',
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
            prevErrors.filter((error) => !error.toLowerCase().includes(name.toLowerCase()))
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateSignup(formData);
        if (validationErrors.length) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await apiService.signup(formData);
            localStorage.setItem('userData', JSON.stringify(response.Data));
            setToast({ message: 'SignUp successful!', type: 'success', key: Date.now() });
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
                    message: 'Signup failed. Try again later.',
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
                    <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">
                        Sign Up
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                type="text"
                                placeholder="Enter first name"
                                error={errors.find((e) => e.includes('firstName'))}
                                className="w-full"
                            />
                            <Input
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                type="text"
                                placeholder="Enter last name"
                                error={errors.find((e) => e.includes('lastName'))}
                                className="w-full"
                            />
                        </div>
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
                            label="Sign Up"
                            name="Sign Up"
                            className="w-full mt-4"
                        />
                    </form>
                    {toast && <Toast message={toast.message} type={toast.type} key={toast.key} />}
                    <p className="text-center mt-4 text-sm">
                        Already have an account?{' '}
                        <button
                            onClick={() => router.push('/login')}
                            className="text-blue-500 cursor-pointer"
                            role="link"
                            tabIndex={0}
                        >
                            Login here
                        </button>
                    </p>
                </div>
            </div>
        </AuthGuard>
    );
};

export default Signup;
