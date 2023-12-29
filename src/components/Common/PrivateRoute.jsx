import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function PrivateRoute({ role }) {
  const auth = useAuth();

  return auth && auth?.role === role ? (
    <Outlet />
  ) : auth && auth?.role === 'admin' ? (
    <Navigate to="/admin/dashboard" />
  ) : auth && auth?.role === 'student' ? (
    <Navigate to="/course-player" />
  ) : (
    <Navigate to="/" />
  );
}
