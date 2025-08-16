import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import aurupesuriImage from "@/assets/steam-cleaner.jpg";
import karcherSteamImage from "@/assets/steam-cleaner-karcher.jpg";

const AuripesuriRent = () => {
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
              Miks aurupesuri rent?
            </h2>
            
            <div className="space-y-4 text-gray-600">
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Aurupesur on kallis seade, mida kasutatakse harvemini - rentimisega saad professionaalse tulemuse ilma suurt investeeringut tegemata.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Aurupesur vajab hoiustamiseks palju ruumi - rent võimaldab kasutada seadet vajaduse korral ilma säilitamise probleemideta.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Kuumaaur desinfitseerib pinnasid looduslikul viisil ilma kemikaalideta - ideaalne allergikutele ja väikelastega peredele.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Sobib suurepäraselt mattide, põrandate, plaatide ja sanitaarseadmete puhastamiseks.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Eemaldab järjekindlalt rasva, mustuse ja baktereid kõigilt pindadelt.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Kiire ja tõhus - kuumaaur töötab koheselt ja ei vaja kuivamisaega nagu märgpuhastus.</p>
              </div>
            </div>
          </section>

          {/* Product Images */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <img 
                    src={aurupesuriImage} 
                    alt="Aurupesuri rent - professionaalne seade" 
                    className="w-full h-64 object-cover"
                  />
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <img 
                    src={karcherSteamImage} 
                    alt="Aurupesuri rent - Kärcher seade" 
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
              <p>• Kuumaaur töötab temperatuuril kuni 100°C, hävitades bakterid ja viirused.</p>
              <p>• Ei vaja keemilisi puhastusvahendeid - looduslik ja ökoloogiline.</p>
              <p>• Ideaalne vannitubade, köökide ja teiste niiskete ruumide puhastamiseks.</p>
              <p>• Lihtne kasutada - lihtsalt täida veega ja vajuta nuppu.</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuripesuriRent;