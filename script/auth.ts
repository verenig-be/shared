import { apiFetch, validatedApiFetch } from '@/api/index.ts';
import { ApiError, ValidationError } from '@/api/error.ts';

import { User } from '@/api/resources/user.ts';

export type LoginCredentials = {
    email: string;
    password: string;
};

export type LoginResponse = {
    token: string;
    user: User;
};

export async function login({
    email,
    password,
}: LoginCredentials): Promise<LoginResponse> {
    const body = {
        email,
        password,
    };
    return apiFetch<LoginResponse>({
        path: '/auth/login',
        body,
        token: null,
        method: 'POST',
    }).then((response) => {
        if (response.status === 'error') {
            throw new ApiError('login failed', response);
        }

        return response.data;
    });
}

export async function me(token: string): Promise<User> {
    return apiFetch<User>({ path: '/auth/me', token }).then((response) => {
        if (response.status === 'error') {
            throw new ApiError('login failed', response);
        }

        return response.data;
    });
}

export async function logout(token: string): Promise<void> {
    return apiFetch<void>({ path: '/auth/logout', token }).then((response) => {
        if (response.status === 'error') {
            throw new ApiError('logout failed', response);
        }
    });
}

export async function deactiveUser(
    email: string,
    token?: string | null,
): Promise<void> {
    return apiFetch<void>({
        path: '/auth/deactivate',
        token: token,
        body: {
            email,
        },
        method: 'POST',
    }).then((response) => {
        if (response.status === 'error') {
            throw new ApiError('Authentication failed', response);
        }
    });
}

export async function sendPasswordResetEmail(
    email: string,
    token?: string | null,
): Promise<void> {
    return apiFetch<void>({
        path: token ? '/auth/activate' : '/auth/send-reset-email',
        token: token,
        body: {
            email,
        },
        method: 'POST',
    }).then((response) => {
        if (response.status === 'error') {
            throw new ApiError('Authentication failed', response);
        }

        return response.data;
    });
}

export async function passwordReset(
    passwordResetToken: string | string[],
    password: string,
): Promise<LoginResponse> {
    return validatedApiFetch<LoginResponse>({
        path: '/auth/reset-password',
        token: null,
        body: {
            passwordResetToken,
            password,
        },
        method: 'POST',
    }).then((response) => {
        if (response.status === 'error') {
            throw new ApiError('Authentication failed', response);
        }

        if (response.status === 'invalid') {
            throw new ValidationError('Authentication failed', response);
        }

        return response.data;
    });
}
