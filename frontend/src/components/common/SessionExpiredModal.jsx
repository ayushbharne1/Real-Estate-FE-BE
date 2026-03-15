import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser, clearSessionExpired } from "../../redux/slices/authSlice";
import { AlertTriangle } from "lucide-react";

const SessionExpiredModal = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    dispatch(logoutUser());
    dispatch(clearSessionExpired());

    navigate("/login", { replace: true });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">

      <div className="bg-white rounded-lg shadow-xl w-[380px] p-6 text-center">

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <AlertTriangle className="text-red-500 w-10 h-10" />
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Session Expired
        </h2>

        {/* Message */}
        <p className="text-sm text-gray-500 mb-6">
          Your session has expired. Please login again to continue.
        </p>

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-[#E8431A] hover:bg-[#d03b15] text-white font-medium py-2.5 rounded-md transition"
        >
          Go to Login
        </button>

      </div>

    </div>
  );
};

export default SessionExpiredModal;