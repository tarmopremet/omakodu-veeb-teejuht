import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square, Car, Warehouse } from "lucide-react";

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    address: string;
    city: string;
    price: number;
    rooms: number;
    area: number;
    floor: string;
    image: string;
    hasParking: boolean;
    hasStorage: boolean;
    petsAllowed: boolean;
    isAvailable: boolean;
  };
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-medium hover:-translate-y-1 cursor-pointer">
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant={property.isAvailable ? "default" : "secondary"}>
            {property.isAvailable ? "Saadaval" : "Broneeritud"}
          </Badge>
          {property.petsAllowed && (
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
              Lemmikloomad OK
            </Badge>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <Badge className="bg-primary text-primary-foreground font-semibold text-lg">
            €{property.price}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>
        
        <div className="flex items-center text-muted-foreground mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{property.address}, {property.city}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>{property.rooms} tuba</span>
            </div>
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1" />
              <span>{property.area} m²</span>
            </div>
          </div>
          <span className="text-xs">{property.floor}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {property.hasParking && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Car className="w-3 h-3 mr-1" />
              <span>Parkla</span>
            </div>
          )}
          {property.hasStorage && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Warehouse className="w-3 h-3 mr-1" />
              <span>Panipaik</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};