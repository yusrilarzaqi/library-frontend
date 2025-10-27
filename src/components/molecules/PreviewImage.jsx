
const PreviewImage = ({ image, setShowPreviewModal }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={() => setShowPreviewModal(false)}
    >
      <img
        src={image}
        alt="Avatar besar"
        className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()} // supaya klik gambar tidak menutup modal
      />
      <button
        type="button"
        onClick={() => setShowPreviewModal(false)}
        className="absolute top-5 right-5 text-white text-3xl font-bold"
      >
        &times;
      </button>
    </div>
  );
};

export default PreviewImage;
