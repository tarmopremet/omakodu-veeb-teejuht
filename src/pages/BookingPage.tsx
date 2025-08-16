import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RendiIseHeader } from "@/components/RendiIseHeader";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, MapPin, Clock, Euro } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import wurthCleaner from "@/assets/wurth-textile-cleaner.jpg";
import steamCleaner from "@/assets/steam-cleaner-karcher.jpg";
import windowRobot from "@/assets/window-robot-new.jpg";

const BookingPage = () => {
  const { city } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [customImages] = useState({
    textile: wurthCleaner,
    steam: steamCleaner,
    window: windowRobot
  });

  useEffect(() => {
    loadProducts();
  }, [city]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      // Determine city name from parameter
      const cityName = city?.charAt(0).toUpperCase() + city?.slice(1) || "Tallinn";
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .ilike('location', `%${cityName}%`);

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

  const createSlug = (name: string, location: string) => {
    const slugify = (s: string) =>
      s
        .toLowerCase()
        .replace(/[ä]/g, 'a')
        .replace(/[ö]/g, 'o')
        .replace(/[ü]/g, 'u')
        .replace(/[õ]/g, 'o')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const extractPlace = (loc: string) => {
      if (!loc) return 'keskus';
      const parts = loc.split(/[-,]/);
      return parts[parts.length - 1].trim();
    };

    const productType = name.toLowerCase().includes('tekstiili') ? 'tekstiilipesur' : 
                       name.toLowerCase().includes('auru') ? 'aurupesur' : 'aknapesuribot';
    const placeSlug = slugify(extractPlace(location));
    return `${productType}-asukohaga-${placeSlug}`;
  };

  const formatProducts = () => {
    return products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || "Kvaliteetne seade",
      price: `${product.price_per_hour}€ / Tund`,
      location: product.location,
      image: product.images?.[0] || getDefaultImage(product.category),
      available: product.is_active,
      slug: createSlug(product.name, product.location)
    }));
  };

  const handleProductSelect = (product: any) => {
    navigate(`/et/rendi/${product.slug}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <RendiIseHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate("/")}>
            ← Tagasi esilehele
          </Button>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Vali seade - {city}
        </h1>

        {/* Product Selection Only */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">Saadaolevad seadmed</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <p>Laadime tooteid...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <p>Selles linnas pole hetkel saadaval tooteid.</p>
              <p className="text-sm text-gray-500 mt-2">Administraator saab lisada tooteid admin paneelilt.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {formatProducts().map((product) => (
                <Card 
                  key={product.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    !product.available ? 'opacity-50' : ''
                  }`}
                  onClick={() => product.available && handleProductSelect(product)}
                >
                  <CardContent className="p-6">
                    <div className="text-center">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-40 sm:h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                      <p className="text-sm text-gray-500 flex items-center justify-center mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        {product.location}
                      </p>
                      <p className="text-xl font-bold text-blue-600 mb-4">{product.price}</p>
                      
                      {product.available ? (
                        <Button className="w-full">
                          Vali see seade
                        </Button>
                      ) : (
                        <Button className="w-full" disabled>
                          Hetkel pole saadaval
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default BookingPage;