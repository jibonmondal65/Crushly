export default function ImageModal({ src, alt, onClose }) {
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white text-black w-8 h-8 rounded-full flex items-center justify-center shadow"
        >
          ✕
        </button>

        <img
          src={src}
          alt={alt}
          className="w-full h-auto rounded-xl shadow-xl object-contain"
        />
      </div>
    </div>
  );
}
