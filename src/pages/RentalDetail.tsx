import { useParams } from "react-router-dom";
import { RendiIseHeader } from "@/components/RendiIseHeader";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star, Phone } from "lucide-react";

const RentalDetail = () => {
  const { productType, location } = useParams();
  
  // Mock product details based on URL params
  const getProductDetails = () => {
    const productName = productType?.replace(/-/g, ' ') || '';
    const locationName = location?.replace(/-/g, ' ') || '';
    
    return {
      name: `${productName} (${locationName})`,
      price: "4.5€ / Tund",
      location: "Tallinn, Kristiine Keskus",
      rating: 4.8,
      description: "Professionaalne puhastusseade kõigi tekstiilide puhastamiseks. Sobib diivani, madratsi, vaiba ja tugitoolide puhastamiseks.",
      features: [
        "Võimas imemistehnika",
        "Sügav tekstiilipuhastus", 
        "Lihtne kasutada",
        "Kiire kuivamine"
      ]
    };
  };

  const product = getProductDetails();

  return (
    <div className="min-h-screen bg-gray-50">
      <RendiIseHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square bg-white rounded-lg overflow-hidden">
            <img
              src="/src/assets/textile-cleaner-wurth.jpg"
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg p-6">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-medium">{product.rating}</span>
            </div>

            <div className="flex items-center text-muted-foreground mb-6">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{product.location}</span>
            </div>

            <div className="text-4xl font-bold text-primary mb-6">
              {product.price}
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-3">Kirjeldus</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-3">Omadused</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <Button className="w-full bg-primary hover:bg-primary-hover text-lg py-3">
                Rendi kohe
              </Button>
              
              <Button variant="outline" className="w-full flex items-center justify-center">
                <Phone className="w-4 h-4 mr-2" />
                Helista +3725027355
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalDetail;