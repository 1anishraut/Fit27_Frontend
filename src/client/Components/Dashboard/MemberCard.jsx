import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../Utils/Constants";

export default function MemberCard() {
  const [cardUrl, setCardUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(`${BASE_URL}/user/me`, {
          withCredentials: true,
        });

        const user = res.data.user;

        if (user?.card?.image) {
          setCardUrl(
            import.meta.env.MODE === "development"
              ? `${BASE_URL}${user.card.image}`
              : user.card.image
          );
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const handleDownload = () => {
    const url =
      import.meta.env.MODE === "development"
        ? `${BASE_URL}/user/card/download`
        : "/api/user/card/download";

    window.location.href = url;
  };

  if (loading) return <div>Loading...</div>;
  if (!cardUrl) return <div>No card available</div>;

  return (
    <div className="flex flex-col items-center gap-4">
      <img src={cardUrl} className="w-[300px]" />
      <button onClick={handleDownload}>Download Card</button>
    </div>
  );
}
