import React from 'react';

interface InputProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type: string;
    placeholder: string;
    error?: string;
    className?: string; // New prop for custom class names
}

const Input: React.FC<InputProps> = ({
    label,
    name,
    value,
    onChange,
    type,
    placeholder,
    error,
    className
}) => {
    return (
        <div className={`mb-4 ${className}`}>
            <label className="block text-sm font-semibold text-gray-700">{label}</label>
            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`mt-1 p-2 w-full rounded-lg border ${
                    error ? 'border-red-500' : 'border-gray-300'
                } text-gray-900 bg-white`}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default Input;
