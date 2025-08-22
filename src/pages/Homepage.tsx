import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ChevronDown, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import { RendiIseHeader } from "@/components/RendiIseHeader";
import { useSEO } from "@/hooks/useSEO";
import { generateHomepageSEO } from "@/components/SEOHead";
import { useTracking } from "@/components/TrackingProvider";

const Homepage = () => {
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const navigate = useNavigate();
  const { trackEvent, trackPageView } = useTracking();
  const testimonialRef = useRef<HTMLDivElement>(null);

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

  const testimonials = [
    {
      name: "Kadri",
      location: "Tallinn", 
      rating: 5,
      text: "Väga hea teenus ja kvaliteetsed seadmed. Soovitan soojalt!"
    },
    {
      name: "Martin",
      location: "Tartu",
      rating: 5, 
      text: "Lihtne kasutada ja väga efektiivne. Tekstiilipesur tegi imelisi tulemusi!"
    },
    {
      name: "Liis",
      location: "Pärnu",
      rating: 5,
      text: "Suurepärane lahendus! Nutikapp oli väga mugav ja seade toimis täiuslikult."
    },
    {
      name: "Andres", 
      location: "Rakvere",
      rating: 5,
      text: "Üllatavalt hea kvaliteet ja taskukohane hind. Kindlasti kasutan veel!"
    },
    {
      name: "Kristi",
      location: "Tallinn",
      rating: 5, 
      text: "Aurupesur oli täpselt see, mida vajasin. Mugav broneerimine ja kasutamine."
    },
    {
      name: "Toomas",
      location: "Tartu", 
      rating: 5,
      text: "24/7 ligipääs on suurepärane! Sain seadme kätte just siis, kui vaja oli."
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

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
                <path d="M8 19a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4h1a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4z"/>
                <path d="M13 12h7"/>
                <path d="M17 8v8"/>
                <circle cx="8" cy="12" r="2"/>
              </svg>
            </div>
            <p className="font-semibold">Tekstiilipesur</p>
            <p className="text-sm text-gray-500">Tekstii vaaside mainsatete ja vostim.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow">
            <div className="mx-auto mb-3 w-12 h-12 flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="12" rx="2"/>
                <path d="M8 16v4"/>
                <path d="M16 16v4"/>
                <path d="M12 8l3 3-3 3"/>
                <circle cx="18" cy="7" r="1"/>
              </svg>
            </div>
            <p className="font-semibold">Aknapesurobot</p>
            <p className="text-sm text-gray-500">Valiue kobsetu ja kormukerud ker tedinamestu</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow">
            <div className="mx-auto mb-3 w-12 h-12 flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 3v6"/>
                <path d="M8 9h8"/>
                <path d="M6 12c0 4 2 7 6 7s6-3 6-7"/>
                <circle cx="10" cy="16" r="1"/>
                <circle cx="14" cy="16" r="1"/>
                <path d="M12 9c-2 0-3 1-3 3v4c0 1 1 2 3 2s3-1 3-2v-4c0-2-1-3-3-3z"/>
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
                <path d="M8 14h6"/>
              </svg>
            </div>
            <p className="font-semibold">Tolmuimeja</p>
            <p className="text-sm text-gray-500">Mugiv örjde valfii puuttae ja peutaimis</p>
          </div>
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

      {/* Feature Strip */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">
            Miks valida RendiIse?
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Customer Testimonials Carousel */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">
              Mida kliendid räägivad?
            </h2>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div 
              ref={testimonialRef}
              className="overflow-hidden"
            >
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <Card className="p-8 text-center max-w-2xl mx-auto">
                      <CardContent className="p-0">
                        <div className="flex justify-center mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-600 mb-6 text-lg italic">
                          "{testimonial.text}"
                        </p>
                        <p className="font-medium text-gray-800">
                          {testimonial.name}, {testimonial.location}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
            
            {/* Dots indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
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