import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import aknapesurobotImage from "@/assets/window-robot.jpg";
import aknapesurobotNewImage from "@/assets/window-robot-new.jpg";

const AknapesurobotiRent = () => {
  const cities = [
    { name: "Tallinn", href: "/tallinn" },
    { name: "Tartu", href: "/tartu" },
    { name: "Pärnu", href: "/parnu" },
    { name: "Rakvere", href: "/rakvere" },
    { name: "Saku", href: "/saku" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link to="/" className="text-primary hover:underline">Avaleht</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">Aknapesuroboti rent</span>
        </nav>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-6">
            Aknapesuroboti rent
          </h1>

          <div className="bg-primary/10 p-6 rounded-lg mb-8">
            <p className="text-xl font-medium text-gray-800 mb-4">
              Hind: 5,5 EUR/1h ja 24,99 EUR/24h
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
              Miks aknapesuroboti rent?
            </h2>
            
            <div className="space-y-4 text-gray-600">
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Aknapesurobot on kallis seade, mida vajatakse vaid mõned korrad aastas - rent on oluliselt odavam kui ostmine.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Säästab aega ja vaeva - robot peseb aknad iseseisvalt, sa saad tegeleda muude asjadega.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Ohutu - ei pea ise riskantsetel kõrgustel akende pesemisega tegelema.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Professionaalne tulemus - robot jätab aknad triibuvabaks ja läbipaistvaks.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Sobib kõikidele aknasuurustele ja -vormidele, ka klaaspinnastele ja peeglitele.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Nutikas tehnoloogia - robot kohandub automaatselt akna suuruse ja pinnaga.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Ideaalne kõrgete akende, rõduklaasi ja raskesti ligipääsetavate kohtade jaoks.</p>
              </div>
            </div>
          </section>

          {/* Product Images */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <img 
                    src={aknapesurobotImage} 
                    alt="Aknapesuroboti rent - nutikas seade" 
                    className="w-full h-64 object-cover"
                  />
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <img 
                    src={aknapesurobotNewImage} 
                    alt="Aknapesuroboti rent - uusim mudel" 
                    className="w-full h-64 object-cover"
                  />
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
              <p>• Robot kinnitub akna külge tugevalt ja liigub iseseisvalt üle kogu pinna.</p>
              <p>• Kaasas on kõik vajalikud tarvikud ja puhastusvahend.</p>
              <p>• Töötab nii sise- kui väljaküljel - universaalne lahendus.</p>
              <p>• Vaikne töö - ei sega koduse elu rütmi.</p>
              <p>• Turvaköis kaitseb seadet kukkumise eest.</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AknapesurobotiRent;