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
    <div className="p-6 min-h-screen bg-[#F2F0EF] dark:bg-[#09090B]">
      <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Scan Member QR Code
      </h1>

      {/* CAMERA PREVIEW */}
      <div className="max-w-md mx-auto bg-black rounded-xl overflow-hidden shadow-xl">
        <video ref={videoRef} className="w-full h-auto" muted autoPlay></video>
      </div>

      {qrResult && (
        <p className="text-center mt-4 text-gray-700 dark:text-gray-300">
          Scanned ID: <strong>{qrResult}</strong>
        </p>
      )}

      {errorMsg && <p className="mt-4 text-center text-red-500">{errorMsg}</p>}

      {/* USER DETAILS */}
      {userData && (
        <div className="max-w-lg mx-auto mt-6 p-4 bg-white dark:bg-[#0D0D0F] rounded-xl shadow">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            Member Details
          </h2>

          <p>
            <strong>User ID:</strong> {userData.customUserId}
          </p>

          <p>
            <strong>Name:</strong> {userData.firstName} {userData.surName}
          </p>

          <p>
            <strong>Contact:</strong> {userData.contact}
          </p>

          <p>
            <strong>Status:</strong> {userData.status}
          </p>

          <p>
            <strong>Subscription:</strong> {userData.subscription}
          </p>

          {userData.selectedPlan && (
            <p>
              <strong>Plan:</strong> {userData.selectedPlan.planName}
            </p>
          )}

          {userData.endedAt && (
            <p>
              <strong>Expires:</strong>{" "}
              {new Date(userData.endedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
