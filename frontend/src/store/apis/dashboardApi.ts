import { baseApi } from './baseApi';

export const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardStats: builder.query<any, void>({
            query: () => '/dashboard',
            providesTags: ['Dashboard'],
        }),
    }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
