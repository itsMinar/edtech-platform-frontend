import { apiSlice } from '../api/apiSlice';

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users?role_like=student',
    }),
  }),
});

export const { useGetUsersQuery } = usersApi;
