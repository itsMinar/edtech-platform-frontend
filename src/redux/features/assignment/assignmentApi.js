import { apiSlice } from '../api/apiSlice';

export const assignmentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAssignments: builder.query({
      query: () => '/assignments',
    }),

    addAssignment: builder.mutation({
      query: (data) => ({
        url: '/assignments',
        method: 'POST',
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const assignment = await queryFulfilled;

          dispatch(
            apiSlice.util.updateQueryData(
              'getAssignments',
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

    editAssignment: builder.mutation({
      query: ({ data, id }) => ({
        url: `/assignments/${id}`,
        method: 'PATCH',
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const assignment = await queryFulfilled;

          dispatch(
            apiSlice.util.updateQueryData(
              'getAssignments',
              undefined,
              (draft) => {
                const AssignmentIndex = draft?.findIndex(
                  (t) => t?.id == assignment?.data?.id
                );

                draft[AssignmentIndex] = assignment?.data;
              }
            )
          );
        } catch (error) {
          console.log('Something went wrong!');
        }
      },
    }),

    deleteAssignment: builder.mutation({
      query: (id) => ({
        url: `/assignments/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { queryFulfilled, dispatch }) {
        const deleteResult = dispatch(
          apiSlice.util.updateQueryData(
            'getAssignments',
            undefined,
            (draft) => {
              const index = draft.findIndex((c) => c.id == id);

              if (index !== -1) {
                draft.splice(index, 1);
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (err) {
          deleteResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetAssignmentsQuery,
  useAddAssignmentMutation,
  useEditAssignmentMutation,
  useDeleteAssignmentMutation,
} = assignmentsApi;
