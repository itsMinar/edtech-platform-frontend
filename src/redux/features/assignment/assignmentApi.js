import { apiSlice } from '../api/apiSlice';

export const assignmentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAssignments: builder.query({
      query: () => '/assignments',
    }),
  }),
});

export const { useGetAssignmentsQuery } = assignmentsApi;
