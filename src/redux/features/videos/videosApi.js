import { apiSlice } from '../api/apiSlice';

export const videosApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVideos: builder.query({
      query: () => '/videos',
    }),

    getVideo: builder.query({
      query: (id) => `/videos/${id}`,
    }),

    addVideo: builder.mutation({
      query: (data) => ({
        url: '/videos',
        method: 'POST',
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const video = await queryFulfilled;

          dispatch(
            apiSlice.util.updateQueryData('getVideos', undefined, (draft) => {
              draft.push(video.data);
            })
          );
        } catch (error) {
          console.log('Something went wrong!');
        }
      },
    }),

    editVideo: builder.mutation({
      query: ({ data, id }) => ({
        url: `/videos/${id}`,
        method: 'PATCH',
        body: data,
      }),

      async onQueryStarted({ id }, { queryFulfilled, dispatch }) {
        try {
          const video = await queryFulfilled;

          dispatch(
            apiSlice.util.updateQueryData('getVideos', undefined, (draft) => {
              const videoIndex = draft?.findIndex(
                (t) => t?.id == video?.data?.id
              );

              draft[videoIndex] = video?.data;
            })
          );

          dispatch(
            apiSlice.util.updateQueryData('getVideo', id, (draft) => {
              Object.assign(draft, video?.data);
            })
          );
        } catch (error) {
          console.log('Something went wrong!');
        }
      },
    }),

    deleteVideo: builder.mutation({
      query: (id) => ({
        url: `/videos/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { queryFulfilled, dispatch }) {
        const deleteResult = dispatch(
          apiSlice.util.updateQueryData('getVideos', undefined, (draft) => {
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
  useGetVideosQuery,
  useGetVideoQuery,
  useAddVideoMutation,
  useEditVideoMutation,
  useDeleteVideoMutation,
} = videosApi;
