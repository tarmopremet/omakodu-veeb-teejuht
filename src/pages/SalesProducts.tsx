import { useState } from "react";
import { RendiIseHeader } from "@/components/RendiIseHeader";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingForm } from "@/components/BookingForm";

const SalesProducts = () => {
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Sample product data - this would come from database in real app
  const product = {
    id: 1,
    name: "Puhastustabletid",
    description: "Professionaalsed puhastustabletid kõikide puhastusseadmete jaoks. Sobivad tekstiilipesuritele, aurupesuritele ja muudele seadmetele.",
    price: "12.99",
    images: [],
    video_url: "",
    manual_text: "Kasutage 1 tabletti 5 liitri vee kohta. Laske tabletil täielikult lahustuda enne kasutamist.",
  };

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

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Images section */}
              <div className="p-6">
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Toote pilt</p>
                </div>
                
                {product.video_url && (
                  <div className="mt-4 aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Toote video</p>
                  </div>
                )}
              </div>

              {/* Product info section */}
              <div className="p-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h2>
                
                <div className="text-3xl font-bold text-primary mb-6">
                  {product.price}€
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Toote kirjeldus</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Kasutamisjuhend</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {product.manual_text}
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button 
                      className="w-full text-lg py-3"
                      onClick={() => setShowBookingForm(true)}
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
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Booking/Purchase Form Modal */}
      <BookingForm
        isOpen={showBookingForm}
        onClose={() => setShowBookingForm(false)}
        productName={product.name}
        startTime="09:00"
        endTime="17:00"
        totalPrice={product.price}
      />

      <Footer />
    </div>
  );
};

export default SalesProducts;