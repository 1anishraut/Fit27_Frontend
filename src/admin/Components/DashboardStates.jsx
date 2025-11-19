import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { BASE_URL } from "../../Utils/Constants";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { addMembers } from "../../Utils/membersSlice";

const DashboardStats = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allMembersData = useSelector((state) => state.members);
  console.log(allMembersData);

  const [newMebers, setNewMembers] = useState("");
  const [manualBookings, setManualBookings] = useState("");

  const allMembers = async () => {
    // setLoading(true);
    // setError("");

    try {
      const res = await axios.get(BASE_URL + "/allUsers");
      // console.log(res.data);
      dispatch(addMembers(res.data));
      const today = new Date().toDateString();

      const filtered = res.data.filter(
        (item) => new Date(item.createdAt).toDateString() === today
      );
      setNewMembers(filtered.length);

      const filterManualBookings = res.data.filter(
        (item) => item.bookingFrom === "Manual Booking"
      );
      console.log(filterManualBookings);

      setManualBookings(filterManualBookings.length);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    allMembers();
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* NEW MEMBERS  */}
      <div className="border border-gray-200 rounded-lg shadow-sm p-6 bg-white text-center">
        <h2 className="text-lg font-semibold mb-4">New Members</h2>
        <div className="text-5xl font-semibold text-black">{newMebers}</div>
        <div className="flex justify-center items-center gap-1 text-green-600 mt-1 text-sm">
          <span>(0%)</span>
          <FaArrowUp className="text-xs" />
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Joined since 01 weeks compared with {new Date().toDateString()}
        </p>
      </div>

      {/* TODAY VISIT */}
      <div className="border border-gray-200 rounded-lg shadow-sm p-6 bg-white text-center">
        <h2 className="text-lg font-semibold mb-4">Today Visit</h2>
        <div className="text-5xl font-semibold text-black">0</div>
        <div className="flex justify-center items-center gap-1 text-green-600 mt-1 text-sm">
          <span>(0%)</span>
          <FaArrowUp className="text-xs" />
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Successful visits today so far compared with the same time on 16th Sep
          06:55 pm
        </p>
      </div>

      {/* MEMBER VISIT */}
      <div className="border border-gray-200 rounded-lg shadow-sm p-6 bg-white text-center">
        <h2 className="text-lg font-semibold mb-4">Member Visit</h2>
        <div className="text-5xl font-semibold text-black">0</div>
        <div className="flex justify-center items-center gap-1 text-green-600 mt-1 text-sm">
          <span>(0%)</span>
          <FaArrowUp className="text-xs" />
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Visits from 01 Nov compared with 01 Oct to 16 Oct
        </p>
      </div>

      {/* MANUAL BOOKINGS */}
      <div className="border border-gray-200 rounded-lg shadow-sm p-6 bg-white text-center">
        <h2 className="text-lg font-semibold mb-4">Manual Bookings</h2>
        <div className="text-5xl font-semibold text-black">
          {manualBookings}
        </div>
        <div className="flex justify-center items-center gap-1 text-green-600 mt-1 text-sm">
          <span>(0%)</span>
          <FaArrowUp className="text-xs" />
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Bookings from 01 Nov compared with 01 Oct to 16 Oct
        </p>
      </div>

      {/* ONLINE BOOKINGS */}
      <div className="border border-gray-200 rounded-lg shadow-sm p-6 bg-white text-center">
        <h2 className="text-lg font-semibold mb-4">Online Bookings</h2>
        <div className="text-5xl font-semibold text-black">
          {allMembersData.length - manualBookings}
        </div>
        <div className="flex justify-center items-center gap-1 text-green-600 mt-1 text-sm">
          <span>(0%)</span>
          <FaArrowUp className="text-xs" />
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Bookings from 01 Nov compared with 01 Oct to 16 Oct
        </p>
      </div>

      {/* ONLINE SIGNUP */}
      <div className="border border-gray-200 rounded-lg shadow-sm p-6 bg-white text-center">
        <h2 className="text-lg font-semibold mb-4">Online Bookings</h2>
        <div className="text-5xl font-semibold text-black">
          {allMembersData.length - manualBookings}
        </div>
        <div className="flex justify-center items-center gap-1 text-green-600 mt-1 text-sm">
          <span>(0%)</span>
          <FaArrowUp className="text-xs" />
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Bookings from 01 Nov compared with 01 Oct to 16 Oct
        </p>
      </div>
    </div>
  );
};

export default DashboardStats;
