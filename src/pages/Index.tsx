import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { SearchFilters } from "@/components/SearchFilters";
import { PropertyCard } from "@/components/PropertyCard";

// Mock data for demonstration
const mockProperties = [
  {
    id: "1",
    title: "Kaasaegne 2-toaline korter Tallinna kesklinnas",
    address: "Viru tn 15",
    city: "Tallinn",
    price: 850,
    rooms: 2,
    area: 65,
    floor: "3 / 5",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500",
    hasParking: true,
    hasStorage: false,
    petsAllowed: false,
    isAvailable: true
  },
  {
    id: "2",
    title: "Avar 3-toaline korter Tartus",
    address: "Kaunase pst 4a",
    city: "Tartu",
    price: 720,
    rooms: 3,
    area: 85,
    floor: "2 / 4",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500",
    hasParking: false,
    hasStorage: true,
    petsAllowed: true,
    isAvailable: true
  },
  {
    id: "3",
    title: "Hubane 1-toaline stuudiokorter",
    address: "Narva mnt 25",
    city: "Tallinn",
    price: 550,
    rooms: 1,
    area: 35,
    floor: "1 / 3",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
    hasParking: true,
    hasStorage: true,
    petsAllowed: false,
    isAvailable: false
  },
  {
    id: "4",
    title: "Luksuslik 4-toaline korter vanalinna ääres",
    address: "Pikk tn 70",
    city: "Tallinn",
    price: 1200,
    rooms: 4,
    area: 120,
    floor: "4 / 6",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=500",
    hasParking: true,
    hasStorage: true,
    petsAllowed: true,
    isAvailable: true
  },
  {
    id: "5",
    title: "Renoveeritud 2-toaline korter Pärnus",
    address: "Rüütli tn 12",
    city: "Pärnu",
    price: 680,
    rooms: 2,
    area: 58,
    floor: "1 / 2",
    image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=500",
    hasParking: false,
    hasStorage: false,
    petsAllowed: true,
    isAvailable: true
  },
  {
    id: "6",
    title: "Moodne 3-toaline korter Narvas",
    address: "Kerese tn 8",
    city: "Narva",
    price: 450,
    rooms: 3,
    area: 75,
    floor: "5 / 9",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500",
    hasParking: true,
    hasStorage: false,
    petsAllowed: false,
    isAvailable: true
  }
];

const Index = () => {
  const [filteredProperties, setFilteredProperties] = useState(mockProperties);

  const handleSearch = (filters: any) => {
    let filtered = mockProperties;

    // Apply filters
    if (filters.location) {
      filtered = filtered.filter(property => 
        property.city.toLowerCase() === filters.location.toLowerCase()
      );
    }

    if (filters.rooms) {
      const roomCount = filters.rooms === "5+" ? 5 : parseInt(filters.rooms);
      if (filters.rooms === "5+") {
        filtered = filtered.filter(property => property.rooms >= roomCount);
      } else {
        filtered = filtered.filter(property => property.rooms === roomCount);
      }
    }

    if (filters.minPrice) {
      filtered = filtered.filter(property => property.price >= parseInt(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(property => property.price <= parseInt(filters.maxPrice));
    }

    if (filters.minArea) {
      filtered = filtered.filter(property => property.area >= parseInt(filters.minArea));
    }

    if (filters.maxArea) {
      filtered = filtered.filter(property => property.area <= parseInt(filters.maxArea));
    }

    if (filters.hasParking) {
      filtered = filtered.filter(property => property.hasParking);
    }

    if (filters.hasStorage) {
      filtered = filtered.filter(property => property.hasStorage);
    }

    if (filters.petsAllowed) {
      filtered = filtered.filter(property => property.petsAllowed);
    }

    setFilteredProperties(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      
      {/* Search Section */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Leia sobiv kodu</h2>
            <p className="text-lg text-muted-foreground">
              Kasuta filtreid, et leida endale kõige sobivam üürikorter
            </p>
          </div>
          <SearchFilters onSearch={handleSearch} />
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              Saadaval on {filteredProperties.length} kinnisvara objekti
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                Antud kriteeriumitele vastavaid kinnisvara objekte ei leitud.
              </p>
              <p className="text-muted-foreground mt-2">
                Proovige muuta otsingukriteeriumeid.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">RendiEst</h3>
              <p className="text-primary-foreground/80">
                Eesti juhtiv üürikinnisvara platvorm. Leia oma unistuste kodu!
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kiirlingid</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#" className="hover:text-primary-foreground">Otsi kinnisvara</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Üürileandjakele</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Abi ja tugi</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Ettevõte</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#" className="hover:text-primary-foreground">Meist</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Karjäär</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Kontakt</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Õiguslik</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#" className="hover:text-primary-foreground">Privaatsus</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Tingimused</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Küpsised</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/80">
            <p>&copy; 2024 RendiEst. Kõik õigused kaitstud.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;