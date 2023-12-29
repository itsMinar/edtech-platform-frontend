import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Logo from '../../assets/images/logo.png';
import { useRegisterMutation } from '../../redux/features/auth/authApi';

export default function Register() {
  const [register, { isLoading }] = useRegisterMutation();
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // handle user data change
  const handleUserInfoChange = (e) => {
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [e.target.name]: e.target.value,
    }));
  };

  // handle register form submit
  const handleRegister = (e) => {
    e.preventDefault();

    if (Object.values(userInfo).filter((item) => item).length === 0) {
      return toast.warning('Please fil-up register field');
    }

    if (userInfo?.password !== userInfo?.confirmPassword) {
      return toast.warning("Confirm password doesn't match");
    }

    const data = {
      name: userInfo?.name,
      email: userInfo?.email,
      password: userInfo?.password,
      role: 'student',
    };

    register(data);
  };

  return (
    <section className="py-6 bg-primary h-screen grid place-items-center">
      <div className="mx-auto max-w-md px-5 lg:px-0">
        <div>
          <img className="h-12 mx-auto" src={Logo} alt="EdTech Platform" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-100">
            Create Your New Account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="name"
                autoComplete="name"
                required
                className="login-input rounded-t-md"
                placeholder="Student Name"
                value={userInfo?.name}
                onChange={handleUserInfoChange}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="login-input "
                placeholder="Email address"
                value={userInfo?.email}
                onChange={handleUserInfoChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="login-input"
                placeholder="Password"
                value={userInfo?.password}
                onChange={handleUserInfoChange}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="confirm-password"
                required
                className="login-input rounded-b-md"
                placeholder="Confirm Password"
                value={userInfo?.confirmPassword}
                onChange={handleUserInfoChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm flex gap-2">
              Already have an account?
              <Link
                to="/"
                className="font-medium text-violet-600 hover:text-violet-500"
              >
                Login
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
