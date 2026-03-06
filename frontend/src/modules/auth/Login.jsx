import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import companyLogo from "../../assets/logo.svg";

const Login = () => {
  const [identifier, setIdentifier] = useState("Shivam");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Logged in successfully!");
    setTimeout(() => navigate("/"), 300);
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left: Image Panel */}
      <div className="relative w-1/2 hidden md:block overflow-visible">
        <img
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80"
          alt="Building"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Circular LOGIN badge */}
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[160px] h-[100px] bg-white rounded-l-full flex items-center justify-center z-10">
          {/* <span className="text-[#E8431A] font-extrabold text-base tracking-widest [writing-mode:vertical-rl] rotate-180"> */}
          <span className="text-[#E8431A] font-extrabold text-2xl  tracking-widest ">
            LOGIN
          </span>
        </div>
      </div>

      {/* Right: Form Panel - Perfectly Centered */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo and Subtitle */}
          <div className="mb-10">
            <img src={companyLogo} alt="INFINITEREALTY" className="w-64 mb-4" />
            <p className="text-sm text-gray-500">
              Login with your email or username.
            </p>
          </div>

          {/* Login Title */}
          <div className="mb-8">
            <span className="text-[#E8431A] font-bold text-xl">LOGIN</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username/Email Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Username/Email<span className="text-[#E8431A] ml-1">*</span>
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full px-0 py-2 border-0 border-b-2 border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-[#E8431A] transition-colors bg-transparent"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Password<span className="text-[#E8431A] ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-0 py-2 border-0 border-b-2 border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-[#E8431A] transition-colors bg-transparent pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-0 bottom-2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#E8431A] hover:bg-[#d03b15] text-white font-medium py-3.5 px-4 rounded-md transition-colors flex items-center justify-center gap-2 text-sm mt-10"
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
          </form>

          {/* Footer */}
          <p className="mt-10 text-xs text-gray-400 text-center">
            **{" "}
            <Link to="/privacy" className="hover:underline hover:text-gray-500">
              Privacy policy & Terms and conditions
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;