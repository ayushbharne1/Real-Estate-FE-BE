import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";

const MainLayout = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      
      {/* Navbar */}
      <div className="flex-shrink-0">
        <Navbar />
      </div>

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <div className="flex-shrink-0">
          <Sidebar />
        </div>

        {/* Outlet Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <Outlet />
          </div>
        </div>

      </div>
    </div>
  );
};

export default MainLayout;