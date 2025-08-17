import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RendiIseHeader } from "@/components/RendiIseHeader";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingForm } from "@/components/BookingForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MapPin, ChevronDown } from "lucide-react";

const categories = [
  {
    name: "Tekstiilipesur",
    description: "Diivani, madratsi ja vaiba puhastus",
    category: "Tekstiilipesurid",
  },
  {
    name: "Aurupesur", 
    description: "Vannitoa ja köögi puhastus",
    category: "Aurupesurid",
  },
  {
    name: "Aknapesuribot",
    description: "Automaatne akende pesu", 
    category: "Aknapesurobotid",
  },
  {
    name: "Aknapesur",
    description: "Käsitsi akende puhastus",
    category: "Aknapesurid",
  },
  {
    name: "Tolmuimeja",
    description: "Põhjalik tolmueemaldus",
    category: "Tolmuimejad",
  },
];

const RentalProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [dropdownStates, setDropdownStates] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const cities = [
    { name: "Tallinn", href: "/tallinn" },
    { name: "Tartu", href: "/tartu" },
    { name: "Pärnu", href: "/parnu" },
    { name: "Rakvere", href: "/rakvere" },
    { name: "Saku", href: "/saku" }
  ];

  const handleCityClick = (city: typeof cities[0]) => {
    navigate(city.href);
    setDropdownStates({});
  };

  const toggleDropdown = (categoryName: string) => {
    setDropdownStates(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Viga",
        description: "Toodete laadimine ebaõnnestus",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };

  const handleRentProduct = (product: any) => {
    setSelectedProduct(product);
    setShowBookingForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <RendiIseHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Renditooted</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Valige sobiv kategooria ja leidke endale parim rendiseade
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Laadime tooteid...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const categoryProducts = getProductsByCategory(category.category);
              const firstProduct = categoryProducts[0];
              
              return (
                <Card key={category.name} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {category.name}
                        </h3>
                        <p className="text-gray-600 mt-2">{category.description}</p>
                      </div>
                      
                      {firstProduct?.images && firstProduct.images[0] && (
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={firstProduct.images[0]}
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      {firstProduct && (
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">
                            Alates {firstProduct.price_per_hour}€/tund
                          </div>
                          <div className="text-sm text-gray-600">
                            Saadaval: {categoryProducts.length} toodet
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Link 
                          to={`/renditooted/${category.category.toLowerCase()}`}
                          className="block"
                        >
                          <Button variant="outline" className="w-full">
                            Toote info
                          </Button>
                        </Link>
                        {firstProduct && (
                          <div className="relative inline-block w-full">
                            <Button 
                              className="w-full flex items-center justify-center gap-2"
                              onClick={() => toggleDropdown(category.name)}
                            >
                              <MapPin className="w-4 h-4" />
                              Broneeri kohe
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                            
                            {dropdownStates[category.name] && (
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]">
                                {cities.map((city) => (
                                  <button
                                    key={city.name}
                                    onClick={() => handleCityClick(city)}
                                    className="block w-full px-4 py-3 text-sm text-gray-700 hover:bg-primary hover:text-primary-foreground transition-all duration-200 first:rounded-t-lg last:rounded-b-lg"
                                  >
                                    {city.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Booking Form Modal */}
      {selectedProduct && (
        <BookingForm
          isOpen={showBookingForm}
          onClose={() => {
            setShowBookingForm(false);
            setSelectedProduct(null);
          }}
          productName={selectedProduct.name}
          startTime="09:00"
          endTime="17:00"
          totalPrice="0.00"
        />
      )}

      <Footer />
    </div>
  );
};

export default RentalProducts;