import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Camera, Bug, AlertCircle } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const PestScanner = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const webcamRef = useRef(null);
  const [language, setLanguage] = useState("en");

  const capturePhoto = async () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (!screenshot) {
      setError("Failed to capture image");
      return;
    }

    setImage(screenshot);
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${BACKEND_URL}/pest-identify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: screenshot,
          language: language
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to identify pest");
      }

      setResult({ reply: data.reply });

    } catch (err) {
      console.error(err);
      setError(err.message || "Could not identify the pest. Please try again with better lighting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 pt-6">
      <div className="text-center mb-8">
        <Bug className="w-16 h-16 text-red-600 mx-auto mb-3" />
        <h2 className="text-3xl font-bold text-red-700">Pest Identifier</h2>
        <p className="text-gray-600 mt-2">Take photo of pest or damaged leaves</p>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full aspect-video object-cover"
          videoConstraints={{ facingMode: "environment" }}
        />
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={capturePhoto}
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white py-5 rounded-3xl text-xl font-semibold flex items-center justify-center gap-3 shadow-lg active:scale-95 transition disabled:opacity-70"
        >
          {loading ? "Analyzing Pest..." : <><Camera className="w-7 h-7" /> Identify Pest Now</>}
        </button>

        <button
          onClick={() => setLanguage(language === "en" ? "ha" : "en")}
          className="px-6 bg-gray-100 rounded-3xl text-sm font-medium"
        >
          {language === "en" ? "Hausa" : "English"}
        </button>
      </div>

      {error && (
        <div className="mt-6 p-5 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex gap-3">
          <AlertCircle className="w-6 h-6 mt-1" />
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-8 bg-white rounded-3xl p-6 shadow-xl whitespace-pre-wrap leading-relaxed text-gray-800">
          {result.reply}
        </div>
      )}
    </div>
  );
};

export default PestScanner;