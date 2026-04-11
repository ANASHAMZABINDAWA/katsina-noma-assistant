import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Camera, Upload, Leaf } from 'lucide-react';
import { ref, push } from 'firebase/database';
import { db } from '../firebase';

const Scanner = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const webcamRef = useRef(null);

  const PLANTNET_API_KEY = "2b10uFqtj910B46oKTlZKOtXe"; // Get free at https://my.plantnet.org/

  const capturePhoto = async () => {
    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) return;

    setImage(screenshot);
    setLoading(true);

    try {
      // 1. Upload to Cloudinary (optional but recommended)
      const formData = new FormData();
      formData.append("file", screenshot);
      formData.append("upload_preset", "katsina_noma"); // Create this preset in Cloudinary

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`,
        { method: "POST", body: formData }
      );
      const cloudData = await cloudRes.json();
      const imageUrl = cloudData.secure_url;

      // 2. Identify with PlantNet (best free & accurate for leaves in 2026)
      const form = new FormData();
      form.append("images", screenshot.split(',')[1]); // base64 without prefix
      form.append("organs", "leaf");

      const plantRes = await fetch(
        `https://my-api.plantnet.org/v2/identify/all?api-key=${PLANTNET_API_KEY}`,
        { method: "POST", body: form }
      );

      const plantData = await plantRes.json();

      const bestMatch = plantData.results?.[0];

      setResult({
        commonName: bestMatch?.species?.commonNames?.[0] || "Unknown Plant",
        scientificName: bestMatch?.species?.scientificName,
        confidence: (bestMatch?.score * 100).toFixed(1),
        imageUrl,
      });

      // Save scan history to Firebase
      push(ref(db, 'scans/'), {
        imageUrl,
        plant: bestMatch?.species?.scientificName,
        confidence: bestMatch?.score,
        timestamp: Date.now(),
        location: "Katsina State",
      });

    } catch (error) {
      console.error(error);
      alert("Identification failed. Please check your API key or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 pt-6">
      <div className="text-center mb-8">
        <Leaf className="w-16 h-16 text-primary mx-auto mb-3" />
        <h2 className="text-3xl font-bold text-primary">Plant Scanner</h2>
        <p className="text-gray-600 mt-2">Scan any leaf or plant — get instant identification + farming tips</p>
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
        className="mt-8 w-full bg-primary hover:bg-green-800 text-white py-5 rounded-2xl text-xl font-semibold flex items-center justify-center gap-3 shadow-lg active:scale-95 transition"
      >
        {loading ? "Identifying..." : <><Camera className="w-7 h-7" /> Scan Leaf Now</>}
      </button>

      {image && (
        <div className="mt-10">
          <h3 className="font-semibold text-lg mb-3">Your Scan</h3>
          <img src={image} alt="scanned" className="w-full rounded-2xl shadow" />
        </div>
      )}

      {result && (
        <div className="mt-8 bg-white rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="w-10 h-10 text-accent" />
            <div>
              <h3 className="text-2xl font-bold text-primary">{result.commonName}</h3>
              <p className="text-sm text-gray-500 italic">{result.scientificName}</p>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-2xl">
            <p className="font-semibold">Confidence: <span className="text-accent">{result.confidence}%</span></p>
          </div>
          <div className="mt-6 text-sm text-gray-700">
            <p>Common in Katsina: Millet, Sorghum, Groundnut areas. Check soil moisture and watch for armyworm.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scanner;