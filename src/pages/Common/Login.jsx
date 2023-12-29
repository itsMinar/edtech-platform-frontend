import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/images/logo.png';

export default function Login({ admin }) {
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });

  // handle user data change
  const handleUserInfoChange = (e) => {
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [e.target.name]: e.target.value,
    }));
  };

  // handle login form submit
  const handleLogin = (e) => {
    e.preventDefault();
  };

  return (
    <section className="py-6 bg-primary h-screen grid place-items-center">
      <div className="mx-auto max-w-md px-5 lg:px-0">
        <div>
          <img className="h-12 mx-auto" src={Logo} alt="EdTech Platform" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-100">
            Sign in to {admin ? 'Admin' : 'Student'} Account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
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
                className="login-input rounded-t-md"
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
                className="login-input rounded-b-md"
                placeholder="Password"
                value={userInfo?.password}
                onChange={handleUserInfoChange}
              />
            </div>
          </div>

          {!admin && (
            <div className="flex items-center justify-end">
              <div className="text-sm flex gap-2 items-center">
                <span>Don&apos;t have an account?</span>
                <Link
                  to="/register"
                  className="font-medium text-violet-600 hover:text-violet-500"
                >
                  Register
                </Link>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
