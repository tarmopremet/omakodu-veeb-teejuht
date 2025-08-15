import { Button } from "@/components/ui/button";
import { Search, Sparkles, Shield, Clock } from "lucide-react";
import heroImage from "@/assets/cleaning-equipment-hero.jpg";

export const CleaningHeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Professional cleaning equipment"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-80"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Professionaalsed
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-white">
              puhastusseadmed rendiks
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-green-100 leading-relaxed">
            Lae alla tänapäevased puhastusseadmed soodsa hinnaga
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary-hover shadow-large transition-all duration-300 hover:scale-105">
              <Search className="w-5 h-5 mr-2" />
              Vaata seadmeid
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
            >
              Kuidas rendida?
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-8 h-8 text-green-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Professionaalne</h3>
              <p className="text-green-100">Tipptasemel seadmed igasugusteks puhastusteenusteks</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Shield className="w-8 h-8 text-green-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kindlustatud</h3>
              <p className="text-green-100">Kõik seadmed on kindlustatud ja hooldatud</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Clock className="w-8 h-8 text-green-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kiire</h3>
              <p className="text-green-100">Same päeva kohaletoimetamine Tallinnas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};