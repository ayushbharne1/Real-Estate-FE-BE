import { useDispatch } from "react-redux";
import { logoutUser, clearSessionExpired } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const SessionExpiredModal = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    dispatch(logoutUser());
    dispatch(clearSessionExpired());
    navigate("/login");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-lg p-6 w-[380px] shadow-lg text-center">

        <h2 className="text-lg font-semibold mb-2">
          Session Expired
        </h2>

        <p className="text-gray-500 text-sm mb-6">
          Your session has expired. Please login again.
        </p>

        <button
          onClick={handleLogin}
          className="bg-[#E8431A] hover:bg-[#d03b15] text-white px-4 py-2 rounded-md"
        >
          Go to Login
        </button>

      </div>
    </div>
  );
};

export default SessionExpiredModal;