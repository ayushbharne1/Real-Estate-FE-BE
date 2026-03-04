const ConfirmModal = ({
  isOpen,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-96 rounded-xl shadow-xl p-6 text-center animate-scaleIn border-2 border-orange-500/50">

        <h2 className="text-xl font-bold text-[#E8431A] mb-3">
          {title}
        </h2>

        <p className="text-gray-600 text-md font-semibold mb-6">
          {message}
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-full border border-[#E8431A] text-[#E8431A] hover:bg-orange-50 transition"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-full bg-[#E8431A] text-white hover:bg-[#d03b15] transition"
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmModal;