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

      {/* How Rendilse Works */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">
            Kuidas Rendilse töötab?
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center p-6 shadow-sm">
            <CardContent className="p-0">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-800 mb-2">Vali seade ja asukoht</h4>
              <p className="text-sm text-gray-600">
                Viat veeb lehel seadmed ja leia sobiv asukoht lähelt käest.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 shadow-sm">
            <CardContent className="p-0">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-800 mb-2">Broneeri veebis</h4>
              <p className="text-sm text-gray-600">
                Mttuu tärid-algustu ja raken koosile.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 shadow-sm">
            <CardContent className="p-0">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0a2 2 0 002-2h6l2 2h6a2 2 0 012 2v1M3 7l1.5 1.5L7 7" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-800 mb-2">Kasuta kodus</h4>
              <p className="text-sm text-gray-600">
                Kaventai-sadist inge ame oralé k servau pronudumersai.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 shadow-sm">
            <CardContent className="p-0">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-800 mb-2">Tagesaeta nutikapp</h4>
              <p className="text-sm text-gray-600">
                Tagastahveetu mered soisatud.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Equipment Types */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">
              Miks valida Rendilse?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 shadow-sm">
              <CardContent className="p-0">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-800 mb-2">Tekstiilipesur</h4>
                <p className="text-sm text-gray-600">
                  Teestil waehze mainastetees jâ vostm.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 shadow-sm">
              <CardContent className="p-0">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-800 mb-2">Aknapesuroboti</h4>
                <p className="text-sm text-gray-600">
                  Valirue koctatu ja kormuteruna ker tedmasetu
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 shadow-sm">
              <CardContent className="p-0">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-800 mb-2">Aurupesur</h4>
                <p className="text-sm text-gray-600">
                  Eriinaldas, urtikome vedstipokelleta
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 shadow-sm">
              <CardContent className="p-0">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-800 mb-2">Tolmuimeja</h4>
                <p className="text-sm text-gray-600">
                  Mogu oride vallai puuttaa ja peutamils
                </p>
              </CardContent>
            </Card>
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

      {/* FAQ Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">
              Korduma kippuvad küsimused
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-800">Kui kaua saab seadet rentida?</h4>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-800">Kas hinnas sisaldub puhastusvahend?</h4>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-800">Kas seadmed on puhastatatud ja hooldatud?</h4>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-800">Kus nutikapid asuvad?</h4>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
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