// UPDATED WITH SAME THEME AS CreateDaysTemplates

import React, { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import axios from "axios";
import { BASE_URL } from "../../Utils/Constants";
import { FiRefreshCw, FiX } from "react-icons/fi";
import dummyProfile from "../../assets/dummyProfile.png";

import beep from "../../assets/beep.wav";
import granted from "../../assets/granted.mp3";
import denied from "../../assets/denied.mp3";

import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

export default function ScanQR() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const codeReaderRef = useRef(null);

  const [qrResult, setQrResult] = useState("");
  const [userData, setUserData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const beepSound = new Audio(beep);
  const grantedSound = new Audio(granted);
  const deniedSound = new Audio(denied);

  // START SCANNER
  const startScanner = async () => {
    try {
      const codeReader = new BrowserQRCodeReader();
      codeReaderRef.current = codeReader;

      const devices = await BrowserQRCodeReader.listVideoInputDevices();
      const backCam =
        devices.find((d) => d.label?.toLowerCase().includes("back")) ||
        devices[0];

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: backCam.deviceId },
      });

      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;

      codeReader.decodeFromVideoDevice(
        backCam.deviceId,
        videoRef.current,
        (result) => {
          if (result) {
            const scannedId = result.getText().trim();

            beepSound.play();
            stopScanner();

            setQrResult(scannedId);
            fetchUser(scannedId);
          }
        }
      );
    } catch (err) {
      console.error(err);
      setErrorMsg("Camera access denied or unavailable.");
    }
  };

  const stopScanner = () => {
    try {
      codeReaderRef.current?.stopContinuousDecode();
    } catch {}

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    startScanner();
    return () => stopScanner();
  }, []);

  const fetchUser = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/user/byUserId/${id}`, {
        withCredentials: true,
      });
      setUserData(res.data.data);
      setErrorMsg("");
    } catch {
      setUserData(null);
      setErrorMsg("No member found!");
    }
  };

  const resetScan = () => {
    setQrResult("");
    setUserData(null);
    setErrorMsg("");
    setSuccessMsg("");
    stopScanner();
    setTimeout(() => startScanner(), 300);
  };

  const handleClose = () => {
    stopScanner();
    window.history.back();
  };

  const handleDeny = () => {
    deniedSound.play();
    setSuccessMsg("");
  };

  const handleGrant = async () => {
    if (!userData?._id) return;

    try {
      grantedSound.play();

      await axios.post(
        `${BASE_URL}/access/grant`,
        {
          memberId: userData._id,
          note: "Access Granted from QR scanner",
        },
        { withCredentials: true }
      );

      setSuccessMsg("Access Granted & Log Saved ✔");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save access log");
    }
  };

  const formatDate = (d) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className=" min-h-screen flex gap-8 bg-[#F2F0EF] dark:bg-[#0b0b0c] transition-all">
      <div className="w-[70%] flex flex-col gap-8">
        {/* PROFILE CARD */}
        <div className="bg-white dark:bg-[#111218] p-6 rounded-3xl shadow-xl flex gap-8 items-center border border-gray-200 dark:border-gray-700">
          <div className="h-64 w-56 rounded-2xl overflow-hidden shadow-lg">
            <img
              src={
                userData?.avatar
                  ? `${BASE_URL}${userData.avatar}`
                  : dummyProfile
              }
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {userData
                ? `${userData.firstName} ${userData.surName}`
                : "Scan to view"}
            </h2>

            <p className="text-gray-700 dark:text-gray-300">
              {userData?.emailId}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              {userData?.contact}
            </p>

            {userData && (
              <span
                className={`px-4 py-1 rounded-full text-sm font-bold shadow 
                ${
                  userData.status === "active"
                    ? "bg-green-100 text-green-700"
                    : userData.status === "hold"
                    ? "bg-yellow-100 text-yellow-700"
                    : userData.status === "lost"
                    ? "bg-gray-300 text-gray-800"
                    : "bg-red-200 text-red-700"
                }`}
              >
                {userData.status.toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* PLAN + BILLING */}
        {userData && (
          <div className="flex gap-8 w-full">
            {/* PLAN CARD */}
            <div className="w-1/2 bg-white dark:bg-[#111218] p-6 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Membership Plan
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold shadow 
                    ${
                      userData.subscription === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                >
                  {userData.subscription.toUpperCase()}
                </span>
              </div>

              <div className="space-y-3">
                {[
                  ["Plan Name", userData?.selectedPlan?.planName || "N/A"],
                  [
                    "Start Date",
                    formatDate(userData.startedAt),
                    "text-green-600",
                  ],
                  ["End Date", formatDate(userData.endedAt), "text-red-600"],
                  [
                    "Hold Start",
                    formatDate(userData.holdStartDate),
                    "text-yellow-700",
                  ],
                  [
                    "Hold End",
                    formatDate(userData.holdEndDate),
                    "text-yellow-700",
                  ],
                ].map(([label, val, color], i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-gray-100 dark:bg-[#181920] px-4 py-2 rounded-xl"
                  >
                    <span className="text-gray-600 dark:text-gray-400">
                      {label}
                    </span>
                    <span className={`font-semibold ${color || ""}`}>
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* BILLING CARD */}
            <div className="w-1/2 bg-white dark:bg-[#111218] p-6 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-5">
                Billing Address
              </h3>

              <div className="space-y-3">
                {[
                  ["Address", userData.fullAddress],
                  ["Country", userData.country],
                  ["State", userData.state],
                  ["City", userData.city],
                  ["Zip Code", userData.zip],
                ].map(([label, val], idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-gray-100 dark:bg-[#181920] px-4 py-2 rounded-xl"
                  >
                    <span className="text-gray-600 dark:text-gray-400">
                      {label}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {val || "N/A"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SIDE SCANNER */}
      <div className="w-[30%] flex flex-col gap-6">
        <div className="relative bg-black overflow-hidden shadow-xl border border-gray-700 h-[350px] rounded-xl">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            autoPlay
          ></video>

          {!userData && !errorMsg && (
            <div
              className="absolute left-0 w-full h-[3px] bg-green-400 shadow-[0_0_10px_2px_#22c55e] animate-scan"
              style={{ animation: "scan 2s linear infinite" }}
            ></div>
          )}

          {/* frame */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400"></div>
          </div>
        </div>

        {errorMsg && <p className="text-center text-red-500">{errorMsg}</p>}
        {qrResult && (
          <p className="text-center text-gray-700 dark:text-gray-300">
            Scanned: {qrResult}
          </p>
        )}

        <div className="flex justify-evenly gap-4">
          <button
            onClick={resetScan}
            className="
              flex items-center gap-2 px-5 py-2 
              bg-blue-600 hover:bg-blue-700 
              text-white rounded-xl shadow
            "
          >
            <FiRefreshCw /> Reset
          </button>

          <button
            onClick={handleClose}
            className="
              flex items-center gap-2 px-5 py-2 
              bg-red-600 hover:bg-red-700 
              text-white rounded-xl shadow
            "
          >
            <FiX /> Close
          </button>
        </div>

        {/* GRANT / DENY */}
        <div className="flex gap-4 justify-evenly items-center mt-2">
          <button
            onClick={handleDeny}
            className="
              flex items-center gap-2 px-5 py-2 
              bg-red-100 text-red-700 
              border border-red-300 
              hover:bg-red-200 
              rounded-xl shadow
            "
          >
            <IoClose size={18} /> Denied
          </button>

          <button
            onClick={handleGrant}
            className="
              flex items-center gap-2 px-5 py-2 
              bg-green-100 text-green-700 
              border border-green-300 
              hover:bg-green-200 
              rounded-xl shadow
            "
          >
            <FaCheck size={16} /> Granted
          </button>
        </div>
        <div>
          {successMsg && (
            <div className="px-4 py-2 bg-green-600 text-white rounded-xl shadow text-center">
              {successMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
