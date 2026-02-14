import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/slice";
import { useState } from "react";
import axios from "axios";
import NotificationBell from "../../components/pages/NotificationBell";

export default function Navbar() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-10 py-4 flex justify-between items-center bg-pink-500 text-white shadow-md">
      <h1 className="text-2xl font-semibold">Crushly 💖</h1>

      <nav className="flex gap-6 items-center relative">
        <Link to="/" className="hover:text-pink-100 transition">
          Home
        </Link>

        {!isAuthenticated ? (
          <>
            <Link to="/login" className="hover:text-pink-100 transition">
              Login
            </Link>
            <Link to="/register" className="hover:text-pink-100 transition">
              Register
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-6 relative">

            {/* Notification Component */}
            <NotificationBell />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 font-medium hover:text-pink-100 transition"
              >
                <span>Hello, {user.firstName}</span>
                <span className={`transition ${open ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-40 bg-white text-gray-700 rounded-lg shadow-lg overflow-hidden">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>

                  <button
                    onClick={async () => {
                      try {
                        await axios.post(
                          "http://localhost:5000/user/logout",
                          {},
                          { withCredentials: true }
                        );

                        dispatch(logout());
                        navigate("/login");
                      } catch (err) {
                        console.error("Logout failed", err);
                      }
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        )}
      </nav>
    </header>
  );
}
