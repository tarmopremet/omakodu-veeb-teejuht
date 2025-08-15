import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ChevronDown } from "lucide-react";
import { Footer } from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const navigate = useNavigate();

  const cities = [
    { name: "Tallinn", href: "/tallinn" },
    { name: "Tartu", href: "https://tartu.rendiise.ee/" },
    { name: "Pärnu", href: "https://parnu.rendiise.ee/" },
    { name: "Rakvere", href: "https://rakvere.rendiise.ee/" },
    { name: "Saku", href: "https://saku.rendiise.ee/" }
  ];

  const handleCityClick = (city: typeof cities[0]) => {
    if (city.name === "Tallinn") {
      navigate("/tallinn");
    } else {
      window.open(city.href, "_blank");
    }
    setShowDropdown1(false);
    setShowDropdown2(false);
  };

  const DropdownButton = ({ 
    showDropdown, 
    setShowDropdown, 
    dropdownId 
  }: { 
    showDropdown: boolean; 
    setShowDropdown: (show: boolean) => void;
    dropdownId: string;
  }) => (
    <div className="relative inline-block">
      <Button
        onClick={() => setShowDropdown(!showDropdown)}
        className="bg-[#ea580c] hover:bg-white hover:text-[#ea580c] hover:border-[#ea580c] border-2 border-[#ea580c] text-white px-5 py-3 rounded-full font-medium flex items-center gap-2 transition-all duration-300"
      >
        <MapPin className="w-4 h-4" />
        Broneerima
        <ChevronDown className="w-4 h-4" />
      </Button>
      
      {showDropdown && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]">
          {cities.map((city) => (
            <button
              key={city.name}
              onClick={() => handleCityClick(city)}
              className="block w-full px-4 py-3 text-sm text-gray-700 hover:bg-[#ea580c] hover:text-white transition-all duration-200 first:rounded-t-lg last:rounded-b-lg"
            >
              {city.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#ea580c]">Rendiise</h1>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-[#ea580c]">Avaleht</a>
              <a href="#" className="text-gray-600 hover:text-[#ea580c]">Teenused</a>
              <a href="#" className="text-gray-600 hover:text-[#ea580c]">Kontakt</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 order-2 md:order-1">
            <div className="w-full max-w-sm mx-auto">
              <img
                src="/src/assets/cleaning-equipment-hero.jpg"
                alt="Puhastusseadmed"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
          
          <div className="md:col-span-7 order-1 md:order-2">
            <h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-6">
              Puhastusseadmete nutirent Eestis
            </h1>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center">
                <span className="text-[#ea580c] font-bold mr-2">•</span>
                <a href="#" className="text-gray-700 hover:text-[#ea580c] transition-colors">
                  tekstiilipesuri rent
                </a>
              </div>
              <div className="flex items-center">
                <span className="text-[#ea580c] font-bold mr-2">•</span>
                <a href="#" className="text-gray-700 hover:text-[#ea580c] transition-colors">
                  aurupesuri rent
                </a>
              </div>
              <div className="flex items-center">
                <span className="text-[#ea580c] font-bold mr-2">•</span>
                <a href="#" className="text-gray-700 hover:text-[#ea580c] transition-colors">
                  aknapesuroboti rent
                </a>
              </div>
              <div className="flex items-center">
                <span className="text-[#ea580c] font-bold mr-2">•</span>
                <a href="#" className="text-gray-700 hover:text-[#ea580c] transition-colors">
                  tolmuimeja rent
                </a>
              </div>
              <div className="flex items-center">
                <span className="text-[#ea580c] font-bold mr-2">•</span>
                <a href="#" className="text-gray-700 hover:text-[#ea580c] transition-colors">
                  aknapesuri rent
                </a>
              </div>
            </div>

            <DropdownButton 
              showDropdown={showDropdown1} 
              setShowDropdown={setShowDropdown1}
              dropdownId="dropdown1"
            />
          </div>
        </div>
      </section>

      {/* Feature Strip */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="text-center p-6 shadow-sm">
            <CardContent className="p-0">
              <div className="text-4xl mb-4">🛋️</div>
              <h4 className="font-medium text-gray-800 mb-2">Süvapuhastus ilma vaevata</h4>
              <p className="text-sm text-gray-600">
                Diivanid, madratsid, vaibad ja auto saavad tõeliselt puhtaks.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 shadow-sm">
            <CardContent className="p-0">
              <div className="text-4xl mb-4">💰</div>
              <h4 className="font-medium text-gray-800 mb-2">Odavam kui koristaja või uus diivan</h4>
              <p className="text-sm text-gray-600">
                Professionaalne tulemus taskukohase hinnaga.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 shadow-sm">
            <CardContent className="p-0">
              <div className="text-4xl mb-4">📦</div>
              <h4 className="font-medium text-gray-800 mb-2">Nutikapid üle Eesti</h4>
              <p className="text-sm text-gray-600">
                <a href="/tallinn" className="text-[#ea580c] hover:underline">Tallinn</a>,{" "}
                <a href="https://tartu.rendiise.ee" className="text-[#ea580c] hover:underline">Tartu</a>,{" "}
                <a href="https://parnu.rendiise.ee" className="text-[#ea580c] hover:underline">Pärnu</a>,{" "}
                <a href="https://rakvere.rendiise.ee" className="text-[#ea580c] hover:underline">Rakvere</a>,{" "}
                <a href="https://saku.rendiise.ee" className="text-[#ea580c] hover:underline">Saku</a>.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Video Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <div className="relative pb-[56.25%] h-0 rounded-lg overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/4Fb3fDTeDWg"
                className="absolute top-0 left-0 w-full h-full"
                allowFullScreen
                title="Rendiise video"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Rendiise */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">
            Miks valida Rendiise?
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6 shadow-sm">
            <CardContent className="p-0">
              <div className="text-4xl mb-4">🕐</div>
              <h4 className="font-medium text-gray-800 mb-2">24/7 avatud paljudes kohtades</h4>
              <p className="text-sm text-gray-600">
                Rendi seadmed, siis kui Sul vaja on, isegi pühade ajal.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 shadow-sm">
            <CardContent className="p-0">
              <div className="text-4xl mb-4">🛡️</div>
              <h4 className="font-medium text-gray-800 mb-2">Garanteeritud kvaliteet</h4>
              <p className="text-sm text-gray-600">
                Kõik seadmed on professionaalsed ja regulaarselt hooldatud.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 shadow-sm">
            <CardContent className="p-0">
              <div className="text-4xl mb-4">🏆</div>
              <h4 className="font-medium text-gray-800 mb-2">Eesti esimene puhastusseadmete nutirent</h4>
              <p className="text-sm text-gray-600">
                Tekstiilipesurid, aurupesurid, tolmuimejad, aknapesurobotid, aknapesurid.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-800">Klientide tagasiside</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <CardContent className="p-0">
                <p className="text-gray-600 mb-4">
                  "Suurepärane teenus! Tekstiilipesur tegi meie diivanist jälle nagu uue."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium">Maria K.</p>
                    <p className="text-sm text-gray-500">Tallinn</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-6">
              <CardContent className="p-0">
                <p className="text-gray-600 mb-4">
                  "Lihtne ja kiire. Soovitan kõigile!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium">Peeter L.</p>
                    <p className="text-sm text-gray-500">Tartu</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-6">
              <CardContent className="p-0">
                <p className="text-gray-600 mb-4">
                  "Professionaalne kvaliteet, soodne hind. Kindlasti kasutan uuesti."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium">Karin S.</p>
                    <p className="text-sm text-gray-500">Pärnu</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">
            Rendi kohe ja puhasta kodu soodsalt ja lihtsalt!
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Tekstiilipesuri rent, aurupesuri rent, aknapesuroboti rent, tolmuimeja rent
          </p>
          
          <DropdownButton 
            showDropdown={showDropdown2} 
            setShowDropdown={setShowDropdown2}
            dropdownId="dropdown2"
          />
        </div>
      </section>

      {/* Company Logos */}
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center max-w-md mx-auto">
            <div className="text-center">
              <a href="https://www.rendiise.ee" target="_blank" rel="noopener">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-gray-600">Rendiise.ee</p>
                </div>
              </a>
            </div>
            <div className="text-center">
              <a href="https://rentster.ee/" target="_blank" rel="noopener">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-gray-600">Rentster.ee</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Homepage;