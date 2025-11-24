import { Outlet } from "react-router";
import "./SuperAdmin.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./SideBar/Sidebar";
import { MdImportExport } from "react-icons/md";


const SuperAdminLayout = () => {
  return (
    <div className="relative">
      

      <div className="flex  h-screen w-full overflow-hidden">
        <ToastContainer position="top-center" autoClose={3000} />
        <Sidebar/>
        {/* Main Content */}
        <div className="scrollbar-hide flex-1 overflow-y-auto  mt-16 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
