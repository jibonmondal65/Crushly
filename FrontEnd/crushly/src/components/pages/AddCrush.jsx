import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AddCrush() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);

  const API_BASE = "http://localhost:5000";

  useEffect(() => {
    axios
      .get(`${API_BASE}/profile/me`, {
        withCredentials: true,
      })
      .then(() => setAllowed(true))
      .catch(() => {
        navigate("/profile", {
          replace: true,
          state: {
            message: "Complete your profile to add a crush 💖",
          },
        });
      });
  }, [navigate]);

  if (!allowed) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        `${API_BASE}/crush/add`,
        { firstName, lastName },
        { withCredentials: true }
      );

      setMessage(res.data.message);
      setFirstName("");
      setLastName("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-tr from-slate-900 via-purple-900 to-rose-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Add Crush 💖
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            required
            placeholder="Crush's first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full bg-white/10 border border-white/20 px-4 py-3 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500"
          />

          <input
            type="text"
            placeholder="Crush's last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full bg-white/10 border border-white/20 px-4 py-3 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500"
          />

          <button
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white py-3 rounded-lg font-bold"
          >
            {loading ? "Adding..." : "Add Crush"}
          </button>
        </form>

        {message && (
          <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
            <p className="text-center text-green-300 text-sm font-medium">
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
