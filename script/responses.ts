export type SuccessResponse<T> = {
    status: 'success';
    data: T;
    meta?: {
        total: number;
        current_page: number;
        per_page: number;
        last_page: number;
    };
};

export type PaginatedSuccessResponse<T> = Required<SuccessResponse<T>>;

export type ErrorResponse = {
    status: 'error';
    statusCode: number;
    message: string;
    errors: string[];
};

export type ValidationErrorResponse = {
    status: 'invalid';
    statusCode: 400;
    message: 'VALIDATION';
    errors: {
        [key: string]: string[];
    };
};

export type MailResponse = {
    success_count: number;
    success_recipients: string[];
    failed_count: number;
    failed_recipients: string[];
};
