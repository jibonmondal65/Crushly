export default function Footer() {
  return (
    <footer className="w-full bg-pink-500 text-white text-center py-4 shadow-inner">
      <p className="text-sm opacity-90">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold">Crushly</span> • Made with ❤️
      </p>
    </footer>
  );
}
