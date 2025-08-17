import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import wurthCleaner from "@/assets/wurth-textile-cleaner.jpg";
import steamCleaner from "@/assets/https://sfismionwystqhsmytjq.supabase.co/storage/v1/object/public/product-images/products/8s9iz52x9bb.jpg";
import windowRobot from "@/assets/window-robot-new.jpg";


const Index = () => {
  const [editMode, setEditMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
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
    // Clear the input value to allow selecting the same file again
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

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .ilike('location', '%Tallinn%');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Loaded products:', data);
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Viga",
        description: "Toodete laadimine ebaõnnestus",
        variant: "destructive"
      });
      // Set empty array on error to prevent showing nothing
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultImage = (category: string) => {
    switch (category.toLowerCase()) {
      case 'tekstiilipesurid':
        return customImages.textile;
      case 'aurupesurid':
        return customImages.steam;
      case 'aknapesurobotid':
        return customImages.window;
      default:
        return customImages.textile;
    }
  };

  const formatProducts = () => {
    return products.map(product => ({
      id: product.id,
      name: product.name,
      price: `${product.price_per_hour}€ / Tund`,
      location: product.location,
      image: product.images?.[0] || getDefaultImage(product.category),
      available: product.is_active
    }));
  };
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
        
        {loading ? (
          <div className="text-center py-8">
            <p>Laadime tooteid...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <p>Tallinnas pole hetkel saadaval tooteid.</p>
            <p className="text-sm text-gray-500 mt-2">Administraator saab lisada tooteid admin paneelilt.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {formatProducts().map((product) => (
              <RentalProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Index;