import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { userLoggedIn } from './redux/features/auth/authSlice';
import router from './router';

export default function App() {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const localAuth = localStorage?.getItem('EdTech-Login');

    if (localAuth) {
      const auth = JSON.parse(localAuth);

      if (auth?.accessToken && auth?.user) {
        dispatch(
          userLoggedIn({
            accessToken: auth.accessToken,
            user: auth.user,
          })
        );
      }
    }

    setAuthChecked(true);
  }, [dispatch, setAuthChecked]);

  if (!authChecked) {
    return <div>Loading...</div>;
  }

  return <RouterProvider router={router} />;
}
