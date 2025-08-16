import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { RendiIseHeader } from "@/components/RendiIseHeader";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingForm } from "@/components/BookingForm";
import { MapPin, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CategoryProducts = () => {
  const { category } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const { toast } = useToast();

  const categoryNames: Record<string, string> = {
    tekstiilipesurid: "Tekstiilipesurid",
    aurupesurid: "Aurupesurid", 
    aknapesurobotid: "Aknapesurobotid",
    aknapesurid: "Aknapesurid",
    tolmuimejad: "Tolmuimejad",
  };

  const categoryName = categoryNames[category || ""] || "Tooted";

  useEffect(() => {
    if (category) {
      loadProducts();
    }
  }, [category]);

  const loadProducts = async () => {
    try {
      const dbCategory = categoryNames[category || ""];
      if (!dbCategory) return;

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('category', dbCategory)
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

  const handleRentProduct = (product: any) => {
    setSelectedProduct(product);
    setShowBookingForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <RendiIseHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            to="/renditooted" 
            className="inline-flex items-center text-primary hover:text-primary-hover"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tagasi renditoodete juurde
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{categoryName}</h1>
          <p className="text-xl text-gray-600">
            Valige endale sobiv seade kategooriast "{categoryName}"
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Laadime tooteid...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Selles kategoorias pole veel tooteid saadaval.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {product.images && product.images[0] && (
                      <div 
                        className="aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => handleRentProduct(product)}
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center text-gray-500 mt-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{product.location}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Tunnis:</span>
                        <span className="font-semibold">{product.price_per_hour}€</span>
                      </div>
                      {product.price_per_day && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Päevas:</span>
                          <span className="font-semibold">{product.price_per_day}€</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Link 
                        to={`/et/rendi/${product.name.toLowerCase().replace(/\s+/g, '-')}-${product.id}`}
                        className="block"
                      >
                        <Button variant="outline" className="w-full">
                          Vaata detaile
                        </Button>
                      </Link>
                      <Button 
                        className="w-full"
                        onClick={() => handleRentProduct(product)}
                      >
                        Broneeri kohe
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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

export default CategoryProducts;