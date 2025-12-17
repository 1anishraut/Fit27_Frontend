import dayjs from "dayjs";

const BookClassConfirmModal = ({
  open,
  onClose,
  onConfirm,
  selectedClasses,
  loading,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-xl rounded-2xl bg-[#111218] border border-gray-700 p-6">
        {/* HEADER */}
        <h2 className="text-lg font-semibold text-white mb-4 text-center">
          Confirm Class Booking
        </h2>

        {/* SELECTED CLASSES */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {selectedClasses.map((c, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-gray-700 bg-[#1a1b22] p-3 text-sm text-gray-200"
            >
              <div className="font-semibold text-white">{c.title}</div>
              <div>{dayjs(c.date).format("DD MMM YYYY, dddd")}</div>
              <div>
                {c.startedAt} – {c.endedAt}
              </div>
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-gray-600 text-sm text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-green-600 text-sm text-white hover:bg-green-700"
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookClassConfirmModal;
