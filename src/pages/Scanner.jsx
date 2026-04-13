import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Camera, Leaf, AlertCircle } from 'lucide-react';
import { ref, push } from 'firebase/database';
import { db } from '../firebase';

const Scanner = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);        // Will contain { reply: "..." }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const webcamRef = useRef(null);

  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const PLANTNET_API_KEY = import.meta.env.VITE_PLANTNET_API_KEY;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const capturePhoto = async () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (!screenshot) {
      setError("Failed to capture image from camera");
      return;
    }

    setImage(screenshot);
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${BACKEND_URL}/plant-identify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: screenshot,
          language: "en"
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setResult({ reply: data.reply });
      } else {
        throw new Error(data.error || "Failed to identify plant");
      }

    } catch (err) {
      console.error("Scanner Error:", err);
      setError(err.message || "Failed to identify the plant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 pt-6">
      <div className="text-center mb-8">
        <Leaf className="w-16 h-16 text-primary mx-auto mb-3" />
        <h2 className="text-3xl font-bold text-primary">Plant Scanner</h2>
        <p className="text-gray-600 mt-2">Scan any leaf — get instant identification</p>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full aspect-video object-cover"
          videoConstraints={{ facingMode: "environment" }}
        />
      </div>

      <button
        onClick={capturePhoto}
        disabled={loading}
        className="mt-8 w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 
                   hover:from-emerald-700 hover:via-green-700 hover:to-teal-700
                   text-white py-6 rounded-3xl text-xl font-semibold 
                   flex items-center justify-center gap-3 shadow-xl 
                   active:scale-[0.97] transition-all duration-200 
                   disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
            Identifying Plant...
          </>
        ) : (
          <>
            <Camera className="w-8 h-8" />
            Scan Leaf Now
          </>
        )}
      </button>

      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl flex gap-3">
          <AlertCircle className="w-6 h-6 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Identification Failed</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* FIXED RESULT DISPLAY */}
      {result && result.reply && (
        <div className="mt-8 bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
          <div className="prose text-gray-700 leading-relaxed whitespace-pre-wrap">
            {result.reply}
          </div>

          <div className="mt-6 text-xs text-gray-500 text-center">
            Identified using Gemini • Always double-check with local extension officers
          </div>
        </div>
      )}

      {image && !result && !error && (
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-2">Captured Image:</p>
          <img src={image} alt="scanned" className="w-full rounded-2xl shadow" />
        </div>
      )}
    </div>
  );
};

export default Scanner;