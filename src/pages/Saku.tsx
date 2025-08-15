import { useState } from "react";
import { format } from "date-fns";
import { RendiIseHeader } from "@/components/RendiIseHeader";
import { Footer } from "@/components/Footer";
import { RentalFilters } from "@/components/RentalFilters";
import { RentalProductCard } from "@/components/RentalProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Edit3, MapPin, CalendarIcon, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import wurthCleaner from "@/assets/wurth-textile-cleaner.jpg";
import steamCleaner from "@/assets/steam-cleaner-karcher.jpg";
import windowRobot from "@/assets/window-robot-new.jpg";

const Saku = () => {
  const [editMode, setEditMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [customImages, setCustomImages] = useState({
    textile: wurthCleaner,
    steam: steamCleaner,
    window: windowRobot
  });

  const handleImageUpload = (type: 'textile' | 'steam' | 'window', event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleImageUpload called for type:', type);
    const file = event.target.files?.[0];
    console.log('Selected file:', file);
    if (file) {
      const url = URL.createObjectURL(file);
      console.log('Created URL:', url);
      setCustomImages(prev => {
        const updated = { ...prev, [type]: url };
        console.log('Updated customImages:', updated);
        return updated;
      });
    }
    event.target.value = '';
  };

  const handleImageDelete = (type: 'textile' | 'steam' | 'window') => {
    const defaultImages = {
      textile: wurthCleaner,
      steam: steamCleaner,
      window: windowRobot
    };
    setCustomImages(prev => ({ ...prev, [type]: defaultImages[type] }));
  };

  const rentalProducts = [
    {
      id: "1",
      name: "TEKSTIILIPESUR 1 (Selveris)",
      price: "4.5€ / Tund",
      location: "Saku, Saku tee 1, Selver",
      image: customImages.textile,
      rating: 4.8,
      available: true
    },
    {
      id: "2", 
      name: "AURUPESUR (Coopis)",
      price: "3.5€ / Tund",
      location: "Saku, Tallinna-Pärnu mnt 119, Coop",
      image: customImages.steam,
      rating: 4.6,
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

      {/* Image Upload Section */}
      {editMode && (
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Muuda toodete pilte</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center">
                <img src={customImages.textile} alt="Tekstiilipesur" className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg mx-auto mb-3" />
                <div>
                  <span className="text-sm font-medium text-gray-700 block mb-2">Tekstiilipesur</span>
                  <div className="flex gap-2 justify-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('textile', e)}
                      className="hidden"
                      id="textile-upload"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        const input = document.getElementById('textile-upload') as HTMLInputElement;
                        input?.click();
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Muuda pilti
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleImageDelete('textile')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Kustuta
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <img src={customImages.steam} alt="Aurupesur" className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg mx-auto mb-3" />
                <div>
                  <span className="text-sm font-medium text-gray-700 block mb-2">Aurupesur</span>
                  <div className="flex gap-2 justify-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('steam', e)}
                      className="hidden"
                      id="steam-upload"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        const input = document.getElementById('steam-upload') as HTMLInputElement;
                        input?.click();
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Muuda pilti
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleImageDelete('steam')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Kustuta
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <img src={customImages.window} alt="Aknapesuribot" className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg mx-auto mb-3" />
                <div>
                  <span className="text-sm font-medium text-gray-700 block mb-2">Aknapesuribot</span>
                  <div className="flex gap-2 justify-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('window', e)}
                      className="hidden"
                      id="window-upload"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        const input = document.getElementById('window-upload') as HTMLInputElement;
                        input?.click();
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Muuda pilti
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleImageDelete('window')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Kustuta
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Tekstiilipesuri nutirent Sakus
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {rentalProducts.map((product) => (
            <RentalProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Saku;