import { NavLink } from 'react-router-dom';
import { Home, Camera, MessageCircle, BookOpen, User } from 'lucide-react';

const BottomNav = () => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50 shadow-2xl">
    <div className="flex justify-around py-3 max-w-md mx-auto">
      <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-gray-500'}`}>
        <Home className="w-6 h-6" />
        <span className="text-xs font-medium">Home</span>
      </NavLink>
      <NavLink to="/scanner" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-gray-500'}`}>
        <Camera className="w-6 h-6" />
        <span className="text-xs font-medium">Scan</span>
      </NavLink>
      <NavLink to="/assistant" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-gray-500'}`}>
        <MessageCircle className="w-6 h-6" />
        <span className="text-xs font-medium">Ask</span>
      </NavLink>
      <NavLink to="/crops" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-gray-500'}`}>
        <BookOpen className="w-6 h-6" />
        <span className="text-xs font-medium">Crops</span>
      </NavLink>
      <NavLink to="/pests" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-gray-500'}`}>
        <BookOpen className="w-6 h-6" />
        <span className="text-xs font-medium">Pests</span>
      </NavLink>
      {/* <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-gray-500'}`}>
        <User className="w-6 h-6" />
        <span className="text-xs font-medium">Me</span>
      </NavLink> */}
    </div>
  </div>
);

export default BottomNav;