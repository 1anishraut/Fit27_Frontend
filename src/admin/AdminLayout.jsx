import { Outlet } from "react-router";

import AdminNavbar from "./AdminNavbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";

const AdminLayout = () => {
  return (
    <div className="relative">
    <Header/>

    <div className="flex  h-screen w-full overflow-hidden">
      <ToastContainer position="top-center" autoClose={3000} />
      <AdminNavbar />
      {/* Main Content */}
      <div className="scrollbar-hide flex-1 overflow-y-auto  mt-16">
        <Outlet />
      </div>
    </div>
    </div>
  );
};

export default AdminLayout;
