import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";
import { useState } from "react";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Admin Sidebar */}
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />

      <div className="flex flex-1 flex-col min-h-screen">
        {/* Admin Header */}
        <AdminHeader setOpen={setOpenSidebar} />

        {/* Main content */}
        <main className="flex-1 flex flex-col bg-white rounded-tl-3xl shadow-inner p-6 md:p-10 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
