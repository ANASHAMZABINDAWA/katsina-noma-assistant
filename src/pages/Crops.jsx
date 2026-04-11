import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { Leaf, Droplet, Calendar, AlertTriangle, Tractor } from 'lucide-react';

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cropsRef = ref(db, 'crops');

    const unsubscribe = onValue(cropsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to array and sort alphabetically
        const cropsArray = Object.values(data).sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        setCrops(cropsArray);
      }
      setLoading(false);
    });

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-6 text-gray-600">Loading crops data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 bg-[#f8f5f0] min-h-screen">
      
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-emerald-100 p-4 rounded-2xl">
            <Tractor className="w-10 h-10 text-emerald-700" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-emerald-800">Major Crops</h1>
            <p className="text-emerald-700 text-lg">in Katsina State</p>
          </div>
        </div>
        <p className="text-gray-600">
          Discover the most important food and cash crops grown by farmers across Katsina State.
        </p>
      </div>

      <div className="space-y-8">
        {crops.map((crop, index) => (
          <div 
            key={index} 
            className="bg-white rounded-3xl overflow-hidden shadow-xl border border-emerald-100"
          >
            <div className="h-3 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600" />

            <div className="p-7">
              <div className="flex items-start gap-5">
                <div className="p-5 rounded-2xl bg-emerald-50 flex-shrink-0 text-5xl">
                  {crop.emoji || "🌱"}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-emerald-800">{crop.name}</h3>
                  <p className="text-gray-500 italic mt-1">{crop.scientific}</p>
                </div>
              </div>

              {/* Season & Soil */}
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="bg-gray-50 p-5 rounded-2xl">
                  <div className="flex items-center gap-3 text-emerald-700 mb-2">
                    <Calendar className="w-5 h-5" />
                    <span className="font-semibold">Season</span>
                  </div>
                  <p className="font-medium text-gray-700">{crop.season}</p>
                </div>

                <div className="bg-gray-50 p-5 rounded-2xl">
                  <div className="flex items-center gap-3 text-emerald-700 mb-2">
                    <Droplet className="w-5 h-5" />
                    <span className="font-semibold">Soil</span>
                  </div>
                  <p className="font-medium text-gray-700">{crop.soil}</p>
                </div>
              </div>

              {/* Tips */}
              <div className="mt-8">
                <p className="font-semibold text-emerald-700 mb-3 flex items-center gap-2">
                  <Leaf className="w-5 h-5" /> Farmer Tips
                </p>
                <p className="text-gray-700 leading-relaxed">{crop.tips}</p>
              </div>

              {/* Challenges */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 text-red-600 mb-3">
                  <AlertTriangle className="w-6 h-6" />
                  <span className="font-semibold text-lg">Common Challenges</span>
                </div>
                <p className="text-gray-700 bg-red-50 p-5 rounded-2xl">
                  {crop.pests}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center text-sm text-gray-500 pb-12">
        Data fetched from Firebase • Maintained by Katsina State Agricultural Development Project (KTARDA)
      </div>

      <div className="h-24" />
    </div>
  );
};

export default Crops;