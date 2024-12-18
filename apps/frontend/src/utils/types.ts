export interface SignupFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface IConfig {
    appName: string;
    apiUrl: string;
    debugMode: boolean;
}

export interface ToastProps {
    message: string;
    type: 'success' | 'error';
}
