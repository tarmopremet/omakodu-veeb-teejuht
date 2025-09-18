import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface RentalProductCardProps {
  product: {
    id: string;
    name: string;
    price: string;
    location: string;
    image: string;
    rating?: number;
    available: boolean;
  };
}

export const RentalProductCard = ({ product }: RentalProductCardProps) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const cities = [
    { name: "Tallinn", href: "/tallinn" },
    { name: "Tartu", href: "/tartu" },
    { name: "Pärnu", href: "/parnu" },
    { name: "Rakvere", href: "/rakvere" },
    { name: "Saku", href: "/saku" }
  ];

  const handleCityClick = (city: typeof cities[0]) => {
    navigate(city.href);
    setShowDropdown(false);
  };

  const handleRentalClick = () => {
    console.log('Rental click:', product.name);

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
      if (!loc) return 'kristiine-keskus';
      if (loc.includes('–')) return loc.split('–')[0].trim();
      const parts = loc.split(',');
      return parts[parts.length - 1].trim();
    };

    const productType = product.name.toLowerCase().includes('tekstiili') ? 'tekstiilipesur' : 
                       product.name.toLowerCase().includes('auru') ? 'aurupesur' : 'aknapesuribot';
    const placeSlug = slugify(extractPlace(product.location || ''));
    const path = `/et/rendi/${productType}-asukohaga-${placeSlug}`;
    console.log('Navigating to:', path);
    navigate(path);
  };
  return (
    <Card className="overflow-hidden hover:shadow-medium transition-all duration-300 group">
      <div className="aspect-[4/3] overflow-hidden cursor-pointer" onClick={handleRentalClick}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="text-2xl font-bold text-primary mb-3">
          {product.price}
        </div>
        
        {product.location && (
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="line-clamp-1">{product.location}</span>
          </div>
        )}
        
        <hr className="my-3" />
        
        <div className="space-y-3">
          <Button 
            className="w-full bg-primary hover:bg-primary-hover"
            disabled={!product.available}
            onClick={handleRentalClick}
          >
            {product.available ? "Vaata toodet" : "Pole saadaval"}
          </Button>
          
          {product.available && (
            <div className="relative">
              <Button 
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground flex items-center justify-center gap-2"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <MapPin className="w-4 h-4" />
                Broneeri kohe
                <ChevronDown className="w-4 h-4" />
              </Button>
              
              {showDropdown && (
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
      </CardContent>
    </Card>
  );
};