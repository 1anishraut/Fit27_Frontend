import React, { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import axios from "axios";
import { BASE_URL } from "../../Utils/Constants";
import { FiRefreshCw, FiX } from "react-icons/fi";
import dummyProfile from "../../assets/dummyProfile.png";

export default function ScanQR() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const codeReaderRef = useRef(null);

  const [qrResult, setQrResult] = useState("");
  const [userData, setUserData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // -------------------------
  // START SCANNER
  // -------------------------
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

  // -------------------------
  // STOP SCANNER
  // -------------------------
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

  // -------------------------
  // FETCH USER DATA
  // -------------------------
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

  // -------------------------
  // RESET SCAN
  // -------------------------
  const resetScan = () => {
    setQrResult("");
    setUserData(null);
    setErrorMsg("");
    stopScanner();
    setTimeout(() => startScanner(), 300);
  };

  // -------------------------
  // CLOSE PAGE
  // -------------------------
  const handleClose = () => {
    stopScanner(); // Stop camera + decoding
    window.history.back(); // Navigate(-1)
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
    <div className="p-8 min-h-screen flex gap-8 bg-[#F2F0EF] dark:bg-[#0b0b0c] transition-all">
      {/* LEFT SIDE */}
      <div className="w-[70%] flex flex-col gap-8">
        {/* PROFILE CARD */}
        <div className="bg-white dark:bg-[#121214] p-6 rounded-3xl shadow-xl flex gap-8 items-center border border-gray-200 dark:border-gray-800">
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
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

        {/* PLAN + BILLING ROW */}
        {userData && (
          <div className="flex gap-8 w-full">
            {/* PLAN CARD */}
            <div className="w-1/2 bg-white dark:bg-[#121214] p-6 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Membership Plan
                </h3>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${
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
                  ["Start Date", formatDate(userData.startedAt)],
                  ["End Date", formatDate(userData.endedAt)],
                  ["Hold Start", formatDate(userData.holdStartDate)],
                  ["Hold End", formatDate(userData.holdEndDate)],
                ].map(([label, value], idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-gray-100 dark:bg-[#1b1b1f] px-4 py-2 rounded-xl"
                  >
                    <span className="text-gray-600 dark:text-gray-400">
                      {label}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* BILLING CARD */}
            <div className="w-1/2 bg-white dark:bg-[#121214] p-6 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
                Billing Address
              </h3>

              <div className="space-y-3">
                {[
                  ["Address", userData.fullAddress || "N/A"],
                  ["Country", userData.country || "N/A"],
                  ["State", userData.state || "N/A"],
                  ["City", userData.city || "N/A"],
                  ["Zip Code", userData.zip || "N/A"],
                ].map(([label, value], idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-gray-100 dark:bg-[#1b1b1f] px-4 py-2 rounded-xl"
                  >
                    <span className="text-gray-600 dark:text-gray-400">
                      {label}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {value}
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
        <div className="bg-black rounded-3xl overflow-hidden shadow-xl border border-gray-700">
          <video ref={videoRef} className="w-full" muted autoPlay></video>
        </div>

        {errorMsg && <p className="text-center text-red-500">{errorMsg}</p>}
        {qrResult && (
          <p className="text-center text-gray-700 dark:text-gray-300">
            Scanned: {qrResult}
          </p>
        )}

        <div className="flex gap-4">
          <button
            onClick={resetScan}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow"
          >
            <FiRefreshCw /> Reset
          </button>

          <button
            onClick={handleClose}
            className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow"
          >
            <FiX /> Close
          </button>
        </div>
      </div>
    </div>
  );
}
