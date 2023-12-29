import { apiSlice } from '../api/apiSlice';

export const assignmentMarkApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAssignmentMark: builder.query({
      query: () => '/assignmentMark',
    }),
  }),
});

export const { useGetAssignmentMarkQuery } = assignmentMarkApi;
