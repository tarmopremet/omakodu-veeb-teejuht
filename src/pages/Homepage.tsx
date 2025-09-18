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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Homepage = () => {
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [showDropdown3, setShowDropdown3] = useState(false);
  const [showDropdown4, setShowDropdown4] = useState(false);
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
    { name: "Rakvere", href: "/rakvere" }
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
    setShowDropdown3(false);
    setShowDropdown4(false);
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
    const isMobile = window.innerWidth < 768;
    const step = isMobile ? 1 : 3;
    setCurrentTestimonial((prev) => (prev + step) % testimonials.length);
  };

  const prevTestimonial = () => {
    const isMobile = window.innerWidth < 768;
    const step = isMobile ? 1 : 3;
    setCurrentTestimonial((prev) => (prev - step + testimonials.length) % testimonials.length);
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
              Tekstiilipesuri ja puhastusseadmete rent üle Eesti
            </h1>
            
            {/* Lisatud tööriistad ja teenused - Parandatud mobiili jaoks */}
            <div className="space-y-3 mb-8">
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2"></span>
                <Link to="/tekstiilipesuri-rent" className="text-gray-700 hover:text-primary transition-colors">
                  tekstiilipesuri rent
                </Link>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2"></span>
                <Link to="/aurupesuri-rent" className="text-gray-700 hover:text-primary transition-colors">
                  aurupesuri rent
                </Link>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2"></span>
                <Link to="/aknapesuroboti-rent" className="text-gray-700 hover:text-primary transition-colors">
                  aknapesuroboti rent
                </Link>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2"></span>
                <Link to="/tolmuimeja-rent" className="text-gray-700 hover:text-primary transition-colors">
                  tolmuimeja rent
                </Link>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2"></span>
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

      <section className="py-10 text-center">
        <h2 className="text-2xl font-bold mb-8">Kuidas Rendiise töötab?</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-4 max-w-5xl mx-auto">
          <div className="flex flex-col items-center">
            <img src="https://img.icons8.com/ios/50/000000/warehouse.png" className="mx-auto mb-3" />
            <p className="font-semibold">Vali seade ja asukoht</p>
            <p className="text-sm text-gray-500">Leia lähim nutikapp..</p>
          </div>
          
          <div className="hidden md:block text-primary">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          
          <div className="flex flex-col items-center">
            <img src="https://img.icons8.com/ios/50/000000/calendar.png" className="mx-auto mb-3" />
            <p className="font-semibold">Broneeri ja ava kapp</p>
            <p className="text-sm text-gray-500">Kõik toimub mugavalt veebis</p>
          </div>
          
          <div className="hidden md:block text-primary">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          
          <div className="flex flex-col items-center">
            <img src="https://img.icons8.com/ios/50/000000/sofa.png" className="mx-auto mb-3" />
            <p className="font-semibold">Puhasta kodu</p>
            <p className="text-sm text-gray-500">Naudi tulemust.</p>
          </div>
          
          <div className="hidden md:block text-primary">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          
          <div className="flex flex-col items-center">
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
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition-shadow">
            <Link to="/tekstiilipesuri-rent" className="block">
              <div className="mx-auto mb-3 w-12 h-12 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/fd313741-c4a9-46c1-a39b-8590778e7d63.png" 
                  alt="Tekstiilipesur" 
                  className="w-12 h-12 object-contain rounded"
                />
              </div>
              <p className="font-semibold">Tekstiilipesur</p>
              <p className="text-sm text-gray-500 mb-4">Diivanite, vaipade ja madratsite sügavpuhastuseks.</p>
            </Link>
            <div className="relative">
              <Button 
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground px-5 py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-soft"
                onClick={() => setShowDropdown1(!showDropdown1)}
              >
                <MapPin className="w-4 h-4" />
                Broneerima
                <ChevronDown className="w-4 h-4" />
              </Button>
              
              {showDropdown1 && (
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
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition-shadow">
            <Link to="/aurupesuri-rent" className="block">
              <div className="mx-auto mb-3 w-12 h-12 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/d1b26aab-eee2-4caa-8c59-c03fe030b6e9.png" 
                  alt="Aurupesur" 
                  className="w-12 h-12 object-contain rounded"
                />
              </div>
              <p className="font-semibold">Aurupesur</p>
              <p className="text-sm text-gray-500 mb-4">Eemaldab mustuse ja bakterid kemikaalideta.</p>
            </Link>
            <div className="relative">
              <Button 
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground px-5 py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-soft"
                onClick={() => setShowDropdown2(!showDropdown2)}
              >
                <MapPin className="w-4 h-4" />
                Broneerima
                <ChevronDown className="w-4 h-4" />
              </Button>
              
              {showDropdown2 && (
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
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition-shadow">
            <Link to="/aknapesuroboti-rent" className="block">
              <div className="mx-auto mb-3 w-12 h-12 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/8ee54b86-4c92-48d5-b2c2-15dc1fdf9360.png" 
                  alt="Aknapesurobot" 
                  className="w-12 h-12 object-contain rounded"
                />
              </div>
              <p className="font-semibold">Aknapesurobot</p>
              <p className="text-sm text-gray-500 mb-4">Säravad aknad ilma pingutuseta.</p>
            </Link>
            <div className="relative">
              <Button 
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground px-5 py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-soft"
                onClick={() => setShowDropdown3(!showDropdown3)}
              >
                <MapPin className="w-4 h-4" />
                Broneerima
                <ChevronDown className="w-4 h-4" />
              </Button>
              
              {showDropdown3 && (
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
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition-shadow">
            <Link to="/tolmuimeja-rent" className="block">
              <div className="mx-auto mb-3 w-12 h-12 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/69cbbbfd-8983-483b-acf2-0c1ec50af274.png" 
                  alt="Tolmuimeja" 
                  className="w-12 h-12 object-contain rounded"
                />
              </div>
              <p className="font-semibold">Tolmuimeja</p>
              <p className="text-sm text-gray-500 mb-4">Igapäevaseks või suurpuhastuseks.</p>
            </Link>
            <div className="relative">
              <Button 
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground px-5 py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-soft"
                onClick={() => setShowDropdown4(!showDropdown4)}
              >
                <MapPin className="w-4 h-4" />
                Broneerima
                <ChevronDown className="w-4 h-4" />
              </Button>
              
              {showDropdown4 && (
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
        </div>
      </section>


      {/* Video Section - Parandatud mobiili nähtavuse jaoks */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <div className="relative pb-[56.25%] h-0 rounded-lg overflow-hidden bg-gray-100">
              <iframe
                src="https://www.youtube-nocookie.com/embed/4Fb3fDTeDWg?autoplay=0&mute=0&controls=1&playsinline=1"
                className="absolute top-0 left-0 w-full h-full border-0"
                allowFullScreen
                title="Rendiise video"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                style={{ minHeight: '200px' }}
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
                <a href="/rakvere" className="text-primary hover:underline">Rakvere</a>.
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
          
          <div className="relative max-w-6xl mx-auto">
            <div 
              ref={testimonialRef}
              className="overflow-hidden"
            >
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ 
                  transform: `translateX(-${currentTestimonial * (100 / (window.innerWidth < 768 ? 1 : 3))}%)` 
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full md:w-1/3 flex-shrink-0 px-2">
                    <Card className="p-6 text-center h-full animate-fade-in">
                      <CardContent className="p-0 flex flex-col h-full">
                        <div className="flex justify-center mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-600 mb-4 text-sm italic flex-grow">
                          "{testimonial.text}"
                        </p>
                        <p className="font-medium text-gray-800 text-sm">
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
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow z-10"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow z-10"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Dots indicator - parandatud mobiili jaoks */}
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ 
                length: window.innerWidth < 768 ? testimonials.length : Math.ceil(testimonials.length / 3) 
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(window.innerWidth < 768 ? index : index * 3)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    (window.innerWidth < 768 ? currentTestimonial : Math.floor(currentTestimonial / 3)) === index 
                      ? 'bg-primary' : 'bg-gray-300'
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

      {/* Korduma kippuvad küsimused */}
      <section className="py-10 bg-gray-50">
        <h2 className="text-2xl font-bold text-center mb-6">Korduma kippuvad küsimused</h2>
        <Accordion type="single" collapsible className="max-w-3xl mx-auto">
          <AccordionItem value="item-1">
            <AccordionTrigger>Kui kaua saan seadet rentida?</AccordionTrigger>
            <AccordionContent>
              Rentida saad nii ühe tunni kauppa kui ka 24 h. Oleneb vajadusest. Saad broneeringut ka pikendada, kui on vabu aegu.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Kas hinnas sisaldub puhastusvahend?</AccordionTrigger>
            <AccordionContent>
              Tekstiilipesuriga on kaasas 2 puhastustabletti. Need saad eraldi avatud kapist võtta (tavaliselt piisab 2 tabletist ühe toote puhastuseks). Vajadusel saad lisakoguse osta eraldi.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Kas seadmed on puhastatud ja hooldatud?</AccordionTrigger>
            <AccordionContent>
              Jah. Hooldame regulaarselt kõiki seadmeid. Kuna tegemist on nutirendiga, siis puhtus oleneb eelmisest kliendist. Kui soovid, et ka sinu pesur oleks puhas, siis ole viisakas järgmise köiendi vastu ja puhasta pesur alati peale töötamist.            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Kus nutikapid asuvad?</AccordionTrigger>
            <AccordionContent>
              Meie kapid asuvad suuremates linnades: <a href="/tallinn" className="text-primary hover:underline">Tallinn</a>, <a href="/tartu" className="text-primary hover:underline">Tartu</a>, <a href="/parnu" className="text-primary hover:underline">Pärnu</a>, <a href="/rakvere" className="text-primary hover:underline">Rakvere</a>.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <Footer />
    </div>
  );
};

export default Homepage;