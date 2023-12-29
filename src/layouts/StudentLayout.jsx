import { Outlet } from 'react-router-dom';
import Navbar from '../components/Student/Navbar';

export default function StudentLayout() {
  return (
    <>
      <Navbar />
      <section className="py-6 bg-primary">
        <Outlet />
      </section>
    </>
  );
}
