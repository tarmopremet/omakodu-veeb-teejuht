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
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <img src="/lovable-uploads/1df18946-6bda-4219-b803-f1f4a7719f3e.png" alt="RendiIse" className="h-8" />
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