import { Leaf, MapPin, Home, BookOpen, Phone, MessageCircle, Camera } from 'lucide-react';

const Navbar = () => (
  <nav className="bg-gradient-to-r from-emerald-800 to-green-800 text-white py-5 px-6 shadow-lg 
                   fixed top-0 left-0 right-0 z-50">
    
    <div className="max-w-6xl mx-auto flex items-center justify-between">
      
      {/* Logo & Brand */}
      <div className="flex items-center gap-4">
        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
          <Leaf className="w-9 h-9 text-emerald-200" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Katsina Noma</h1>
          <p className="text-sm text-emerald-100 -mt-1 font-medium">Assistant</p>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium">
        <a href="/" className="hover:text-emerald-200 transition-colors flex items-center gap-1.5">
          <Home className="w-4 h-4" />
          Home
        </a>
        <a href="/assistant" className="hover:text-emerald-200 transition-colors flex items-center gap-1.5">
          <MessageCircle className="w-4 h-4" />
          Assistant
        </a>
        <a href="/scanner" className="hover:text-emerald-200 transition-colors flex items-center gap-1.5">
          <Camera className="w-4 h-4" />
           Plant Scanner
        </a>
        <a href="/pests" className="hover:text-emerald-200 transition-colors flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" />
          Pest Scanner
        </a>
        <a href="/crops" className="hover:text-emerald-200 transition-colors flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" />
          Crops
        </a>
      </div>

      {/* Right Side - Location Info */}
      <div className="hidden md:flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2 opacity-90">
          <MapPin className="w-4 h-4" />
          Katsina State, Nigeria
        </div>
        <div className="text-emerald-100 font-medium">
          🌾 For Farmers of Katsina State
        </div>
      </div>

      {/* Mobile Right Side (simplified) */}
      <div className="md:hidden flex items-center gap-2 text-xs opacity-90">
        <MapPin className="w-4 h-4" />
        Katsina
      </div>

    </div>
  </nav>
);

export default Navbar;