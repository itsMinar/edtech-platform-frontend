import { apiSlice } from '../api/apiSlice';

export const quizMarkApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuizMark: builder.query({
      query: () => '/quizMark',
    }),

    addQuizMark: builder.mutation({
      query: (data) => ({
        url: '/quizMark',
        method: 'POST',
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const quiz = await queryFulfilled;

          dispatch(
            apiSlice.util.updateQueryData('getQuizMark', undefined, (draft) => {
              draft.push(quiz.data);
            })
          );
        } catch (error) {
          console.log('Something went wrong.');
        }
      },
    }),
  }),
});

export const { useGetQuizMarkQuery, useAddQuizMarkMutation } = quizMarkApi;
