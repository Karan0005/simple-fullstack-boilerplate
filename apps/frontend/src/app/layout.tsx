import { Toaster } from 'react-hot-toast';
import '../styles/global.css';
import { ReactNode } from 'react';

export const metadata = {
    title: 'Full Stack App',
    description: 'A simple signup, login, dashboard application'
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en">
            <body className="bg-white text-gray-900 min-h-screen flex flex-col">
                <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8">{children}</main>
                <Toaster position="top-right" reverseOrder={false} />
            </body>
        </html>
    );
}
