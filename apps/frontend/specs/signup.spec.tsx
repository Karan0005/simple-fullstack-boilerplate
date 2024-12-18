import { apiService } from '@/services/api.service';
import { validateSignup } from '@/utils/validations';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Signup from '../src/app/page';

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

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn()
}));

describe('Signup component', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

        (apiService.signup as jest.Mock).mockResolvedValue({
            Data: { accessToken: 'test_token' }
        });

        (validateSignup as jest.Mock).mockReturnValue([]);
    });

    test('renders the form with placeholders', async () => {
        render(<Signup />);

        await waitFor(() => {
            expect(screen.getByPlaceholderText('Enter first name')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Enter last name')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
        });
    });

    test('handles input changes correctly', async () => {
        render(<Signup />);

        fireEvent.change(screen.getByPlaceholderText('Enter first name'), {
            target: { value: 'John' }
        });
        fireEvent.change(screen.getByPlaceholderText('Enter email'), {
            target: { value: 'john.doe@example.com' }
        });

        await waitFor(() => {
            const firstName: HTMLInputElement = screen.getByPlaceholderText('Enter first name');

            const email: HTMLInputElement = screen.getByPlaceholderText('Enter email');

            expect(firstName.value).toBe('John');
            expect(email.value).toBe('john.doe@example.com');
        });
    });

    test('submits form and calls apiService.signup', async () => {
        render(<Signup />);

        fireEvent.change(screen.getByPlaceholderText('Enter first name'), {
            target: { value: 'John' }
        });
        fireEvent.change(screen.getByPlaceholderText('Enter email'), {
            target: { value: 'john.doe@example.com' }
        });

        fireEvent.click(screen.getAllByText('Sign Up')[1]);

        await waitFor(() => {
            expect(apiService.signup).toHaveBeenCalledWith({
                firstName: 'John',
                lastName: '',
                email: 'john.doe@example.com',
                password: ''
            });
            expect(mockPush).toHaveBeenCalledWith('/dashboard');
        });
    });

    test('displays error toast on signup failure', async () => {
        (apiService.signup as jest.Mock).mockRejectedValue(new Error('Signup failed'));
        render(<Signup />);

        fireEvent.change(screen.getByPlaceholderText('Enter first name'), {
            target: { value: 'John' }
        });
        fireEvent.change(screen.getByPlaceholderText('Enter email'), {
            target: { value: 'john.doe@example.com' }
        });

        fireEvent.click(screen.getAllByText('Sign Up')[1]);

        await waitFor(() => {
            expect(screen.getByText('Signup failed. Try again later.')).toBeInTheDocument();
        });
    });
});
