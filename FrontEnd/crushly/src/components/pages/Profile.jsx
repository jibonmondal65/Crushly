import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import ImageModal from "../ImageModel/ImageModel";


const API_BASE = "http://localhost:5000";

export default function Profile() {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState(null);

  const fileInputRef = useRef(null);

  const location = useLocation();
  const message = location.state?.message;


  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/profile/me`, {
          withCredentials: true,
        });

        if (res.data.avatar) {
          setAvatar(res.data.avatar);
        }

        setBio(res.data.bio || "");
        setGender(res.data.gender || "");
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }


  // Avatar handler
  const handleAvatarClick = () => fileInputRef.current.click();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files allowed");
      return;
    }

    setAvatarFile(file);
    setAvatar(URL.createObjectURL(file)); // preview
  };


  // Update profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!avatar && !avatarFile) {
      setError("Profile picture is required");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      formData.append("bio", bio);
      formData.append("gender", gender);

      const res = await axios.put(
        `${API_BASE}/profile/create`,
        formData,
        { withCredentials: true }
      );


      if (res.data.avatar) {
        setAvatar(res.data.avatar);
        setAvatarFile(null);
      }

      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        {message && (
          <div className="bg-pink-100 text-pink-700 p-3 rounded-lg mb-4 text-center">
            {message}
          </div>
        )}

        <h2 className="text-2xl font-bold text-pink-600 text-center mb-2">
          Update Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <div className="relative w-28 h-28">
              <img
                src={avatar || "https://www.gravatar.com/avatar/?d=mp&f=y"}
                className="w-28 h-28 rounded-full object-cover border-2 border-pink-400"
                onClick={() => setPreview({ src: avatar || "https://www.gravatar.com/avatar/?d=mp&f=y", alt: "Profile Picture" })}
              />
              <button
                type="button"
                onClick={handleAvatarClick}
                className="absolute bottom-1 right-1 bg-pink-500 text-white p-2 rounded-full"
              >
                📷
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Bio */}
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />

          {/* Gender */}
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-pink-500 text-white py-2.5 rounded-lg"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
        </form>
      </div>
      <ImageModal
              src={preview?.src}
              alt={preview?.alt}
              onClose={() => setPreview(null)}
            />
    </div>
  );
}
