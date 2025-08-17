import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { RendiIseHeader } from "@/components/RendiIseHeader";
import { MapPin, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AurupesuriRent = () => {
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
        .eq('page_name', 'aurupesurid')
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
          <span className="text-gray-600">Aurupesuri rent</span>
        </nav>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-6">
            Aurupesuri rent
          </h1>

          <div className="bg-primary/10 p-6 rounded-lg mb-8">
            <p className="text-xl font-medium text-gray-800 mb-4">
              Hind: 3,5 EUR/1h ja 18,99 EUR/24h
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
              Miks aurupesuri rent?
            </h2>
            
            <div className="space-y-4 text-gray-600">
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Aurupesur on kallis seade - mõneks korraks aastas pole vaja kulutada nii palju ja aurupesuri rent on oluliselt odavam.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Auru abil saad puhastada ilma keemiliste vahenditeta - ökoloogiline ja tervislik valik.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Hävitab baktereid ja viirusi - ideaalne allergilistele ja väikelastega peredele.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Sobib vannitoa, köögi, põrandate ja pindade põhjalikuks puhastamiseks.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Eemaldab rasked plekid ja mustuse, mis tavapärase pesemisega ei kaduks.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Kuiv aur ei jäta pindu märjaks ning puhastab ka raskesti ligipääsetavad kohad.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Säästab ruumi - ei pea ostma ja hoiustama suurt seadet.</p>
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
                        alt={image.alt_text || "Aurupesuri rent"} 
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
              <p>• Kõrge temperatuuriga aur (üle 100°C) hävitab kõik bakterid ja viirused.</p>
              <p>• Ei vaja keemilisi puhastusvahendeid - säästab keskkonda ja rahakotti.</p>
              <p>• Sobib kõigile pindadele - põrandad, seinad, sanitaarseadmed, ahjud.</p>
              <p>• Kiire ja efektiivne - säästab aega võrreldes tavalise puhastamisega.</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AurupesuriRent;