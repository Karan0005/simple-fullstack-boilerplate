'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const userData = localStorage.getItem('userData');

        if (userData) {
            if (pathname === '/login' || pathname === '/') {
                router.push('/dashboard');
            } else {
                setLoading(false);
            }
        } else {
            if (pathname === '/dashboard') {
                router.push('/login');
            } else {
                setLoading(false);
            }
        }
    }, [pathname, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-white">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthGuard;
