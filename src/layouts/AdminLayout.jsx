import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <>
      {/* Navbar */}
      <section className="py-6 bg-primary">
        <Outlet />
      </section>
    </>
  );
}
