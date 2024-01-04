import { apiSlice } from '../api/apiSlice';

export const quizzesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuizzes: builder.query({
      query: () => '/quizzes',
    }),

    addQuizzes: builder.mutation({
      query: (data) => ({
        url: '/quizzes',
        method: 'POST',
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const quiz = await queryFulfilled;

          dispatch(
            apiSlice.util.updateQueryData('getQuizzes', undefined, (draft) => {
              draft.push(quiz.data);
            })
          );
        } catch (error) {
          console.log('Something went wrong!');
        }
      },
    }),

    editQuizzes: builder.mutation({
      query: ({ data, id }) => ({
        url: `/quizzes/${id}`,
        method: 'PATCH',
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const quiz = await queryFulfilled;

          dispatch(
            apiSlice.util.updateQueryData('getQuizzes', undefined, (draft) => {
              const QuizzesIndex = draft?.findIndex(
                (t) => t?.id == quiz?.data?.id
              );

              draft[QuizzesIndex] = quiz?.data;
            })
          );
        } catch (error) {
          console.log('Something went wrong!');
        }
      },
    }),

    deleteQuizzes: builder.mutation({
      query: (id) => ({
        url: `/quizzes/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { queryFulfilled, dispatch }) {
        const deleteResult = dispatch(
          apiSlice.util.updateQueryData('getQuizzes', undefined, (draft) => {
            const index = draft.findIndex((c) => c.id == id);

            if (index !== -1) {
              draft.splice(index, 1);
            }
          })
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
  useGetQuizzesQuery,
  useAddQuizzesMutation,
  useEditQuizzesMutation,
  useDeleteQuizzesMutation,
} = quizzesApi;
