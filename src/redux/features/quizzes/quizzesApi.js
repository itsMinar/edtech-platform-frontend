import { apiSlice } from '../api/apiSlice';

export const quizzesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuizzes: builder.query({
      query: () => '/quizzes',
    }),
  }),
});

export const { useGetQuizzesQuery } = quizzesApi;
