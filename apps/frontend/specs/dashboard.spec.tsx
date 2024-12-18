import { apiService } from '@/services/api.service';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Dashboard from '../src/app/dashboard/page';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn()
}));

jest.mock('@/services/api.service', () => ({
    apiService: {
        getUserProfile: jest.fn(),
        logout: jest.fn()
    }
}));

beforeAll(() => {
    global.localStorage = {
        length: 0,
        clear: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn(),
        setItem: jest.fn(),
        key: jest.fn()
    };
});

describe('Dashboard', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    });

    test('renders dashboard with welcome message', () => {
        render(<Dashboard />);
        expect(screen.getByText('Welcome to the Application')).toBeInTheDocument();
    });

    test('calls handleLogout when logout button is clicked', async () => {
        // Mock API responses
        (apiService.logout as jest.Mock).mockResolvedValue(undefined);
        (apiService.getUserProfile as jest.Mock).mockResolvedValue({
            Data: { name: 'Test User' }
        });

        render(<Dashboard />);

        // Wait for useEffect to call getUserProfile
        await waitFor(() => {
            expect(apiService.getUserProfile).toHaveBeenCalledTimes(1);
        });

        // Simulate logout button click
        const logoutButton = screen.getByText('Logout');
        fireEvent.click(logoutButton);

        await waitFor(() => {
            expect(apiService.logout).toHaveBeenCalledTimes(1);
            expect(mockPush).toHaveBeenCalledWith('/login');
        });
    });

    test('renders AuthGuard component', () => {
        render(<Dashboard />);
        expect(screen.getByText('Welcome to the Application')).toBeInTheDocument();
    });
});
