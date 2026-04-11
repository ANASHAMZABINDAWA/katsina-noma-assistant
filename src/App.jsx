import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';

import Home from './pages/Home';
import Scanner from './pages/Scanner';
import Assistant from './pages/Assistant';
import Crops from './pages/Crops';
import PestScanner from './pages/PestScanner';
//import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div className="min-h-screen pb-20 md:pb-0 bg-sand">
        <Navbar />
        {/* Add padding-top to push content below the fixed navbar */}
        <main className="pt-24">   {/* ← Adjust this value if needed */}
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/crops" element={<Crops />} />
          <Route path="/pests" element={<PestScanner />} />
          {/* <Route path="/profile" element={<Profile />} /> */}
        </Routes>
        </main>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;