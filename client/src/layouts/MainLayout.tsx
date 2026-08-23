import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <h1>Navbar</h1>

      <main>
        <Outlet />
      </main>

      <h1>Footer</h1>
    </div>
  );
};

export default MainLayout;
