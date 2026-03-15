import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import SessionExpiredModal from "../common/SessionExpiredModal";
import { selectSessionExpired } from "../../redux/slices/authSlice";

const MainLayout = () => {

  const sessionExpired = useSelector(selectSessionExpired);

  return (
    <div className="h-screen flex flex-col overflow-hidden">

      {/* Session Expired Modal */}
      {sessionExpired && <SessionExpiredModal />}

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