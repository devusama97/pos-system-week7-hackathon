import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token && token !== 'undefined' && token !== 'null') {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['RawMaterials', 'Products', 'Orders', 'Dashboard', 'User'],
    endpoints: () => ({}),
});
