import { Outlet } from 'react-router-dom';
import Navbar from '../components/Admin/Navbar';

export default function AdminLayout() {
  return (
    <>
      <Navbar />
      <section className="py-6 bg-primary">
        <Outlet />
      </section>
    </>
  );
}
