import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<any, any>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        signup: builder.mutation<any, any>({
            query: (userData) => ({
                url: '/auth/signup',
                method: 'POST',
                body: userData,
            }),
        }),
        getProfile: builder.query<any, void>({
            query: () => '/auth/profile',
            providesTags: ['User'],
        }),
    }),
});

export const { useLoginMutation, useSignupMutation, useGetProfileQuery } = authApi;
