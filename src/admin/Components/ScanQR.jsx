import React, { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import axios from "axios";
import { BASE_URL } from "../../Utils/Constants";

export default function ScanQR() {
  const videoRef = useRef(null);
  const [qrResult, setQrResult] = useState("");
  const [userData, setUserData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const codeReader = new BrowserQRCodeReader();
    let allowScan = true;

    async function startScanner() {
      try {
        const devices = await BrowserQRCodeReader.listVideoInputDevices();

        // Prefer back camera
        const backCam =
          devices.find((d) => d.label?.toLowerCase().includes("back")) ||
          devices[0];

        codeReader.decodeFromVideoDevice(
          backCam.deviceId,
          videoRef.current,
          (result, err) => {
            if (result && allowScan) {
              allowScan = false;

              // IMPORTANT → trim the result (fix "user not found")
              const scannedId = result.getText().trim();

              setQrResult(scannedId);
              fetchUser(scannedId);

              // Allow scanning again after 2 seconds
              setTimeout(() => {
                allowScan = true;
              }, 2000);
            }
          }
        );
      } catch (err) {
        console.error(err);
        setErrorMsg("Camera access denied or unavailable.");
      }
    }

    startScanner();

    // Proper cleanup for @zxing/browser
    return () => {
      try {
        codeReader.stopContinuousDecode();
      } catch (e) {
        console.warn("Cleanup ignore:", e.message);
      }
    };
  }, []);

  const fetchUser = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/user/byUserId/${id}`, {
        withCredentials: true,
      });
      setUserData(res.data.data);
      setErrorMsg("");
    } catch (err) {
      setUserData(null);
      setErrorMsg("No member found!");
    }
  };

  return (
    <div className="flex justify-between gap-8  bg-[#F2F0EF] dark:bg-[#09090B]">
      {/* Left SIde || USER DETAILS */}
      <div className="border w-[70%]">

        <div className="flex gap-4 items-center">
          <div className="border h-[250px] w-auto">
            <img src="" alt="Profile image " className="h-full w-full" />
          </div>
          <div>
            <h1>Name</h1>
            <h1>Email</h1>
            <h1>Contact</h1>
          </div>
        </div>
        <div>
          <h1>Plan Details</h1>
          <div>
            <h1>Plan Name</h1>
            <h1>Start Date</h1>
            <h1>End Date</h1>
            <h1>Hold Start Date</h1>
            <h1>Hold End Date</h1>
          </div>
        </div>
        <div>
          <h1>Billing Address</h1>
          <div>
            <h1>Full Address</h1>
            <h1>Country</h1>
            <h1>State</h1>
            <h1>City</h1>
            <h1>Zip Code</h1>
          </div>
        </div>
        
      </div>

      {/* Right SIde  */}
      <div className="border  w-[30%] flex flex-col items-center p-4 gap-4">
        {/* 1 Camera */}
        <div>
          <div className="max-w-md mx-auto bg-black rounded-xl overflow-hidden shadow-xl border">
            <video
              ref={videoRef}
              className="w-full h-auto"
              muted
              autoPlay
            ></video>
          </div>

          {qrResult && (
            <p className="text-center mt-4 text-gray-700 dark:text-gray-300">
              Scanned ID: <strong>{qrResult}</strong>
            </p>
          )}

          {errorMsg && (
            <p className="mt-4 text-center text-red-500">{errorMsg}</p>
          )}
        </div>
        {/* 2 Message */}
        <div className="border w-full rounded-xl">
          <h1>Message</h1>
          <p>This is a dummy message for checking </p>
        </div>

        {/* 3 Status  */}
        <div className="border w-full rounded-xl">
          <h1>Status</h1>
          <p>
            Subscription: <span></span>
          </p>
          <p>
            User: <span></span>
          </p>
        </div>
        {/* 4 Buttons  */}
        <div className="border w-full rounded-xl">
          <button>Reset</button>
          <button>Close</button>
        </div>
      </div>
    </div>
  );
}
