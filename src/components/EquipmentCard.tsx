import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Star, Truck, Shield } from "lucide-react";

interface EquipmentCardProps {
  equipment: {
    id: string;
    name: string;
    category: string;
    dailyPrice: number;
    weeklyPrice: number;
    image: string;
    isAvailable: boolean;
    rating: number;
    features: string[];
    deliveryIncluded: boolean;
  };
}

export const EquipmentCard = ({ equipment }: EquipmentCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-medium hover:-translate-y-1 cursor-pointer">
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={equipment.image}
          alt={equipment.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant={equipment.isAvailable ? "default" : "secondary"}>
            {equipment.isAvailable ? "Saadaval" : "Renditud"}
          </Badge>
          {equipment.deliveryIncluded && (
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
              <Truck className="w-3 h-3 mr-1" />
              Kohaletoimetamine
            </Badge>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <Badge className="bg-primary text-primary-foreground font-semibold">
            €{equipment.dailyPrice}/päev
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs">
            {equipment.category}
          </Badge>
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{equipment.rating}</span>
          </div>
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{equipment.name}</h3>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>€{equipment.weeklyPrice}/nädal</span>
          </div>
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-1" />
            <span>Kindlustatud</span>
          </div>
        </div>
        
        <div className="space-y-1 mb-4">
          {equipment.features.slice(0, 2).map((feature, index) => (
            <div key={index} className="text-xs text-muted-foreground flex items-center">
              <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
              {feature}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            <Calendar className="w-4 h-4 mr-1" />
            Rendi
          </Button>
          <Button variant="outline" size="sm">
            <Clock className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};