import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Navigate, Link, useNavigate } from "react-router-dom";
import ImageModal from "../ImageModel/ImageModel";

export default function PendingMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);

  const API_BASE = "https://crushly-backend.onrender.com";


  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();
  const myUserId = user?._id;

  const fetchPending = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/crush/pending`,
        { withCredentials: true }
      );
      setMatches(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      fetchPending();
    }
  }, [isLoading, isAuthenticated, fetchPending]);

  if (isLoading) return <div className="min-h-screen grid place-items-center">Checking auth…</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (loading) return <div className="min-h-screen grid place-items-center">Loading matches…</div>;

  
  const uniqueMatches = [];
  const seen = new Set();

  matches.forEach((crush) => {
    const isMeSender = crush.fromUser._id === myUserId;
    const otherUser = isMeSender ? crush.toUser : crush.fromUser;

    if (!otherUser || seen.has(otherUser._id)) return;

    seen.add(otherUser._id);
    uniqueMatches.push(crush);
  });

  const confirm = async (id) => {
    await axios.post(
      `${API_BASE}/crush/confirm`,
      { crushId: id },
      { withCredentials: true }
    );
    fetchPending();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-100 to-purple-100 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-pink-600 mb-8">
          Pending Matches 💞
        </h2>

        {uniqueMatches.length === 0 && (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
            No pending matches yet 💭
          </div>
        )}

        <div className="space-y-6">
          {uniqueMatches.map((crush) => {
            const isMeSender = crush.fromUser._id === myUserId;
            const otherUser = isMeSender ? crush.toUser : crush.fromUser;

            const myConfirmed = isMeSender
              ? crush.fromConfirmed
              : crush.toConfirmed;

            const otherConfirmed = isMeSender
              ? crush.toConfirmed
              : crush.fromConfirmed;

            return (
              <div
                key={crush._id}
                className="bg-white rounded-2xl shadow p-6"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      otherUser.avatar
                        ? `${otherUser.avatar}`
                        : "https://www.gravatar.com/avatar/?d=mp"
                    }
                    className="w-14 h-14 rounded-full border"
                    onClick={() =>
                      setPreview({
                        src: otherUser.avatar
                          ? `${otherUser.avatar}`
                          : "https://www.gravatar.com/avatar/?d=mp",
                        alt: otherUser.firstName,
                      })
                    }
                  />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {otherUser.firstName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Mutual crush 💕
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  {!myConfirmed && (
                    <button
                      onClick={() => confirm(crush._id)}
                      className="w-full bg-pink-500 text-white py-2 rounded-full font-semibold"
                    >
                      Confirm Match 💘
                    </button>
                  )}

                  {myConfirmed && !otherConfirmed && (
                    <p className="text-center text-pink-600 animate-pulse">
                      Waiting for {otherUser.firstName}'s confirmation…
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/final"
            className="inline-block bg-white text-pink-600 px-6 py-3 rounded-full font-semibold shadow"
          >
            View Final Matches 🥳
          </Link>
        </div>
      </div>
      <ImageModal
        src={preview?.src}
        alt={preview?.alt}
        onClose={() => setPreview(null)}
      />
    </div>
  );
}
