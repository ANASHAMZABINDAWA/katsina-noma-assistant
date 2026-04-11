import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Camera, Leaf, AlertCircle } from 'lucide-react';
import { ref, push } from 'firebase/database';
import { db } from '../firebase';

const Scanner = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const webcamRef = useRef(null);

  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const PLANTNET_API_KEY = import.meta.env.VITE_PLANTNET_API_KEY;

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
    // Convert base64 screenshot to Blob (this is the key fix)
    const blob = await fetch(screenshot).then(res => res.blob());

    // 1. Upload to Cloudinary (optional but recommended)
    const formData = new FormData();
    formData.append("file", blob);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!cloudRes.ok) throw new Error("Cloudinary upload failed");

    const cloudData = await cloudRes.json();
    const imageUrl = cloudData.secure_url;

    // 2. Send to PlantNet using Blob (much more reliable)
    const plantForm = new FormData();
    plantForm.append("images", blob, "leaf.jpg");   // ← Important: add filename
    plantForm.append("organs", "leaf");

    const plantRes = await fetch(
      `https://my-api.plantnet.org/v2/identify/all?api-key=${PLANTNET_API_KEY}`,
      {
        method: "POST",
        body: plantForm,
      }
    );

    if (!plantRes.ok) {
      const errorText = await plantRes.text();
      throw new Error(`PlantNet Error ${plantRes.status}: ${errorText}`);
    }

    const plantData = await plantRes.json();
    const bestMatch = plantData.results?.[0];

    if (!bestMatch) throw new Error("No plant could be identified");

    const identificationResult = {
      commonName: bestMatch.species?.commonNames?.[0] || "Unknown Plant",
      scientificName: bestMatch.species?.scientificName || "N/A",
      confidence: (bestMatch.score * 100).toFixed(1),
      imageUrl,
    };

    setResult(identificationResult);

    // 3. Save to Firebase
    await push(ref(db, 'scans/'), {
      imageUrl,
      plant: bestMatch.species?.scientificName || "Unknown",
      commonName: identificationResult.commonName,
      confidence: bestMatch.score,
      timestamp: Date.now(),
      location: "Katsina State",
    });

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

      {result && (
        <div className="mt-8 bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-start gap-4">
            <div className="bg-emerald-100 p-4 rounded-2xl">
                <Leaf className="w-12 h-12 text-emerald-600" />
            </div>
            
            <div className="flex-1">
                <h3 className="text-3xl font-bold text-primary leading-tight">
                {result.commonName}
                </h3>
                <p className="text-gray-500 italic mt-1">
                {result.scientificName}
                </p>

                {/* Local Name (for Morning Glory) */}
                {result.commonName.toLowerCase().includes("morning") && (
                <p className="text-sm text-emerald-700 font-medium mt-2">
                    Local Name: <span className="font-semibold">Tantani / Yakuwa</span>
                </p>
                )}
            </div>
            </div>

            {/* Confidence Bar */}
            <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-600">Confidence</span>
                <span className={`font-bold ${
                parseFloat(result.confidence) >= 75 ? "text-emerald-600" :
                parseFloat(result.confidence) >= 60 ? "text-amber-600" : "text-red-600"
                }`}>
                {result.confidence}%
                </span>
            </div>
            
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                className={`h-full rounded-full transition-all ${
                    parseFloat(result.confidence) >= 75 ? "bg-emerald-600" :
                    parseFloat(result.confidence) >= 60 ? "bg-amber-500" : "bg-red-500"
                }`}
                style={{ width: `${result.confidence}%` }}
                />
            </div>
            </div>

            {/* Low Confidence Warning */}
            {parseFloat(result.confidence) < 65 && (
            <div className="mt-5 p-4 bg-amber-50 border border-amber-300 rounded-2xl text-sm">
                <p className="font-medium text-amber-700 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> Low Confidence
                </p>
                <p className="text-amber-700 mt-1">
                The identification might not be very accurate. Try taking a clearer photo with better lighting and a plain background.
                </p>
            </div>
            )}

            {/* Farming Advice for Morning Glory */}
            {result.commonName.toLowerCase().includes("morning") && (
            <div className="mt-6 p-5 bg-red-50 border border-red-200 rounded-2xl">
                <p className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                ⚠️ Important for Farmers
                </p>
                <p className="text-red-700 leading-relaxed text-[15px]">
                Morning Glory (<span className="font-medium">Tantani</span>) is a common **climbing weed** in Katsina. 
                It spreads quickly and can choke millet, sorghum, maize and groundnut.
                </p>
                <p className="text-red-700 mt-3 text-[15px]">
                <strong>Recommendation:</strong> Remove it early by hand or use appropriate weedicides before it flowers and spreads seeds.
                </p>
            </div>
            )}

            {/* General Note */}
            <div className="mt-6 text-xs text-gray-500 text-center">
            Identified using PlantNet • Always double-check with local extension officers
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