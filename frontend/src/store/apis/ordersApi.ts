import { baseApi } from './baseApi';

export const ordersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query<any[], void>({
            query: () => '/orders',
            providesTags: ['Orders'],
        }),
        createOrder: builder.mutation<any, any>({
            query: (orderData) => ({
                url: '/orders',
                method: 'POST',
                body: orderData,
            }),
            invalidatesTags: ['Orders', 'RawMaterials', 'Products', 'Dashboard'],
        }),
    }),
});

export const { useGetOrdersQuery, useCreateOrderMutation } = ordersApi;
