import { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-72">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="min-h-[calc(100vh-72px)] p-5 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
