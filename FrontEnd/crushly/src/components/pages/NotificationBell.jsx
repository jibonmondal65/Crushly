import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const notifRef = useRef(null);
    const { isAuthenticated } = useSelector((state) => state.auth);

    const API_BASE = "https://crushly-backend.onrender.com";

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(
                `${API_BASE}/notifications`,
                { withCredentials: true }
            );
            setNotifications(res.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications();
        }
    }, [isAuthenticated]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notifRef.current &&
                !notifRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markAsRead = async () => {
        try {
            await axios.post(
                `${API_BASE}/notifications/read`,
                {},
                { withCredentials: true }
            );

            setNotifications(prev =>
                prev.map(n => ({ ...n, isRead: true }))
            );
        } catch (err) {
            console.error(err);
        }
    };

    const toggleDropdown = () => {
        setOpen(!open);
        if (!open && unreadCount > 0) {
            markAsRead();
        }
    };

    return (
        <div className="relative" ref={notifRef}>
            {/* Bell Icon */}
            <button
                onClick={toggleDropdown}
                className="relative text-2xl"
            >
                🔔
                {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl p-4 z-50 
                  bg-linear-to-br from-pink-100 via-rose-100 to-pink-200
                  shadow-2xl border border-pink-300">

                    <h3 className="font-bold mb-4 text-pink-700 text-lg">
                        🔔 Notifications
                    </h3>

                    {notifications.length === 0 && (
                        <p className="text-pink-600 text-sm text-center py-6">
                            No notifications yet 💌
                        </p>
                    )}

                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                        {notifications.map((n) => (
                            <div
                                key={n._id}
                                className={`p-4 rounded-xl text-sm transition-all duration-300 
            ${n.isRead
                                        ? "bg-white/60 text-pink-700 hover:bg-white/80"
                                        : "bg-pink-500 text-white shadow-lg scale-[1.02]"
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <p>{n.message}</p>
                                </div>

                                <div className={`text-xs mt-2 ${n.isRead ? "text-pink-500" : "text-pink-100"
                                    }`}>
                                    {new Date(n.createdAt).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}
