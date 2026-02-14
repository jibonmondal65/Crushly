import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = "https://crushly-backend.onrender.com";

  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(
        `${API_BASE}/user/reset-password`,
        { email, otp, newPassword }
      );

      navigate("/login", {
        replace: true,
        state: { message: "Password reset successful 🎉" },
      });

    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl">

        <h2 className="text-2xl font-bold text-center text-pink-600 mb-4">
          Reset Password 🔁
        </h2>

        {error && (
          <div className="mb-4 bg-red-100 text-red-600 p-2 text-sm rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">

          <input
            type="text"
            required
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 text-center tracking-widest focus:ring-2 focus:ring-pink-400"
          />

          <input
            type="password"
            required
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
