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

    editAssignmentMark: builder.mutation({
      query: ({ data, id }) => ({
        url: `/assignmentMark/${id}`,
        method: 'PATCH',
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
                const AssignmentMarkIndex = draft?.findIndex(
                  (t) => t?.id == assignment?.data?.id
                );

                draft[AssignmentMarkIndex] = assignment?.data;
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

export const {
  useGetAssignmentMarkQuery,
  useAddAssignmentMarkMutation,
  useEditAssignmentMarkMutation,
} = assignmentMarkApi;
