import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, ShoppingCart, User, Globe, LogIn, LogOut } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { useAuth } from "@/contexts/AuthContext";

export const RendiIseHeader = () => {
  const [showContactForm, setShowContactForm] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  
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
              <Link to="/auth" className="flex items-center gap-1 hover:underline bg-white/20 px-3 py-1 rounded-full">
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
            <Link to="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
              <span className="text-gray-800">Rendi</span>
              <span className="text-primary">Ise</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium">
              Avaleht
            </Link>
            <div className="relative group">
              <span className="text-gray-700 hover:text-primary font-medium cursor-pointer">
                Renditooted
              </span>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-lg rounded-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4 space-y-3">
                  <Link to="/et/rendi/tekstiilipesur-asukohaga-kristiine-keskus" className="block hover:text-primary">
                    <div className="font-medium">Tekstiilipesur</div>
                    <div className="text-sm text-gray-500">Diivani, madratsi ja vaiba puhastus</div>
                  </Link>
                  <Link to="/et/rendi/aurupesur-asukohaga-kristiine-keskus" className="block hover:text-primary">
                    <div className="font-medium">Aurupesur</div>
                    <div className="text-sm text-gray-500">Vannitoa ja köögi puhastus</div>
                  </Link>
                  <Link to="/et/rendi/aknapesuribot-asukohaga-kristiine-keskus" className="block hover:text-primary">
                    <div className="font-medium">Aknapesuribot</div>
                    <div className="text-sm text-gray-500">Automaatne akende pesu</div>
                  </Link>
                  <Link to="/et/rendi/aknapesur-asukohaga-kristiine-keskus" className="block hover:text-primary">
                    <div className="font-medium">Aknapesur</div>
                    <div className="text-sm text-gray-500">Käsitsi akende puhastus</div>
                  </Link>
                </div>
              </div>
            </div>
            <a href="#" className="text-gray-700 hover:text-primary font-medium">
              Müügitooted
            </a>
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