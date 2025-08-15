import { useState } from "react";
import { CleaningHeader } from "@/components/CleaningHeader";
import { CleaningHeroSection } from "@/components/CleaningHeroSection";
import { EquipmentFilters } from "@/components/EquipmentFilters";
import { EquipmentCard } from "@/components/EquipmentCard";

// Mock data for cleaning equipment
const mockEquipment = [
  {
    id: "1",
    name: "Kärcher BR 40/10 C Põrandapesumasin",
    category: "Põrande puhastus",
    dailyPrice: 45,
    weeklyPrice: 280,
    image: "https://images.unsplash.com/photo-1558618666-fbd8c755cd64?w=500",
    isAvailable: true,
    rating: 4.8,
    features: ["Kompaktne disain", "Automaatne pesuvesi doseerimise süsteem", "50L veepaak"],
    deliveryIncluded: true
  },
  {
    id: "2",
    name: "Nilfisk Alto Attix 33-2L IC Tolmuimeja",
    category: "Tolmuimejad",
    dailyPrice: 25,
    weeklyPrice: 150,
    image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=500",
    isAvailable: true,
    rating: 4.6,
    features: ["33L maht", "Märg/kuiv imemine", "Automaatne filter puhastus"],
    deliveryIncluded: false
  },
  {
    id: "3",
    name: "Kärcher Puzzi 8/1 C Vaipade puhastusmasin",
    category: "Vaipade puhastus",
    dailyPrice: 65,
    weeklyPrice: 380,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500",
    isAvailable: false,
    rating: 4.9,
    features: ["Sügav vaibapuhastus", "Kiire kuivamine", "8L pesuveepaak"],
    deliveryIncluded: true
  },
  {
    id: "4",
    name: "Kärcher HD 6/13 C Survepesur",
    category: "Survepesur",
    dailyPrice: 35,
    weeklyPrice: 200,
    image: "https://images.unsplash.com/photo-1603712747852-1d6c8e64c3e4?w=500",
    isAvailable: true,
    rating: 4.7,
    features: ["130 bar surve", "360L/h voolukiirus", "Kuuma vee funktsioon"],
    deliveryIncluded: true
  },
  {
    id: "5",
    name: "Unger HydroPower DI24 Akende pesusüsteem",
    category: "Akende puhastus",
    dailyPrice: 55,
    weeklyPrice: 320,
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=500",
    isAvailable: true,
    rating: 4.5,
    features: ["Demineraliseeritud vesi", "24L veepaak", "6m teleskoopvarras"],
    deliveryIncluded: false
  },
  {
    id: "6",
    name: "Tennant T300 Põrandapesur",
    category: "Tööstuslik",
    dailyPrice: 120,
    weeklyPrice: 700,
    image: "https://images.unsplash.com/photo-1563453392212-326d32e5d8c2?w=500",
    isAvailable: true,
    rating: 4.9,
    features: ["Tööstuslik kasutamine", "ec-H2O tehnoloogia", "114L veepaak"],
    deliveryIncluded: true
  }
];

const Index = () => {
  const [filteredEquipment, setFilteredEquipment] = useState(mockEquipment);

  const handleSearch = (filters: any) => {
    let filtered = mockEquipment;

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter(equipment => 
        equipment.category.toLowerCase() === filters.category.replace("-", " ").toLowerCase()
      );
    }

    if (filters.maxDailyPrice) {
      filtered = filtered.filter(equipment => 
        equipment.dailyPrice <= parseInt(filters.maxDailyPrice)
      );
    }

    if (filters.maxWeeklyPrice) {
      filtered = filtered.filter(equipment => 
        equipment.weeklyPrice <= parseInt(filters.maxWeeklyPrice)
      );
    }

    if (filters.deliveryIncluded) {
      filtered = filtered.filter(equipment => equipment.deliveryIncluded);
    }

    if (filters.availableOnly) {
      filtered = filtered.filter(equipment => equipment.isAvailable);
    }

    setFilteredEquipment(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      <CleaningHeader />
      <CleaningHeroSection />
      
      {/* Search Section */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Leia sobiv seade</h2>
            <p className="text-lg text-muted-foreground">
              Kasuta filtreid, et leida endale kõige sobivam puhastusseade
            </p>
          </div>
          <EquipmentFilters onSearch={handleSearch} />
        </div>
      </section>

      {/* Equipment Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              Saadaval on {filteredEquipment.length} puhastusseadet
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((equipment) => (
              <EquipmentCard key={equipment.id} equipment={equipment} />
            ))}
          </div>

          {filteredEquipment.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                Antud kriteeriumitele vastavaid seadmeid ei leitud.
              </p>
              <p className="text-muted-foreground mt-2">
                Proovige muuta otsingukriteeriumeid.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-accent/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Miks valida PuhasRent?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Kiire kohaletoimetamine</h3>
              <p className="text-muted-foreground">Same päeva kohaletoimetamine Tallinnas ja Tartus</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Hooldatud seadmed</h3>
              <p className="text-muted-foreground">Kõik seadmed on regulaarselt hooldatud ja kontrollitud</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Kindlustus kaasas</h3>
              <p className="text-muted-foreground">Kõik renditud seadmed on kindlustatud</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">PuhasRent</h3>
              <p className="text-primary-foreground/80">
                Eesti juhtiv puhastusseadmete rendiettevõte. Professionaalsed lahendused igasuguseks puhastamiseks!
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Seadmed</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#" className="hover:text-primary-foreground">Põrande puhastus</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Vaipade puhastus</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Survepesurid</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Tolmuimejad</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Teenused</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#" className="hover:text-primary-foreground">Kohaletoimetamine</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Hooldus</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Konsultatsioon</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontakt</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>+372 5555 5555</li>
                <li>info@puhasrent.ee</li>
                <li>Tallinn, Tartu, Pärnu</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/80">
            <p>&copy; 2024 PuhasRent. Kõik õigused kaitstud.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;