import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { RendiIseHeader } from "@/components/RendiIseHeader";
import { MapPin, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AknapesuriRent = () => {
  const [images, setImages] = useState<Array<{id: string; image_url: string; alt_text?: string}>>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const cities = [
    { name: "Tallinn", href: "/tallinn" },
    { name: "Tartu", href: "/tartu" },
    { name: "Pärnu", href: "/parnu" },
    { name: "Rakvere", href: "/rakvere" },
    { name: "Saku", href: "/saku" }
  ];

  const handleCityClick = (city: typeof cities[0]) => {
    navigate(city.href);
    setShowDropdown(false);
  };

  useEffect(() => {
    const fetchImages = async () => {
      const { data } = await supabase
        .from('page_images')
        .select('id, image_url, alt_text')
        .eq('page_name', 'aknapesur')
        .eq('is_active', true)
        .order('display_order');
      
      if (data) setImages(data);
    };
    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <RendiIseHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link to="/" className="text-primary hover:underline">Avaleht</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">Aknapesuri rent</span>
        </nav>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-6">
            Aknapesuri rent
          </h1>

          <div className="bg-primary/10 p-6 rounded-lg mb-8">
            <p className="text-xl font-medium text-gray-800 mb-4">
              Hind: 2,5 EUR/1h ja 14,99 EUR/24h
            </p>
            <div className="relative inline-block">
              <Button 
                className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-3 rounded-full flex items-center gap-2"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <MapPin className="w-4 h-4" />
                Broneeri kohe
                <ChevronDown className="w-4 h-4" />
              </Button>
              
              {showDropdown && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]">
                  {cities.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => handleCityClick(city)}
                      className="block w-full px-4 py-3 text-sm text-gray-700 hover:bg-primary hover:text-primary-foreground transition-all duration-200 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* City Links */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {cities.map((city) => (
              <Link
                key={city.name}
                to={city.href}
                className="block p-4 text-center bg-gray-50 hover:bg-primary hover:text-primary-foreground rounded-lg transition-all duration-200"
              >
                {city.name}
              </Link>
            ))}
          </div>

          {/* Why Rent Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-light text-gray-800 mb-6">
              Miks aknapesuri rent?
            </h2>
            
            <div className="space-y-4 text-gray-600">
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Aknapesur on spetsiaalne seade, mida vajatakse mõned korrad aastas - rent on odavam kui ostmine.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Professionaalne tulemus - jätab aknad triibuvabaks ja läbipaistvaks.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Kiire ja efektiivne - säästab aega võrreldes käsitsi pesemisega.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Sobib kõigile aknasuurustele ja ka peeglitele ning klaaspindadele.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Ei vaja erikoolitust - lihtne kasutada ka algajatele.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Kaasas kõik vajalikud tarvikud ja puhastusvahend.</p>
              </div>
            </div>
          </section>

          {/* Product Images */}
          {images.length > 0 && (
            <section className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {images.map((image) => (
                  <Card key={image.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <img 
                        src={image.image_url} 
                        alt={image.alt_text || "Aknapesuri rent"} 
                        className="w-full h-64 object-cover"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Additional Info */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-medium text-gray-800 mb-4">
              Kasulik teada
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>• Sobib nii sise- kui väljaküljele - universaalne lahendus.</p>
              <p>• Hea haare tagab ühtlase puhastamise kogu akna pinnal.</p>
              <p>• Vee-tolmu imemisfunktsioon hoiab ümbruse puhtana.</p>
              <p>• Ergonoomne käepide vähendab käte väsimust pikema kasutamise korral.</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AknapesuriRent;