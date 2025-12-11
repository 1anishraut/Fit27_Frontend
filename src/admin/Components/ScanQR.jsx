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
  const alreadyScannedRef = useRef(false); // ⭐ Prevent repeated scanning

  const [qrResult, setQrResult] = useState("");
  const [userData, setUserData] = useState(null);
  const [lastLog, setLastLog] = useState(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [note, setNote] = useState("Access Granted from QR scanner");

  const beepSound = new Audio(beep);
  const grantedSound = new Audio(granted);
  const deniedSound = new Audio(denied);

  /* ====================================================== DATE FORMATTER */
  const formatDate = (d) => {
    if (!d) return "N/A";
    let parsed = new Date(d);

    if (isNaN(parsed)) {
      const parts = d.split(/[-/]/);
      if (parts.length === 3) {
        parsed = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      }
    }

    return isNaN(parsed)
      ? "N/A"
      : parsed.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  };

  /* ====================================================== START SCANNER*/
  const startScanner = async () => {
    try {
      alreadyScannedRef.current = false; // reset previous scan

      const codeReader = new BrowserQRCodeReader();
      codeReaderRef.current = codeReader;

      const devices = await BrowserQRCodeReader.listVideoInputDevices();
      const backCam =
        devices.find((d) => d.label.toLowerCase().includes("back")) ||
        devices[0];

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: backCam.deviceId },
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;

      codeReader.decodeFromVideoDevice(
        backCam.deviceId,
        videoRef.current,
        (result) => {
          if (!result) return;

          // Prevent multiple scans / multiple beeps
          if (alreadyScannedRef.current) return;
          alreadyScannedRef.current = true;

          beepSound.play();

          stopScanner(); // stop video + decoder

          const scannedId = result.getText().trim();
          setQrResult(scannedId);
          fetchUser(scannedId);
        }
      );
    } catch (e) {
      console.error(e);
      setErrorMsg("Camera access denied or unavailable.");
    }
  };

  /* ====================================================== STOP SCANNER (REAL FIX)*/
  const stopScanner = async () => {
    try {
      // Fully stop ZXing internal loops
      await codeReaderRef.current?.reset();
      await codeReaderRef.current?.stopStreams();
    } catch (e) {}

    // Stop media tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    streamRef.current = null;

    // Remove camera feed from video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    startScanner();
    return () => stopScanner();
  }, []);

  /* ====================================================== FETCH MEMBER DATA*/
  const fetchUser = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/user/byUserId/${id}`, {
        withCredentials: true,
      });

      setUserData(res.data.data);
      setLastLog(res.data.data.lastAccessLog || null);
      setNote("Access Granted from QR scanner");

      setErrorMsg("");
    } catch {
      setUserData(null);
      setLastLog(null);
      setErrorMsg("No member found!");
    }
  };

  /* ====================================================== RESET*/
  const resetScan = async () => {
    setQrResult("");
    setUserData(null);
    setLastLog(null);
    setNote("Access Granted from QR scanner");
    setErrorMsg("");
    setSuccessMsg("");

    await stopScanner();
    setTimeout(startScanner, 300);
  };

  /* ====================================================== CLOSE (FIXED)*/
  const handleClose = async () => {
    await stopScanner();
    setTimeout(() => {
      window.history.back();
    }, 200);
  };

  /* ====================================================== ACCESS DENIED */
  const handleDeny = () => {
    deniedSound.play();
    setSuccessMsg("");
  };

  /* ====================================================== ACCESS GRANTED */
  const handleGrant = async () => {
    if (!userData?._id) return;

    try {
      grantedSound.play();

      await axios.post(
        `${BASE_URL}/access/grant`,
        {
          memberId: userData._id,
          note: note || "Access Granted from QR scanner",
        },
        { withCredentials: true }
      );

      setSuccessMsg("Access Granted & Log Saved ✔");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      alert("Failed to save access log");
    }
  };



  return (
    <div className="min-h-screen flex gap-8 bg-[#F2F0EF] dark:bg-[#0b0b0c] transition-all">
      {/* LEFT SIDE */}
      <div className="w-[70%] flex flex-col gap-8">

        {/* PROFILE CARD */}
        <div className="bg-white dark:bg-[#111218] p-6 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 flex gap-8">
          <div className="h-64 w-56 overflow-hidden rounded-2xl shadow-lg">
            <img
              src={
                userData?.avatar
                  ? `${BASE_URL}${userData.avatar}`
                  : dummyProfile
              }
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold">
              {userData
                ? `${userData.firstName} ${userData.surName}`
                : "Scan to view"}
            </h2>

            <p>{userData?.emailId}</p>
            <p>{userData?.contact}</p>

            {userData && (
              <span
                className={`px-4 py-1 rounded-full text-sm font-bold
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
          <div className="flex gap-8">
            {/* PLAN */}
            <div className="w-1/2 bg-white dark:bg-[#111218] p-6 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4">Membership Plan</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between bg-gray-100 dark:bg-[#181920] p-2 rounded-xl">
                  <span>Plan Name</span>
                  <span>{userData?.selectedPlan?.planName || "N/A"}</span>
                </div>

                <div className="flex justify-between bg-gray-100 dark:bg-[#181920] p-2 rounded-xl">
                  <span>Start Date</span>
                  <span className="text-green-700">
                    {formatDate(userData.startedAt)}
                  </span>
                </div>

                <div className="flex justify-between bg-gray-100 dark:bg-[#181920] p-2 rounded-xl">
                  <span>End Date</span>
                  <span className="text-red-600">
                    {formatDate(userData.endedAt)}
                  </span>
                </div>

                <div className="flex justify-between bg-gray-100 dark:bg-[#181920] p-2 rounded-xl">
                  <span>Hold Start</span>
                  <span className="text-yellow-700">
                    {formatDate(userData.holdStartDate)}
                  </span>
                </div>

                <div className="flex justify-between bg-gray-100 dark:bg-[#181920] p-2 rounded-xl">
                  <span>Hold End</span>
                  <span className="text-yellow-700">
                    {formatDate(userData.holdEndDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* BILLING */}
            <div className="w-1/2 bg-white dark:bg-[#111218] p-6 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4">Billing Address</h3>

              <div className="space-y-2 text-sm">
                {[
                  ["Address", userData.fullAddress],
                  ["Country", userData.country],
                  ["State", userData.state],
                  ["City", userData.city],
                  ["Zip", userData.zip],
                ].map(([label, value], idx) => (
                  <div
                    key={idx}
                    className="flex justify-between bg-gray-100 dark:bg-[#181920] p-2 rounded-xl"
                  >
                    <span>{label}</span>
                    <span className="font-semibold">{value || "N/A"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="w-[30%] flex flex-col gap-6">
        {/* VIDEO SCANNER */}
        <div className="relative bg-black overflow-hidden shadow-xl border-dashed border border-green-400 h-[350px] ">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
          />

          {/* GREEN MOVING LINE */}
          {!userData && !errorMsg && (
            <div
              className="absolute left-0 w-full h-[3px] bg-green-400 shadow-[0_0_10px_2px_#22c55e] animate-scan"
              style={{ animation: "scan 2s linear infinite" }}
            ></div>
          )}

          {/* GREEN CORNERS */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-green-400"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-green-400"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-green-400"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-green-400"></div>
          </div>
        </div>

        {errorMsg && <p className="text-center text-red-500">{errorMsg}</p>}
        {qrResult && (
          <p className="text-center text-gray-700 dark:text-gray-300">
            Scanned: {qrResult}
          </p>
        )}

        {successMsg && (
          <div className="px-4 py-2 bg-green-600 text-white rounded-xl shadow text-center">
            {successMsg}
          </div>
        )}

        {/* RESET + CLOSE */}
        <div className="flex justify-evenly gap-4">
          <button
            onClick={resetScan}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl shadow"
          >
            <FiRefreshCw /> Reset
          </button>

          <button
            onClick={handleClose}
            className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-xl shadow"
          >
            <FiX /> Close
          </button>
        </div>

        {/* NOTE INPUT */}
        <div className="bg-white dark:bg-[#111218] border border-gray-300 dark:border-gray-700 p-4 rounded-xl shadow">
          <label className="text-xs text-gray-600 dark:text-gray-300">
            Note (optional)
          </label>

          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full mt-1 px-3 py-2 text-sm rounded-md border border-gray-300 
                        dark:border-gray-600 bg-gray-50 dark:bg-[#1b1b1f] 
                        text-gray-800 dark:text-gray-200"
          />
        </div>

        {/* GRANT / DENY */}
        <div className="flex gap-4 justify-evenly">
          <button
            onClick={handleDeny}
            className="flex items-center gap-2 px-5 py-2 bg-red-100 text-red-700 
                        border border-red-300 rounded-xl shadow"
          >
            <IoClose size={18} /> Denied
          </button>

          <button
            onClick={handleGrant}
            className="flex items-center gap-2 px-5 py-2 bg-green-100 text-green-700 
                        border border-green-300 rounded-xl shadow"
          >
            <FaCheck size={16} /> Granted
          </button>
        </div>

        {/* LAST ACCESS LOG */}
        <div className="bg-white dark:bg-[#111218] border border-gray-300 dark:border-gray-700 p-4 rounded-xl shadow">
          <h3 className="text-sm font-semibold mb-2">Last Access Log</h3>

          {lastLog ? (
            <div className="space-y-1 text-xs">
              <p>
                <strong>Time:</strong> {lastLog.time}
              </p>
              <p>
                <strong>Date:</strong> {formatDate(lastLog.date)}
              </p>
              {lastLog.note && (
                <p>
                  <strong>Note:</strong> {lastLog.note}
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-xs">No previous access found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
