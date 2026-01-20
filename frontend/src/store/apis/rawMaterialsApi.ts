import { baseApi } from './baseApi';

export const rawMaterialsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRawMaterials: builder.query<any[], void>({
            query: () => '/raw-materials',
            providesTags: ['RawMaterials'],
        }),
        createRawMaterial: builder.mutation<any, any>({
            query: (data) => ({
                url: '/raw-materials',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['RawMaterials'],
        }),
        updateRawMaterial: builder.mutation<any, { id: string; data: any }>({
            query: ({ id, data }) => ({
                url: `/raw-materials/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['RawMaterials', 'Products'],
        }),
        deleteRawMaterial: builder.mutation<any, string>({
            query: (id) => ({
                url: `/raw-materials/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['RawMaterials', 'Products'],
        }),
    }),
});

export const {
    useGetRawMaterialsQuery,
    useCreateRawMaterialMutation,
    useUpdateRawMaterialMutation,
    useDeleteRawMaterialMutation,
} = rawMaterialsApi;

