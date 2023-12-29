import { apiSlice } from '../api/apiSlice';

export const quizMarkApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuizMark: builder.query({
      query: () => '/quizMark',
    }),
  }),
});

export const { useGetQuizMarkQuery } = quizMarkApi;
