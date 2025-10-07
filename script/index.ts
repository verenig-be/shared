import {
    ErrorResponse,
    SuccessResponse,
    ValidationErrorResponse,
} from '@/api/responses.ts';

export const API_URL = import.meta.env.VITE_API_URL;
export const ASSETS_ROOT = import.meta.env.VITE_ASSETS_ROOT;

export type Method = 'GET' | 'POST' | 'DELETE' | 'PATCH';

export type ApiFetchData = {
    path: string;
    method?: Method;
    token?: string | null;
    body?: object;
    headers?: Record<string, string>;
    queryParam?: Record<string, string>;
    page?: number;
    perPage?: number;
    sort?: string;
    filters?: Record<string, string>;
};

export async function validatedApiFetch<T>(
    data: ApiFetchData,
): Promise<SuccessResponse<T> | ErrorResponse | ValidationErrorResponse> {
    return callApi<
        SuccessResponse<T> | ErrorResponse | ValidationErrorResponse
    >(data);
}

export async function apiFetch<T>(data: ApiFetchData) {
    return callApi<SuccessResponse<T> | ErrorResponse>(data);
}

async function callApi<T>({
    path,
    method = 'GET',
    token = null,
    body: inputBody,
    headers: inputHeaders,
    queryParam,
    page,
    perPage,
    sort,
    filters,
}: ApiFetchData): Promise<T> {
    let url = new URL(API_URL, location.protocol + '//' + location.host);

    if (import.meta.env.MODE === 'development') {
        url = new URL(API_URL);
    }

    url.pathname += path;

    if (queryParam) {
        Object.keys(queryParam).forEach((key) => {
            url.searchParams.append(key, queryParam[key]);
        });
    }

    if (filters) {
        Object.keys(filters).forEach((key) => {
            url.searchParams.append(key, filters[key]);
        });
    }

    if (page) {
        url.searchParams.append('page', page.toString());
    }

    if (perPage) {
        url.searchParams.append('per_page', perPage.toString());
    }

    if (sort) {
        url.searchParams.append('sort', sort);
    }

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...inputHeaders,
    };

    const localLocation = localStorage.getItem('asp-location');
    if (localLocation) {
        headers['asp-location'] = localLocation;
    }

    const xsrfToken = localStorage.getItem('XSRF-TOKEN');

    if (xsrfToken) {
        headers['X-XSRF-TOKEN'] = xsrfToken;
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    let body;

    if (inputBody) {
        body = JSON.stringify(inputBody);
    }

    const config: RequestInit = {
        method,
        headers,
        body,
    };

    return fetch(url.toString(), config).then(async (response): Promise<T> => {
        if (response.status === 500) {
            const error = {
                status: 'error',
                statusCode: 500,
                message: 'Server error',
                errors: ['Server error'],
            } as T;

            postError({ error, url: url.toString(), config }, 'js');

            return error;
        }

        return response
            .json()
            .then((body) => {
                if (body.exception) {
                    throw new Error('Exception');
                }

                return body;
            })
            .catch(() => {
                const error = {
                    status: 'error',
                    statusCode: response.status,
                    message: response.statusText,
                    errors: ['Could not parse response'],
                } as T;

                postError({ error, url: url.toString(), config }, 'js');

                return error;
            });
    });
}

export async function postError(body: object, type: 'vue' | 'js' = 'vue') {
    let url = new URL(API_URL, location.protocol + '//' + location.host);

    if (import.meta.env.MODE === 'development') {
        url = new URL(API_URL);
    }

    url.pathname += '/logging/' + type;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };

    const xsrfToken = localStorage.getItem('XSRF-TOKEN');

    if (xsrfToken) {
        headers['X-XSRF-TOKEN'] = xsrfToken;
    }
    const config: RequestInit = {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    };

    return fetch(url.toString(), config).then(
        async (response): Promise<Response> => {
            return response;
        },
    );
}
