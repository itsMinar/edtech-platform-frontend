import { Outlet } from 'react-router-dom';

export default function StudentLayout() {
  return (
    <>
      {/* Navbar */}
      <section className="py-6 bg-primary">
        <Outlet />
      </section>
    </>
  );
}
