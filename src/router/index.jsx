import { createBrowserRouter } from 'react-router-dom';
import PrivateRoute from '../components/Common/PrivateRoute';
import PublicRoute from '../components/Common/PublicRoute';
import AdminLayout from '../layouts/AdminLayout';
import StudentLayout from '../layouts/StudentLayout';
import Assignment from '../pages/Admin/Assignment';
import AssignmentMark from '../pages/Admin/AssignmentMark';
import Dashboard from '../pages/Admin/Dashboard';
import Quizzes from '../pages/Admin/Quizzes';
import Videos from '../pages/Admin/Videos';
import Login from '../pages/Common/Login';
import CoursePlayer from '../pages/Student/CoursePlayer';
import LeaderBoard from '../pages/Student/LeaderBoard';
import Quiz from '../pages/Student/Quiz';
import Register from '../pages/Student/Register';

const router = createBrowserRouter([
  {
    path: '',
    element: <PublicRoute />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
    ],
  },
  {
    path: '/',
    element: <StudentLayout />,
    children: [
      {
        path: '',
        element: <PrivateRoute role="student" />,
        children: [
          {
            path: 'course-player',
            element: <CoursePlayer />,
          },
          {
            path: 'leader-board',
            element: <LeaderBoard />,
          },
          {
            path: 'quiz/:videoId',
            element: <Quiz />,
          },
        ],
      },
    ],
  },
  {
    path: 'admin',
    element: <PublicRoute />,
    children: [
      {
        index: true,
        element: <Login admin />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: '',
        element: <PrivateRoute role="admin" />,
        children: [
          {
            path: 'assignment',
            element: <Assignment />,
          },
          {
            path: 'assignment-mark',
            element: <AssignmentMark />,
          },
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
          {
            path: 'quizzes',
            element: <Quizzes />,
          },
          {
            path: 'videos',
            element: <Videos />,
          },
        ],
      },
    ],
  },
]);

export default router;
