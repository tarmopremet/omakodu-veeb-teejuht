import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { RendiIseHeader } from "@/components/RendiIseHeader";

const TolmuimejaRent = () => {
  const cities = [
    { name: "Tallinn", href: "/tallinn" },
    { name: "Tartu", href: "/tartu" },
    { name: "Pärnu", href: "/parnu" },
    { name: "Rakvere", href: "/rakvere" },
    { name: "Saku", href: "/saku" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <RendiIseHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link to="/" className="text-primary hover:underline">Avaleht</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">Tolmuimeja rent</span>
        </nav>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-6">
            Tolmuimeja rent
          </h1>

          <div className="bg-primary/10 p-6 rounded-lg mb-8">
            <p className="text-xl font-medium text-gray-800 mb-4">
              Hind: 2,5 EUR/1h ja 14,99 EUR/24h
            </p>
            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-3 rounded-full">
              Broneerima
            </Button>
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
              Miks tolmuimeja rent?
            </h2>
            
            <div className="space-y-4 text-gray-600">
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Professionaalne tolmuimeja on võimsam kui tavalisest kodusest - ideaalne suuremaks koristuseks või remondi järel.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Rentides saad kasutada uusimat tehnoloogiat ilma suurt rahalist investeeringut tegemata.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Sobib suurepäraselt ehitusprahi, põrandate ja raskesti puhastatavate pindade jaoks.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Suur mahutavus - ei pea pidevalt tühjendama nagu tavalist tolmuimejat.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Võimas imemine - eemaldab ka syvalt mattidest ja vaibalt mustuse ja tolmu.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Märg- ja kuivimetused - üks seade mitme funktsiooniga.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Ideaalne kontoritele, suurematele kaarutele või eriürituste järel koristamiseks.</p>
              </div>
            </div>
          </section>

          {/* Product Images */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Professionaalne tolmuimeja</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Märg-kuiv tolmuimeja</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Additional Info */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-medium text-gray-800 mb-4">
              Kasulik teada
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>• Suur jõudlus võimaldab kiiret ja tõhusat koristamist.</p>
              <p>• Erinevad otsikud erinevate pindade jaoks.</p>
              <p>• Filtrisüsteem tagab puhtama õhu tagasivoolu.</p>
              <p>• Kompaktne disain - lihtne liigutada ja kasutada.</p>
              <p>• Madal müratase võrreldes tavalistega profiseadmetega.</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TolmuimejaRent;