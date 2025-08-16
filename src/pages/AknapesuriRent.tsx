import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const AknapesuriRent = () => {
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
          <span className="text-gray-600">Aknapesuri rent</span>
        </nav>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-6">
            Aknapesuri rent
          </h1>

          <div className="bg-primary/10 p-6 rounded-lg mb-8">
            <p className="text-xl font-medium text-gray-800 mb-4">
              Hind: 3,0 EUR/1h ja 16,99 EUR/24h
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
              Miks aknapesuri rent?
            </h2>
            
            <div className="space-y-4 text-gray-600">
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Elektriline aknapesur on kallis seade, mida kasutatakse vaid mõned korrad aastas - rent maksab ennast ära.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Professionaalne aknapesur töötab kiiremini ja efektiivsemalt kui käsitsi pesemine.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Triibuvaba tulemus - elektriline pest ja imi funktsiooni ühendus tagab ideaalselt puhta akna.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Säästab aega - aknad saavad kiiresti ja vaevalt puhtaks.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Sobib kõikidele klaaspindadele - aknad, peeglid, dušikabiiniklaas.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Veetilkade imemissüsteem - ei jää põrandale vett ega mustust.</p>
              </div>
              <div className="flex items-start">
                <span className="text-primary font-bold mr-3 mt-1">•</span>
                <p>Kerge ja kompaktne - lihtne kasutada ka kõrgemate akende puhul.</p>
              </div>
            </div>
          </section>

          {/* Product Images */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Elektriline aknapesur</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Kärcher aknapesur</span>
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
              <p>• Lihtne kasutada - lihtsalt pihusta pind märjaks ja möödu aknapesuri üle.</p>
              <p>• Aku kestavus võimaldab pesta kõik kodu aknad ühe laadimisega.</p>
              <p>• Kaasas on erinevad otsikud erinevate pinnasuuruste jaoks.</p>
              <p>• Veetilkade imemissüsteem hoiab ümbruskonna kuivana.</p>
              <p>• Sobib kasutamiseks nii siseruumides kui väljas.</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AknapesuriRent;