import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import companyLogo from "../../assets/logo.svg";
// Building image placeholder – replace src with your actual image import
// import buildingImg from "../../assets/auth/login.svg";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Logged in successfully!");
    setTimeout(() => navigate("/"), 300);
  };

  return (
    <div className="min-h-screen flex bg-white" style={{ fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ── Left: Image Panel ─────────────────────────────────────────── */}
      <div className="relative w-1/2 hidden md:block flex-shrink-0 overflow-visible">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80"
          alt="Building"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Cutout circle – sits on the right edge, half over image / half over form */}
        <div
          className="absolute top-1/2 -translate-y-1/2 bg-white rounded-full flex items-center justify-center shadow-lg z-10"
          style={{ width: 140, height: 140, right: -70 }}
        >
          <span
            className="font-extrabold text-base tracking-[0.25em]"
            style={{ color: '#E8431A', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            LOGIN
          </span>
          
        </div>
      </div>

      {/* ── Right: Form Panel ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-12 py-16 max-w-xl mx-auto w-full">

        {/* Heading */}
        <img src={companyLogo} alt=""  className="w-80 pb-5"/>
        <p className="text-sm text-gray-500 mb-8">Login or register with your Phone Number</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Username / Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-800">
              Username /Email<span className="text-[#E8431A]">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter ID"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:border-[#E8431A] focus:ring-1 focus:ring-[#E8431A]/30 transition-colors bg-white"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-800">
              Password<span className="text-[#E8431A]">*</span>
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter Passwoord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-3 pr-11 text-sm placeholder-gray-400 focus:outline-none focus:border-[#E8431A] focus:ring-1 focus:ring-[#E8431A]/30 transition-colors bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#E8431A] hover:bg-[#d03b15] active:scale-[0.98] text-white font-semibold py-3.5 rounded-md transition-all text-sm mt-1"
          >
            <LogIn className="w-4 h-4" />
            Login/ Sign Up
          </button>
        </form>

        {/* Footer note */}
        <p className="mt-10 text-xs text-gray-400 text-center">
          ** <Link to="/privacy" className="hover:underline">Privcay policy &amp; Terms and conditions</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;