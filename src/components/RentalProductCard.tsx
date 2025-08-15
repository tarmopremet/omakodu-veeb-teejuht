import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star } from "lucide-react";

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
  return (
    <Card className="overflow-hidden hover:shadow-medium transition-all duration-300 group">
      <div className="aspect-square overflow-hidden">
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

        {product.rating && (
          <div className="flex items-center mb-3">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
        )}
        
        <hr className="my-3" />
        
        <Button 
          className="w-full bg-primary hover:bg-primary-hover"
          disabled={!product.available}
        >
          {product.available ? "Rendi kohe" : "Pole saadaval"}
        </Button>
      </CardContent>
    </Card>
  );
};