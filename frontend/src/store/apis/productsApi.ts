import { baseApi } from './baseApi';

export const productsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<any[], void>({
            query: () => '/products',
            providesTags: ['Products'],
        }),
        createProduct: builder.mutation<any, FormData>({
            query: (data) => ({
                url: '/products',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Products', 'Dashboard'],
        }),
        updateProduct: builder.mutation<any, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/products/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Products', 'Dashboard'],
        }),
        deleteProduct: builder.mutation<any, string>({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Products', 'Dashboard'],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productsApi;

