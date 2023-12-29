import { toast } from 'react-toastify';
import { apiSlice } from '../api/apiSlice';
import { userLoggedIn } from './authSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ data }) => ({
        url: '/login',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;

          if (data?.user?.role === arg?.role) {
            localStorage.setItem('EdTech-Login', JSON.stringify(data));
            dispatch(userLoggedIn(data));
            toast.success('Login Successfully!');
          } else {
            localStorage.removeItem('EdTech-Login');
            toast.error('Login Fail!');
          }
        } catch (error) {
          localStorage.removeItem('EdTech-Login');
          toast.error(error?.error?.data || 'Login Fail!');
        }
      },
    }),
    register: builder.mutation({
      query: (data) => ({
        url: '/register',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;

          localStorage.setItem('EdTech-Login', JSON.stringify(data));
          dispatch(userLoggedIn(data));
          toast.success('Student register successfully!');
        } catch (error) {
          localStorage.removeItem('EdTech-Login');
          toast.error(error?.error?.data || 'User Registration Fail!');
        }
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
