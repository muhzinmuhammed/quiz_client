import { api } from "../api";

const userAuth = api.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (values) => ({
                url: '/v1/auth/register',
                method: 'POST',
                body: values,
            }),
        }),
        login: builder.mutation({
            query: (values) => ({
                url: '/v1/auth/login',
                method: 'POST',
                body: values,
            }),
        }),
        adminLogin: builder.mutation({
            query: (values) => ({
                url: '/v2/admin/login',
                method: 'POST',
                body: values,
            }),
        }),
        adminDashboard: builder.query({
            query: ({ page = 1, search = "" }) => ({
                url: `/v2/admin/dashboard?page=${page}&search=${search}`,  // Pass page and search as query parameters
                method: 'GET',
            }),
        }),
        totalMark: builder.mutation({
            query: ({ values, _id }) => ({
                url: `/v1/auth/mark/${_id}`,
                method: 'POST',
                body: values,
            }),
        }),
    }),
});

// Export hooks for usage in functional components
export const {
    useRegisterMutation,
    useLoginMutation,
    useAdminLoginMutation,
    useTotalMarkMutation,
    useAdminDashboardQuery, // Export the hook for adminDashboard
} = userAuth;
