import { apiService } from '@/services/api.service';
import { validateLogin } from '@/utils/validations';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Login from '../src/app/login/page';

jest.mock('@/services/api.service');
jest.mock('next/navigation');
jest.mock('@/utils/validations');
jest.mock('@/components/FormInput', () => {
    const FormInput = ({
        name,
        value,
        onChange,
        placeholder
    }: {
        name: string;
        value: string;
        onChange: React.ChangeEventHandler<HTMLInputElement>;
        placeholder: string;
    }) => <input name={name} value={value} onChange={onChange} placeholder={placeholder} />;
    FormInput.displayName = 'FormInput';
    return FormInput;
});

jest.mock('@/components/Button', () => {
    const Button = ({
        onClick,
        label
    }: {
        onClick: React.MouseEventHandler<HTMLButtonElement>;
        label: string;
    }) => <button onClick={onClick}>{label}</button>;
    Button.displayName = 'Button';
    return Button;
});

jest.mock('@/components/Toast', () => {
    const Toast = ({ message }: { message: string }) => <div>{message}</div>;
    Toast.displayName = 'Toast';
    return Toast;
});

jest.mock('@/utils/auth-guard', () => {
    const MockAuthGuard = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
    MockAuthGuard.displayName = 'AuthGuard';
    return MockAuthGuard;
});

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn()
}));

describe('Login component', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

        (apiService.login as jest.Mock).mockResolvedValue({
            Data: { accessToken: 'test_token' }
        });

        (validateLogin as jest.Mock).mockReturnValue([]);
    });

    test('renders the form with placeholders', async () => {
        render(<Login />);

        await waitFor(() => {
            expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
        });
    });

    test('handles input changes correctly', async () => {
        render(<Login />);

        fireEvent.change(screen.getByPlaceholderText('Enter email'), {
            target: { value: 'john.doe@example.com' }
        });
        fireEvent.change(screen.getByPlaceholderText('Enter password'), {
            target: { value: 'password123' }
        });

        await waitFor(() => {
            const email: HTMLInputElement = screen.getByPlaceholderText('Enter email');
            const password: HTMLInputElement = screen.getByPlaceholderText('Enter password');

            expect(email.value).toBe('john.doe@example.com');
            expect(password.value).toBe('password123');
        });
    });

    test('submits form and calls apiService.login', async () => {
        render(<Login />);

        fireEvent.change(screen.getByPlaceholderText('Enter email'), {
            target: { value: 'john.doe@example.com' }
        });
        fireEvent.change(screen.getByPlaceholderText('Enter password'), {
            target: { value: 'password123' }
        });

        fireEvent.click(screen.getAllByText('Login')[1]);

        await waitFor(() => {
            expect(apiService.login).toHaveBeenCalledWith({
                email: 'john.doe@example.com',
                password: 'password123'
            });
            expect(mockPush).toHaveBeenCalledWith('/dashboard');
        });
    });

    test('displays error toast on login failure', async () => {
        (apiService.login as jest.Mock).mockRejectedValue(new Error('Login failed'));
        render(<Login />);

        fireEvent.change(screen.getByPlaceholderText('Enter email'), {
            target: { value: 'john.doe@example.com' }
        });
        fireEvent.change(screen.getByPlaceholderText('Enter password'), {
            target: { value: 'password123' }
        });

        fireEvent.click(screen.getAllByText('Login')[1]);

        await waitFor(() => {
            expect(screen.getByText('Login failed. Try again later.')).toBeInTheDocument();
        });
    });
});
