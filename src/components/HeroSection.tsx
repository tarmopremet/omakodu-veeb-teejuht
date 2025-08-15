import { Button } from "@/components/ui/button";
import { Search, TrendingUp, Shield, Users } from "lucide-react";
import heroImage from "@/assets/hero-apartment.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Modern apartment building"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-80"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Leia oma
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white">
              unistuste kodu
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
            Turvaline ja usaldusväärne üüriplatvorm üle kogu Eesti
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary-hover shadow-large transition-all duration-300 hover:scale-105">
              <Search className="w-5 h-5 mr-2" />
              Alusta otsingut
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
            >
              Vaata pakkumisi
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Shield className="w-8 h-8 text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Turvaline</h3>
              <p className="text-blue-100">Kõik kinnisvara objektid on kontrollitud ja kinnitatud</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <TrendingUp className="w-8 h-8 text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Parimad hinnad</h3>
              <p className="text-blue-100">Konkurentsivõimelised üürihinnad üle kogu Eesti</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Users className="w-8 h-8 text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Usaldusväärne</h3>
              <p className="text-blue-100">Tuhandete rahulolevamate klientide valik</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};