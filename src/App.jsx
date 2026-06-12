import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Tour from './pages/Tour';
import Gallery from './pages/Gallery';
import Band from './pages/Band';
import Shop from './pages/Shop';
import Admin from './pages/Admin';
import Footer from './components/Footer';
import { Home as HomeIcon, Calendar, ShoppingBag, User, Image as ImageIcon } from 'lucide-react';

// Componente per i tasti della Navbar per gestire il colore quando sei nella pagina
const NavItem = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
        isActive ? 'text-green-500 scale-110' : 'text-zinc-500 hover:text-zinc-300'
      }`}
    >
      <Icon size={24} fill={isActive ? "currentColor" : "none"} />
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white flex flex-col font-sans overflow-x-hidden">
        
        {/* AREA CONTENUTI PRINCIPALI */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tour" element={<Tour />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/band" element={<Band />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        {/* BOTTOM NAVIGATION BAR - Stile App Moderna */}
        <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-zinc-800 px-6 py-3 flex justify-between items-center z-50">
          <NavItem to="/" icon={HomeIcon} label="Home" />
          <NavItem to="/tour" icon={Calendar} label="Tour" />
          <NavItem to="/gallery" icon={ImageIcon} label="Gallery" />
          <NavItem to="/band" icon={User} label="Band" />
          <NavItem to="/shop" icon={ShoppingBag} label="Shop" />
        </nav>

        {/* FOOTER - Sempre in fondo */}
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;