import { API_URL } from '@/api/index.ts';
import { ErrorResponse, SuccessResponse } from './responses';

export type UploadResponse = {
    name: string;
    url: string;
    original_name?: string;
};

export const apiUpload = async (
    path: string,
    token: string | null = null,
    file: File,
): Promise<SuccessResponse<UploadResponse> | ErrorResponse> => {
    let url = new URL(API_URL, location.protocol + '//' + location.host);

    if (import.meta.env.MODE === 'development') {
        url = new URL(API_URL);
    }

    url.pathname += path;

    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {
        Accept: 'application/json',
    };

    const xsrfToken = localStorage.getItem('XSRF-TOKEN');

    if (xsrfToken) {
        headers['X-XSRF-TOKEN'] = xsrfToken;
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url.toString(), {
        method: 'POST',
        body: formData,
        headers,
    }).then(
        async (
            response,
        ): Promise<SuccessResponse<UploadResponse> | ErrorResponse> => {
            if (response.status === 500) {
                return {
                    status: 'error',
                    statusCode: 500,
                    message: 'Server error',
                    errors: ['Server error'],
                };
            }
            return response
                .json()
                .then((body) => body)
                .catch(() => ({
                    status: 'error',
                    statusCode: response.status,
                    message: response.statusText,
                    errors: ['Could not parse response'],
                }));
        },
    );
};
