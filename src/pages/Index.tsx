import { useState } from "react";
import { RendiIseHeader } from "@/components/RendiIseHeader";
import { RentalFilters } from "@/components/RentalFilters";
import { RentalProductCard } from "@/components/RentalProductCard";
import { Button } from "@/components/ui/button";
import { Plus, Edit3 } from "lucide-react";
import wurthCleaner from "@/assets/wurth-textile-cleaner.jpg";
import steamCleaner from "@/assets/steam-cleaner-karcher.jpg";
import windowRobot from "@/assets/window-robot-new.jpg";


const Index = () => {
  const [editMode, setEditMode] = useState(false);
  const [customImages, setCustomImages] = useState({
    textile: wurthCleaner,
    steam: steamCleaner,
    window: windowRobot
  });

  const handleImageUpload = (type: 'textile' | 'steam' | 'window', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomImages(prev => ({ ...prev, [type]: url }));
    }
  };

  // Update rental products with custom images
  const rentalProducts = [
    {
      id: "1",
      name: "TEKSTIILIPESUR 1 (Järve Keskuses pangaautomaatide juures)",
      price: "4.5€ / Tund",
      location: "Tallinn, Pärnu mnt. 238, Järve Keskus",
      image: customImages.textile,
      rating: 4.8,
      available: true
    },
    {
      id: "2", 
      name: "AURUPESUR (asukohaga Sikupilli Prisma)",
      price: "3.5€ / Tund",
      location: "Tallinn, Tartu mnt 87, Sikupilli Prisma",
      image: customImages.steam,
      rating: 4.6,
      available: true
    },
    {
      id: "3",
      name: "AKNAPESURIBOT (Kristiine Keskuses)",
      price: "5.0€ / Tund", 
      location: "Tallinn, Endla 45, Kristiine Keskus",
      image: customImages.window,
      rating: 4.9,
      available: true
    },
    {
      id: "4",
      name: "TEKSTIILIPESUR 2 (Kadaka Selveris)",
      price: "4.5€ / Tund",
      location: "Tallinn, Kadaka tee 56a, Kadaka Selver",
      image: customImages.textile,
      rating: 4.7,
      available: true
    },
    {
      id: "5",
      name: "AURUPESUR 2 (Lasnamäe Prismas)",
      price: "3.5€ / Tund",
      location: "Tallinn, Mustakivi tee 17, Lasnamäe Prisma",
      image: customImages.steam,
      rating: 4.5,
      available: false
    },
    {
      id: "6",
      name: "TEKSTIILIPESUR 3 (Pirita Selveris)",
      price: "4.5€ / Tund",
      location: "Tallinn, Rummu tee 4, Pirita Selver",
      image: customImages.textile,
      rating: 4.8,
      available: true
    }
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      <RendiIseHeader />
      
      {/* Edit Mode Toggle */}
      <div className="container mx-auto px-4 pt-4">
        <div className="flex justify-end">
          <Button
            variant={editMode ? "default" : "outline"}
            onClick={() => setEditMode(!editMode)}
            className="flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            {editMode ? "Lõpeta muutmine" : "Muuda pilte"}
          </Button>
        </div>
      </div>

      {/* Image Upload Section (only visible in edit mode) */}
      {editMode && (
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Muuda toodete pilte</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <img src={customImages.textile} alt="Tekstiilipesur" className="w-32 h-32 object-cover rounded-lg mx-auto mb-3" />
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 block mb-2">Tekstiilipesur</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('textile', e)}
                    className="hidden"
                  />
                  <Button variant="outline" size="sm" className="cursor-pointer">
                    <Plus className="w-4 h-4 mr-2" />
                    Muuda pilti
                  </Button>
                </label>
              </div>
              
              <div className="text-center">
                <img src={customImages.steam} alt="Aurupesur" className="w-32 h-32 object-cover rounded-lg mx-auto mb-3" />
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 block mb-2">Aurupesur</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('steam', e)}
                    className="hidden"
                  />
                  <Button variant="outline" size="sm" className="cursor-pointer">
                    <Plus className="w-4 h-4 mr-2" />
                    Muuda pilti
                  </Button>
                </label>
              </div>
              
              <div className="text-center">
                <img src={customImages.window} alt="Aknapesuribot" className="w-32 h-32 object-cover rounded-lg mx-auto mb-3" />
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 block mb-2">Aknapesuribot</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('window', e)}
                    className="hidden"
                  />
                  <Button variant="outline" size="sm" className="cursor-pointer">
                    <Plus className="w-4 h-4 mr-2" />
                    Muuda pilti
                  </Button>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
      
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