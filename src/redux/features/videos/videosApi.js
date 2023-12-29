import { apiSlice } from '../api/apiSlice';

export const videosApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVideos: builder.query({
      query: () => '/videos',
    }),

    getVideo: builder.query({
      query: (id) => `/videos/${id}`,
    }),
  }),
});

export const { useGetVideosQuery, useGetVideoQuery } = videosApi;
