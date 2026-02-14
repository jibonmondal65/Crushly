import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../../features/slice";
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const API_BASE = "https://crushly-backend.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(loginStart());

    try {
      const res = await axios.post(
        `${API_BASE}/user/login`,
        { email, password },
        { withCredentials: true }
      );


      dispatch(loginSuccess(res.data.user));

      navigate("/");
    } catch (err) {

      dispatch(
        loginFailure(
          err.response?.data?.message || "Invalid email or password"
        )
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-pink-600">
            Crushly 💖
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Login to see who likes you
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-md bg-red-100 text-red-600 text-sm px-3 py-2 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-pink-500"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <Link
            to="/forgot-password"
            className="text-sm text-pink-600 hover:underline text-right block"
          >
            Forgot Password?
          </Link>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-500 text-white py-2 rounded-lg disabled:opacity-60"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Don’t have an account?{" "}
            <Link to="/register" className="text-pink-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
