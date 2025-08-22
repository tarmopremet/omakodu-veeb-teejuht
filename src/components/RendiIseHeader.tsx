import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, ShoppingCart, User, Globe, LogIn, LogOut, MapPin, ChevronDown } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { useAuth } from "@/contexts/AuthContext";

export const RendiIseHeader = () => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();

  const allCities = [
    { name: "Tallinn", href: "/tallinn" },
    { name: "Tartu", href: "/tartu" },
    { name: "Pärnu", href: "/parnu" },
    { name: "Rakvere", href: "/rakvere" },
    { name: "Saku", href: "/saku" }
  ];

  // Get current city from URL
  const getCurrentCity = () => {
    const path = location.pathname;
    return allCities.find(city => path.includes(city.href.slice(1)));
  };

  const currentCity = getCurrentCity();
  
  // Show only current city if on a city-specific page, otherwise show all cities
  const citiesToShow = currentCity ? [currentCity] : allCities;
  
  return (
    <>
      <ContactForm 
        isOpen={showContactForm} 
        onClose={() => setShowContactForm(false)} 
      />
    <header className="bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-gradient-primary text-white py-2">
        <div className="container mx-auto px-4 flex justify-end items-center text-sm">
          <div className="flex items-center gap-4">
            <span>ET</span>
            {user ? (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{user.email}</span>
                {isAdmin && (
                  <Link to="/admin" className="hover:underline">
                    Admin
                  </Link>
                )}
                <button onClick={signOut} className="hover:underline">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="flex items-center gap-1 hover:underline bg-white/30 hover:bg-white/40 px-4 py-2 rounded-full border border-white/40 backdrop-blur-sm transition-all duration-200">
                <LogIn className="w-4 h-4" />
                <span className="font-semibold">Logi sisse</span>
              </Link>
            )}
            <div className="flex items-center">
              <ShoppingCart className="w-4 h-4 mr-1" />
              <span className="bg-white text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                0
              </span>
            </div>
            <div className="flex items-center bg-white/20 px-3 py-1 rounded-full">
              <Phone className="w-4 h-4 mr-2" />
              <span className="font-semibold">Helista +3725027355</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <img src="/lovable-uploads/1df18946-6bda-4219-b803-f1f4a7719f3e.png" alt="RendiIse" className="h-16" />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium">
              Avaleht
            </Link>
            <div className="relative group">
              <Link to="/renditooted" className="text-gray-700 hover:text-primary font-medium">
                Renditooted
              </Link>
            </div>
            <Link to="/myygitooted" className="text-gray-700 hover:text-primary font-medium">
              Müügitooted
            </Link>
            <div className="relative">
              <button 
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="text-gray-700 hover:text-primary font-medium flex items-center gap-1"
              >
                <MapPin className="w-4 h-4" />
                Asukohad
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showLocationDropdown && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]">
                  {citiesToShow.map((city) => (
                    <Link
                      key={city.name}
                      to={city.href}
                      onClick={() => setShowLocationDropdown(false)}
                      className="block w-full px-4 py-3 text-sm text-gray-700 hover:bg-primary hover:text-primary-foreground transition-all duration-200 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {city.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <button 
              onClick={() => setShowContactForm(true)}
              className="text-gray-700 hover:text-primary font-medium"
            >
              Kontakt
            </button>
          </nav>
        </div>
      </div>
    </header>
    </>
  );
};