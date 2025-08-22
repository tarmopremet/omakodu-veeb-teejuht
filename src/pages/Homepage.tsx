import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ChevronDown } from "lucide-react";
import { Footer } from "@/components/Footer";
import { RendiIseHeader } from "@/components/RendiIseHeader";
import { useSEO } from "@/hooks/useSEO";
import { generateHomepageSEO } from "@/components/SEOHead";
import { useTracking } from "@/components/TrackingProvider";

const Homepage = () => {
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const navigate = useNavigate();
  const { trackEvent, trackPageView } = useTracking();

  // SEO setup
  useSEO(generateHomepageSEO());

  // Track page view on component mount
  useEffect(() => {
    trackPageView('/', 'Homepage - Koristusvahendite Rent');
  }, [trackPageView]);

  const cities = [
    { name: "Tallinn", href: "/tallinn" },
    { name: "Tartu", href: "/tartu" },
    { name: "Pärnu", href: "/parnu" },
    { name: "Rakvere", href: "/rakvere" },
    { name: "Saku", href: "/saku" }
  ];

  const handleCityClick = (city: typeof cities[0]) => {
    // Track city selection
    trackEvent({
      action: 'select_city',
      category: 'navigation',
      label: city.name,
      custom_parameters: {
        source: 'homepage_dropdown',
        destination: city.href
      }
    });

    navigate(city.href);
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
        className="bg-primary hover:bg-primary-hover text-primary-foreground px-5 py-3 rounded-full font-medium flex items-center gap-2 transition-all duration-300 shadow-soft"
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
              className="block w-full px-4 py-3 text-sm text-gray-700 hover:bg-primary hover:text-primary-foreground transition-all duration-200 first:rounded-t-lg last:rounded-b-lg"
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
      <RendiIseHeader />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 order-2 md:order-1">
            <div className="w-full max-w-sm mx-auto">
              <img
                src="/lovable-uploads/df0e8fbf-70e2-43c9-85f7-287560a031d1.png"
                alt="Puhastusseadmed"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
          
          <div className="md:col-span-7 order-1 md:order-2">
            <h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-6">
              Puhastusseadmete nutirent Eestis
            </h1>
            
            {/* Lisatud tööriistad ja teenused */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center">
                <span className="text-primary font-bold mr-2">•</span>
                <Link to="/tekstiilipesuri-rent" className="text-gray-700 hover:text-primary transition-colors">
                  tekstiilipesuri rent
                </Link>
              </div>
              <div className="flex items-center">
                <span className="text-primary font-bold mr-2">•</span>
                <Link to="/aurupesuri-rent" className="text-gray-700 hover:text-primary transition-colors">
                  aurupesuri rent
                </Link>
              </div>
              <div className="flex items-center">
                <span className="text-primary font-bold mr-2">•</span>
                <Link to="/aknapesuroboti-rent" className="text-gray-700 hover:text-primary transition-colors">
                  aknapesuroboti rent
                </Link>
              </div>
              <div className="flex items-center">
                <span className="text-primary font-bold mr-2">•</span>
                <Link to="/tolmuimeja-rent" className="text-gray-700 hover:text-primary transition-colors">
                  tolmuimeja rent
                </Link>
              </div>
              <div className="flex items-center">
                <span className="text-primary font-bold mr-2">•</span>
                <Link to="/aknapesuri-rent" className="text-gray-700 hover:text-primary transition-colors">
                  aknapesuri rent
                </Link>
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

      {/* Kuidas Rendilse töötab */}
      <section className="py-10 text-center">
        <h2 className="text-2xl font-bold mb-8">Kuidas Rendilse töötab?</h2>
        <div className="flex flex-col md:flex-row justify-center gap-10 max-w-5xl mx-auto">
          <div>
            <img src="https://img.icons8.com/ios/50/000000/warehouse.png" className="mx-auto mb-3" />
            <p className="font-semibold">Vali seade ja asukoht</p>
            <p className="text-sm text-gray-500">Leia lähim nutikapp..</p>
          </div>
          <div>
            <img src="https://img.icons8.com/ios/50/000000/calendar.png" className="mx-auto mb-3" />
            <p className="font-semibold">Broneeri ja ava kapp</p>
            <p className="text-sm text-gray-500">Kõik toimub mugavalt veebis</p>
          </div>
          <div>
            <img src="https://img.icons8.com/ios/50/000000/sofa.png" className="mx-auto mb-3" />
            <p className="font-semibold">Puhasta kodu</p>
            <p className="text-sm text-gray-500">Naudi tulemust.</p>
          </div>
          <div>
            <img src="https://img.icons8.com/ios/50/000000/smartphone.png" className="mx-auto mb-3" />
            <p className="font-semibold">Tagasta kappi</p>
            <p className="text-sm text-gray-500">kui oled valmis, kasvõi samal päeval.</p>
          </div>
        </div>
      </section>

      {/* Miks valida Rendilse */}
      <section className="py-10 bg-gray-50 text-center">
        <h2 className="text-2xl font-bold mb-8">Mida saab rentida?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="p-6 bg-white rounded-xl shadow">
            <div className="mx-auto mb-3 w-12 h-12 flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 8h18l-2 9H5L3 8Z"/>
                <path d="M3 8L2 4H1"/>
                <path d="M8 12h8"/>
                <circle cx="9" cy="20" r="1"/>
                <circle cx="20" cy="20" r="1"/>
              </svg>
            </div>
            <p className="font-semibold">Tekstiilipesur</p>
            <p className="text-sm text-gray-500">Teestli vaasiez mainsattetageja vostm.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow">
            <div className="mx-auto mb-3 w-12 h-12 flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="14" rx="2"/>
                <path d="M8 21h8"/>
                <path d="M12 17v4"/>
                <path d="M7 7h10v6H7z"/>
              </svg>
            </div>
            <p className="font-semibold">Aknapesurobot</p>
            <p className="text-sm text-gray-500">Välirue kobsetu ja kormukenas ker tedhamestu</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow">
            <div className="mx-auto mb-3 w-12 h-12 flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L8 7h8l-4-5z"/>
                <path d="M8 7v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V7"/>
                <path d="M10 12h4"/>
                <circle cx="12" cy="19" r="1"/>
              </svg>
            </div>
            <p className="font-semibold">Aurupesur</p>
            <p className="text-sm text-gray-500">Eriianaldas, uridikone vedstipokelleta</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow">
            <div className="mx-auto mb-3 w-12 h-12 flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
                <circle cx="11" cy="8" r="2"/>
              </svg>
            </div>
            <p className="font-semibold">Tolmuimeja</p>
            <p className="text-sm text-gray-500">Mugiv örjde valfii puuttaeja peutaimis</p>
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
                <a href="/tallinn" className="text-primary hover:underline">Tallinn</a>,{" "}
                <a href="/tartu" className="text-primary hover:underline">Tartu</a>,{" "}
                <a href="/parnu" className="text-primary hover:underline">Pärnu</a>,{" "}
                <a href="/rakvere" className="text-primary hover:underline">Rakvere</a>,{" "}
                <a href="/saku" className="text-primary hover:underline">Saku</a>.
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

      {/* Why Choose Rendiise - Company Benefits */}
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">
              Mida kliendid räägivad?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 text-center">
              <CardContent className="p-0">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <h4 className="text-xl font-medium text-gray-800 mb-2">Kui kaua saab seanet rentida?</h4>
                <p className="text-gray-600 mb-6">
                  "Väga hea teenus ja kvaliteetsed seadmed. Soovitan soojalt!"
                </p>
                <p className="font-medium">Kadri, Tallinn</p>
              </CardContent>
            </Card>
            
            <Card className="p-8 text-center">
              <CardContent className="p-0">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <h4 className="text-xl font-medium text-gray-800 mb-2">Kas seadmed on puhastatatud ja hooldatud?</h4>
                <p className="text-gray-600 mb-6">
                  "Lihtne kasutada ja väga efektiivne. Tekstiilipesur tegi imelisi tulemusi!"
                </p>
                <p className="font-medium">Martin, Tartu</p>
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
      {/* Korduma kippuvad küsimused */}
      <section className="py-10 bg-gray-50">
        <h2 className="text-2xl font-bold text-center mb-6">Korduma kippuvad küsimused</h2>
        <div className="max-w-3xl mx-auto space-y-3">
          <details className="bg-white shadow rounded p-4 cursor-pointer">
            <summary className="font-semibold">Kui kaua saan seadet rentida?</summary>
          </details>
          <details className="bg-white shadow rounded p-4 cursor-pointer">
            <summary className="font-semibold">Kas hinnas sisaldub puhastusvahend?</summary>
          </details>
          <details className="bg-white shadow rounded p-4 cursor-pointer">
            <summary className="font-semibold">Kas seadmed on puhastatud ja hooldatud?</summary>
          </details>
          <details className="bg-white shadow rounded p-4 cursor-pointer">
            <summary className="font-semibold">Kus nutiäpid asuvad?</summary>
          </details>
        </div>
      </section>

      </section>

      <Footer />
    </div>
  );
};

export default Homepage;