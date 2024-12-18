import { FC, useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    duration?: number;
}

const Toast: FC<ToastProps> = ({ message, type, duration = 3000 }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    if (!visible) return null;

    return (
        <div
            className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg text-white ${
                type === 'error' ? 'bg-red-500' : 'bg-green-500'
            }`}
        >
            <span>{message}</span>
            <button onClick={() => setVisible(false)} className="ml-4">
                X
            </button>
        </div>
    );
};

export default Toast;
