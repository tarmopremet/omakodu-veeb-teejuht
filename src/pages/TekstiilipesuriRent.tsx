import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { RendiIseHeader } from "@/components/RendiIseHeader";
import { MapPin, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PageImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
}

const TekstiilipesuriRent = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [pageImages, setPageImages] = useState<PageImage[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadPageImages();
  }, []);

  const loadPageImages = async () => {
    try {
      const { data, error } = await supabase
        .from('page_images')
        .select('*')
        .eq('page_name', 'tekstiilipesuri')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setPageImages(data || []);
    } catch (error) {
      console.error('Error loading page images:', error);
      // Fallback to empty array if there's an error
      setPageImages([]);
    }
  };

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

  return (
    <div className="min-h-screen bg-white">
      <RendiIseHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link to="/" className="text-primary hover:underline">Avaleht</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">Tekstiilipesuri rent</span>
        </nav>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-6">
            Tekstiilipesuri rent
          </h1>

          <div className="bg-primary/10 p-6 rounded-lg mb-8">
            <p className="text-xl font-medium text-gray-800 mb-4">
              Hind: 4,5 EUR/1h ja 20,99 EUR/24h
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
              Miks tekstiilipesuri rent?
            </h2>
            
            <div className="space-y-4 text-gray-600">
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Tekstiilipesur on kallis – mõneks korraks aastas pole vaja kulutada nii palju ja tekstiilipesuri rent on oluliselt odavam.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Tekstiilipesur võtab ruumi – peale mõnda korda kasutamist tuleb see kuhugile panna silma-alt ära. Rentides tekstiilipesurit ei pea aga selle peale mõtlema.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Kärcheri tekstiilipesur sobib hästi ka allergikutele ja koduloomaomanikele.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Tekstiilipesuriga saad oma diivani, vaiba, madratsi või mõne muu tekstiiltoote taas puhtaks ja ei pea mõtlema uue ostmisele.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Tekstiilipesur puhastab põhjalikult ning kodu saab värskem!</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Pesuriga kaasa antavad puhastusvahendid on Kärcheri enda poolt välja töötatud ja puhastavad tekstiili kiirelt ja efektiivselt.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Auto salongi puhastus on kallis. Rentides tekstiilipesuri saad teha sama töö aga odavamalt.</p>
              </div>
            </div>
          </section>

          {/* Product Images */}
          <section className="mb-8">
            {pageImages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pageImages.map((image) => (
                  <Card key={image.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <img 
                        src={image.image_url} 
                        alt={image.alt_text || "Tekstiilipesuri rent"} 
                        className="w-full h-64 object-cover"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Pilte ei leitud. Admin saab lisada pilte lehekülgede halduse kaudu.</p>
              </div>
            )}
          </section>

          {/* Additional Info */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-medium text-gray-800 mb-4">
              Kasulik teada
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>• Diivan kuivab ära kiirelt ja juba varsti saate seda taas kasutada.</p>
              <p>• Jätab võrreldes konkurentidega pinnad tunduvalt kuivemaks, võimaldades tekstiili kiiremini taas kasutusse võtta.</p>
              <p>• Ise puhastada on lihtne ja ei võta kaua aega.</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TekstiilipesuriRent;