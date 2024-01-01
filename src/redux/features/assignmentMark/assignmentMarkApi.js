import { apiSlice } from '../api/apiSlice';

export const assignmentMarkApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAssignmentMark: builder.query({
      query: () => '/assignmentMark',
    }),

    addAssignmentMark: builder.mutation({
      query: (data) => ({
        url: '/assignmentMark',
        method: 'POST',
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const assignment = await queryFulfilled;

          dispatch(
            apiSlice.util.updateQueryData(
              'getAssignmentMark',
              undefined,
              (draft) => {
                draft.push(assignment.data);
              }
            )
          );
        } catch (error) {
          console.log('Something went wrong!');
        }
      },
    }),
  }),
});

export const { useGetAssignmentMarkQuery, useAddAssignmentMarkMutation } =
  assignmentMarkApi;
