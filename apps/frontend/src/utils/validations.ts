import { LoginFormData, SignupFormData } from './types';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/; // updated password regex to enforce max 20 characters

export const validateSignup = (data: SignupFormData): string[] => {
    const errors: string[] = [];

    // First Name validation
    if (!data.firstName.trim()) {
        errors.push('firstName is required.');
    } else if (data.firstName.length > 50) {
        errors.push('firstName cannot be more than 50 characters.');
    }

    // Last Name validation
    if (!data.lastName.trim()) {
        errors.push('lastName is required.');
    } else if (data.lastName.length > 50) {
        errors.push('lastName cannot be more than 50 characters.');
    }

    // Email validation
    if (!data.email.trim()) {
        errors.push('email is required.');
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        errors.push('A valid email is required.');
    } else if (data.email.length > 100) {
        errors.push('email cannot be more than 100 characters.');
    }

    // Password validation
    if (!passwordRegex.test(data.password)) {
        errors.push(
            'password must be between 8 and 20 characters long, include 1 letter, 1 number, and 1 special character.'
        );
    }

    return errors;
};

export const validateLogin = (data: LoginFormData): string[] => {
    const errors: string[] = [];

    // Email validation
    if (!data.email.trim()) {
        errors.push('email is required.');
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        errors.push('A valid email is required.');
    } else if (data.email.length > 100) {
        errors.push('email cannot be more than 100 characters.');
    }

    // Password validation
    if (!passwordRegex.test(data.password)) {
        errors.push(
            'password must be between 8 and 20 characters long, include 1 letter, 1 number, and 1 special character.'
        );
    }

    return errors;
};
