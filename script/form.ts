import { apiFetch } from '@/api/index.ts';
import { ApiError } from '@/api/error.ts';

export type Form =
    | 'user'
    | 'project-filters'
    | 'aircraft-filters'
    | 'search/aircraft-types'
    | 'search/operators'
    | 'search/companies'
    | 'search/aircraft-bases'
    | 'search/supplier-types';

export async function getFormData<T>(
    form: Form,
    token: string,
    search: string = '',
    filters: Record<string, string[]> = {},
) {
    const queryParam: Record<string, string> = {};
    if (search) {
        queryParam.search = search;
    }

    if (Object.keys(filters).length > 0) {
        Object.keys(filters).forEach((key) => {
            queryParam[`f-${key}`] = filters[key].join('-');
        });
    }

    return apiFetch<T>({
        path: `/form/${form}`,
        token,
        queryParam: queryParam,
    }).then((response) => {
        if (response.status === 'error') {
            throw new ApiError(`Could not get userFormData`, response);
        }

        return response.data;
    });
}
