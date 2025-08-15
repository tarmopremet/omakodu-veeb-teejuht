import { RendiIseHeader } from "@/components/RendiIseHeader";
import { RentalFilters } from "@/components/RentalFilters";
import { RentalProductCard } from "@/components/RentalProductCard";
import textileCleaner from "@/assets/textile-cleaner-wurth.jpg";
import steamCleaner from "@/assets/steam-cleaner-karcher.jpg";
import windowRobot from "@/assets/window-robot-new.jpg";

// Mock data matching the original site
const rentalProducts = [
  {
    id: "1",
    name: "TEKSTIILIPESUR 1 (Järve Keskuses pangaautomaatide juures)",
    price: "4.5€ / Tund",
    location: "Tallinn, Pärnu mnt. 238, Järve Keskus",
    image: textileCleaner,
    rating: 4.8,
    available: true
  },
  {
    id: "2", 
    name: "AURUPESUR (asukohaga Sikupilli Prisma)",
    price: "3.5€ / Tund",
    location: "Tallinn, Tartu mnt 87, Sikupilli Prisma",
    image: steamCleaner,
    rating: 4.6,
    available: true
  },
  {
    id: "3",
    name: "AKNAPESURIBOT (Kristiine Keskuses)",
    price: "5.0€ / Tund", 
    location: "Tallinn, Endla 45, Kristiine Keskus",
    image: windowRobot,
    rating: 4.9,
    available: true
  },
  {
    id: "4",
    name: "TEKSTIILIPESUR 2 (Kadaka Selveris)",
    price: "4.5€ / Tund",
    location: "Tallinn, Kadaka tee 56a, Kadaka Selver",
    image: textileCleaner,
    rating: 4.7,
    available: true
  },
  {
    id: "5",
    name: "AURUPESUR 2 (Lasnamäe Prismas)",
    price: "3.5€ / Tund",
    location: "Tallinn, Mustakivi tee 17, Lasnamäe Prisma",
    image: steamCleaner,
    rating: 4.5,
    available: false
  },
  {
    id: "6",
    name: "TEKSTIILIPESUR 3 (Pirita Selveris)",
    price: "4.5€ / Tund",
    location: "Tallinn, Rummu tee 4, Pirita Selver",
    image: textileCleaner,
    rating: 4.8,
    available: true
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <RendiIseHeader />
      
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Tekstiilipesuri nutirent Tallinnas
          </h1>
          
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Tekstiilipesuri rent - diivani, madratsi, vaiba ja tugitoolide puhastuseks /<br />
            Aurupesuri rent - vannitoa, köögi ja põrandate puhastuseks /<br />
            Aknapesuroboti rent - akende pesuks
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 py-8">
        <RentalFilters />
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Meie soovitused</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentalProducts.map((product) => (
            <RentalProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
};

export default Index;