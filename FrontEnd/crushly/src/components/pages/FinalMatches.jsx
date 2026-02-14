import { useEffect, useState } from "react";
import axios from "axios";
import ImageModal from "../ImageModel/ImageModel";

export default function FinalMatches() {
  const [matches, setMatches] = useState([]);
  const [preview, setPreview] = useState(null);

  const API_BASE = "http://localhost:5000";

  useEffect(() => {
    axios
      .get(`${API_BASE}/crush/final`, { withCredentials: true })
      .then((res) => setMatches(res.data || []))
      .catch(console.error);
  }, []);

  const unique = [];
  const seen = new Set();

  matches.forEach((m) => {
    const key = [m.fromUser._id, m.toUser._id].sort().join("-");
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(m);
    }
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-100 to-purple-100 py-14 px-4">
      <div className="max-w-lg mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-pink-600 mb-8">
          Your Matches 💖
        </h2>

        {unique.length === 0 && (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
            No matches yet 💭
          </div>
        )}

        <div className="space-y-6">
          {unique.map((m) => (
            <div
              key={m._id}
              className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between hover:shadow-xl transition"
            >
              {/* From User */}
              <div className="flex items-center gap-3">
                <img
                  src={
                    m.fromUser.avatar
                      ? `${m.fromUser.avatar}`
                      : "https://www.gravatar.com/avatar/?d=mp"
                  }
                  alt={m.fromUser.firstName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-pink-300"
                  onClick={()=>setPreview({
                    src : m.fromUser.avatar
                      ? `${m.fromUser.avatar}`
                      : "https://www.gravatar.com/avatar/?d=mp",
                    alt : m.fromUser.firstName
                  })}
                />
                <span className="font-semibold text-gray-800">
                  {m.fromUser.firstName}
                </span>
              </div>

              {/* Heart */}
              <span className="text-3xl animate-pulse">💞</span>

              {/* To User */}
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-800">
                  {m.toUser.firstName}
                </span>
                <img
                  src={
                    m.toUser.avatar
                      ? `${m.toUser.avatar}`
                      : "https://www.gravatar.com/avatar/?d=mp"
                  }
                  alt={m.toUser.firstName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-pink-300"
                  onClick={()=>setPreview({
                    src : m.toUser.avatar
                      ? `${m.toUser.avatar}`
                      : "https://www.gravatar.com/avatar/?d=mp",
                    alt : m.toUser.firstName
                  })}
                />
              </div>
            </div>
          ))}
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
