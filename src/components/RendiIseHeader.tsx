import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, ShoppingCart, User, Globe } from "lucide-react";

export const RendiIseHeader = () => {
  return (
    <header className="bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-gradient-primary text-white py-2">
        <div className="container mx-auto px-4 flex justify-end items-center text-sm">
          <div className="flex items-center gap-4">
            <span>ET</span>
            <User className="w-4 h-4" />
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
            <div className="text-2xl font-bold">
              <span className="text-gray-800">Rendi</span>
              <span className="text-primary">Ise</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-primary font-medium">
              Avaleht
            </a>
            <a href="#" className="text-gray-700 hover:text-primary font-medium">
              Renditooted
            </a>
            <a href="#" className="text-gray-700 hover:text-primary font-medium">
              Müügitoroted
            </a>
            <a href="#" className="text-gray-700 hover:text-primary font-medium">
              Püsihlendile
            </a>
            <a href="#" className="text-gray-700 hover:text-primary font-medium">
              Kontakt
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};