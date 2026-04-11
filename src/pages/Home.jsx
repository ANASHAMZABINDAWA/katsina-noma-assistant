import { Link } from 'react-router-dom';
import { Camera, MessageCircle, BookOpen, Leaf, MapPin, Sun, Tractor } from 'lucide-react';

const Home = () => {
  const quickActions = [
    { 
      title: "Scan Plant", 
      icon: Camera, 
      path: "/scanner", 
      color: "bg-gradient-to-br from-emerald-600 to-teal-700",
      desc: "Identify crops & leaves instantly"
    },
    { 
      title: "Ask Assistant", 
      icon: MessageCircle, 
      path: "/assistant", 
      color: "bg-gradient-to-br from-amber-600 to-orange-700",
      desc: "Get advice in English or Hausa"
    },
    { 
      title: "Scan Pest", 
      icon: Camera, 
      path: "/pests", 
      color: "bg-gradient-to-br from-emerald-600 to-green-700",
      desc: "Identify pests on crops & leaves instantly"
    },
    { 
      title: "Browse Crops", 
      icon: BookOpen, 
      path: "/crops", 
      color: "bg-gradient-to-br from-green-700 to-emerald-800",
      desc: "Learn about major Katsina crops"
    },
  ];

  const katsinaFacts = [
    "Katsina is one of Nigeria's top producers of millet (gero) and sorghum (dawa).",
    "Rainy season: June - September. Best time to plant is early June.",
    "Major crops: Millet (Gero), Sorghum (Dawa), Groundnut (Gyada), Cowpea (Wake), Cotton & Maize.",
    "Common challenges: Fall Armyworm, Striga (witchweed), Drought & Quelea birds.",
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 bg-[#f8f5f0] min-h-screen"> {/* Warm natural background */}

      {/* Hero Section - More Farming Feel */}
      <div className="relative h-80 rounded-3xl overflow-hidden mb-10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70 z-10" />
        <img 
          src="https://picsum.photos/id/1015/800/600" 
          alt="Katsina Farmland" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <Leaf className="w-12 h-12 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Katsina Noma</h1>
              <p className="text-xl text-emerald-100 -mt-1">Assistant</p>
            </div>
          </div>
          <p className="text-lg opacity-90 max-w-xs">
            Your trusted farming companion in Katsina State
          </p>
          <div className="flex items-center gap-2 mt-6 text-sm">
            <MapPin className="w-5 h-5" /> 
            Katsina State, Nigeria
          </div>
        </div>
      </div>

      {/* Quick Actions - Bigger & Warmer */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-emerald-800 mb-6 px-2 flex items-center gap-2">
          <Tractor className="w-6 h-6" />
          What do you want to do today?
        </h2>
        
        <div className="grid grid-cols-1 gap-5 px-2">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className={`${action.color} text-white rounded-3xl p-7 flex items-center gap-6 active:scale-[0.97] transition-all shadow-xl hover:shadow-2xl`}
            >
              <div className="bg-white/20 p-5 rounded-2xl backdrop-blur-sm">
                <action.icon className="w-11 h-11" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-semibold mb-1">{action.title}</p>
                <p className="opacity-90 text-sm">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Katsina Farming Facts */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-2xl font-semibold text-emerald-800">Katsina Farming Info</h2>
          <Sun className="w-7 h-7 text-amber-500" />
        </div>
        
        <div className="space-y-5">
          {katsinaFacts.map((fact, index) => (
            <div 
              key={index} 
              className="bg-white rounded-3xl p-7 shadow border-l-4 border-emerald-600 leading-relaxed text-gray-700"
            >
              {fact}
            </div>
          ))}
        </div>
      </div>

      {/* Farmer Tip of the Day - More Vibrant */}
      <div className="bg-gradient-to-br from-emerald-700 via-green-700 to-teal-700 text-white rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-white/20 p-3 rounded-2xl">
            <Leaf className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold">Farmer Tip of the Day</h3>
        </div>
        
        <p className="text-lg leading-relaxed">
          Plant your millet (gero) and sorghum (dawa) early in June to avoid late-season drought. 
          Use certified seeds and apply plenty of organic manure for a better harvest.
        </p>
        
        <div className="mt-8 text-sm opacity-90 flex items-center gap-2">
          — Katsina State Agricultural Extension Service
        </div>
      </div>

      <div className="h-28" /> {/* Spacer for bottom navigation */}
    </div>
  );
};

export default Home;