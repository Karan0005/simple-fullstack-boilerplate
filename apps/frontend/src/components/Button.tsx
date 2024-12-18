import React from 'react';

interface ButtonProps {
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void; // Adjusted type to accept event
    label: string;
    className?: string;
    name: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, label, className, name }) => {
    return (
        <button
            name={name}
            onClick={onClick}
            className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none ${className}`}
        >
            {label}
        </button>
    );
};

export default Button;
