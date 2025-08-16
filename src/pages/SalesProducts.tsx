import { useState, useEffect } from "react";
import { RendiIseHeader } from "@/components/RendiIseHeader";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingForm } from "@/components/BookingForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SalesProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('sales_products')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading sales products:', error);
      toast({
        title: "Viga",
        description: "Toodete laadimine ebaõnnestus",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseProduct = (product: any) => {
    setSelectedProduct(product);
    setShowBookingForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <RendiIseHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Laadime tooteid...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RendiIseHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Müügitooted</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kvaliteetsed puhastustarvikud teie koduseks kasutamiseks
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Müügitooteid pole hetkel saadaval.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="space-y-6">
                  {/* Image section */}
                  <div className="p-6 pb-0">
                    {/* Mobile 2x2 grid, desktop single image */}
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-0">
                      {product.images && product.images[0] ? (
                        <div 
                          className="aspect-square md:aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => handlePurchaseProduct(product)}
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div 
                          className="aspect-square md:aspect-square bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                          onClick={() => handlePurchaseProduct(product)}
                        >
                          <p className="text-gray-500 text-xs md:text-base">Toote pilt</p>
                        </div>
                      )}

                      {/* Second image for mobile 2x2 layout */}
                      {product.images && product.images[1] && (
                        <div 
                          className="md:hidden aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => handlePurchaseProduct(product)}
                        >
                          <img
                            src={product.images[1]}
                            alt={`${product.name} 2`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Third image for mobile 2x2 layout */}
                      {product.images && product.images[2] && (
                        <div 
                          className="md:hidden aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => handlePurchaseProduct(product)}
                        >
                          <img
                            src={product.images[2]}
                            alt={`${product.name} 3`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Fourth image for mobile 2x2 layout */}
                      {product.images && product.images[3] && (
                        <div 
                          className="md:hidden aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => handlePurchaseProduct(product)}
                        >
                          <img
                            src={product.images[3]}
                            alt={`${product.name} 4`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    
                    {product.video_url && (
                      <div className="mt-4 aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <iframe
                          src={product.video_url.includes('youtube') 
                            ? product.video_url.replace('watch?v=', 'embed/') 
                            : product.video_url
                          }
                          title={`${product.name} video`}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>

                  {/* Product info section */}
                  <CardContent className="p-6 pt-0">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {product.name}
                    </h2>
                    
                    <div className="text-2xl font-bold text-primary mb-4">
                      {product.price}€
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Toote kirjeldus</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                          {product.description || "Kvaliteetne toode."}
                        </p>
                      </div>

                      {product.manual_text && (
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Kasutamisjuhend</h3>
                          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {product.manual_text}
                          </p>
                        </div>
                      )}

                      <div className="pt-4">
                        <Button 
                          className="w-full text-lg py-3"
                          onClick={() => handlePurchaseProduct(product)}
                        >
                          Osta kohe
                        </Button>
                      </div>

                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center justify-between">
                          <span>Saadavus:</span>
                          <span className="text-green-600 font-medium">Laos</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Kohaletoimetamine:</span>
                          <span>1-3 tööpäeva</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Booking/Purchase Form Modal */}
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
          totalPrice={selectedProduct.price.toString()}
        />
      )}

      <Footer />
    </div>
  );
};

export default SalesProducts;