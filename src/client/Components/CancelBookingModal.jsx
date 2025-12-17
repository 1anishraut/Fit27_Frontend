import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../Utils/Constants";

export default function CancelBookingModal({ bookingId, onClose, onSuccess }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!reason.trim()) {
      alert("Please enter cancellation reason");
      return;
    }

    try {
      setLoading(true);

      await axios.patch(
        `${BASE_URL}/user/booking/booked-classes/cancel/${bookingId}`,
        { reason },
        { withCredentials: true }
      );

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-md p-6">
        {/* Heading */}
        <h2 className="text-lg font-semibold mb-4">Cancel Class Booking</h2>

        {/* Reason */}
        <label className="block text-sm mb-1">Cancellation Reason</label>
        <textarea
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border rounded-md p-2 text-sm dark:bg-gray-800"
          placeholder="Enter reason"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-sm"
            disabled={loading}
          >
            Close
          </button>

          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm"
            disabled={loading}
          >
            {loading ? "Cancelling..." : "Confirm Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}
