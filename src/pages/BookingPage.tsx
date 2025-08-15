import { useState } from "react";
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
import wurthCleaner from "@/assets/wurth-textile-cleaner.jpg";
import steamCleaner from "@/assets/steam-cleaner-karcher.jpg";
import windowRobot from "@/assets/window-robot-new.jpg";

const BookingPage = () => {
  const { city } = useParams();
  const navigate = useNavigate();

  const products = [
    {
      id: "1",
      name: "TEKSTIILIPESUR 1",
      description: "Järve Keskuses pangaautomaatide juures",
      price: "4.5€ / Tund",
      location: `${city}, Pärnu mnt. 238, Järve Keskus`,
      image: wurthCleaner,
      available: true,
      slug: "tekstiilipesur-asukohaga-jarve-keskus"
    },
    {
      id: "2", 
      name: "AURUPESUR",
      description: "Sikupilli Prismas",
      price: "3.5€ / Tund",
      location: `${city}, Tartu mnt 87, Sikupilli Prisma`,
      image: steamCleaner,
      available: true,
      slug: "aurupesur-asukohaga-sikupilli-prisma"
    },
    {
      id: "3",
      name: "AKNAPESURIBOT",
      description: "Kristiine Keskuses",
      price: "5.0€ / Tund", 
      location: `${city}, Endla 45, Kristiine Keskus`,
      image: windowRobot,
      available: true,
      slug: "aknapesuribot-asukohaga-kristiine-keskus"
    },
    {
      id: "4",
      name: "TEKSTIILIPESUR 2",
      description: "Kadaka Selveris",
      price: "4.5€ / Tund",
      location: `${city}, Kadaka tee 56a, Kadaka Selver`,
      image: wurthCleaner,
      available: true,
      slug: "tekstiilipesur-asukohaga-kadaka-selver"
    },
    {
      id: "5",
      name: "AURUPESUR 2",
      description: "Lasnamäe Prismas",
      price: "3.5€ / Tund",
      location: `${city}, Mustakivi tee 17, Lasnamäe Prisma`,
      image: steamCleaner,
      available: false,
      slug: "aurupesur-asukohaga-lasnamae-prisma"
    },
    {
      id: "6",
      name: "TEKSTIILIPESUR 3",
      description: "Pirita Selveris",
      price: "4.5€ / Tund",
      location: `${city}, Rummu tee 4, Pirita Selver`,
      image: wurthCleaner,
      available: true,
      slug: "tekstiilipesur-asukohaga-pirita-selver"
    }
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
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
                      className="w-full h-48 object-cover rounded-lg mb-4"
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
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default BookingPage;