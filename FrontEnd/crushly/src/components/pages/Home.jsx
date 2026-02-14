import { Link } from "react-router-dom";

export default function Home() {
  return (
  
    <div className="min-h-screen flex flex-col bg-linear-to-br from-pink-400 to-pink-500 text-white">

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center text-center px-5">
        <div className="bg-white/15 backdrop-blur-md p-10 rounded-2xl max-w-md w-full">
          <h2 className="text-3xl font-semibold mb-4">
            Find Your Secret Crush 💌
          </h2>

          <p className="text-base mb-8 opacity-90">
            Add your crush anonymously and discover if they like you back.
            No awkward moments. Just magic ✨
          </p>

          <div className="flex flex-col gap-4">
            <Link
              to="/pending"
              className="border-2 border-white px-6 py-3 rounded-full font-semibold hover:bg-white/20 transition"
            >
              Check Who Likes You Back 👀
            </Link>

            <Link
              to="/crush"
              className="border-2 border-white px-6 py-3 rounded-full font-semibold hover:bg-white/20 transition"
            >
               Add Your Crush ❤️
            </Link>

            <Link
              to="/profile"
              className="border-2 border-white px-6 py-3 rounded-full font-semibold hover:bg-white/20 transition"
            >
              Update Profile ✏️
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
