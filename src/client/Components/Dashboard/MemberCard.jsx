import React, { useEffect, useState } from "react";
import axios from "axios";

import { BASE_URL } from "../../../Utils/Constants";

export default function MemberCard() {
  const [cardUrl, setCardUrl] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH USER ================= */
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(`${BASE_URL}/user/me`, {
          withCredentials: true,
        });

        const user = res.data.user;

        if (user?.card?.image) {
          // ✅ UNIVERSAL FIX
          const imageUrl =
            import.meta.env.MODE === "development"
              ? `${BASE_URL}${user.card.image}`
              : user.card.image;

          setCardUrl(imageUrl);
          setUserId(user.customUserId);
        }
      } catch (err) {
        console.error("Failed to load member card", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  /* ================= DOWNLOAD CARD ================= */
  const handleDownload = () => {
    const downloadUrl =
      import.meta.env.MODE === "development"
        ? `${BASE_URL}/user/card/download`
        : "/api/user/card/download";

    window.location.href = downloadUrl;
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading card...
      </div>
    );
  }

  if (!cardUrl) {
    return (
      <div className="text-center text-gray-500">Member card not available</div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-xl overflow-hidden shadow-lg border border-gray-700">
        <img
          src={cardUrl}
          alt="Member Card"
          className="w-[280px] sm:w-[320px] object-cover"
        />
      </div>

      <button
        onClick={handleDownload}
        className="px-6 py-2 rounded-lg bg-black text-white font-medium hover:bg-gray-900 transition"
      >
        Download Card
      </button>
    </div>
  );
}
