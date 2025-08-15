import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Tag } from "lucide-react";

interface RentalFiltersProps {
  onFilterChange?: (filters: any) => void;
}

export const RentalFilters = ({ onFilterChange }: RentalFiltersProps) => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    location: "",
    startDate: "",
    endDate: "",
    category: "",
    searchTerm: ""
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleBooking = () => {
    // Get selected location to determine city
    const cityFromLocation = filters.location.split(',')[0] || "Tallinn";
    navigate(`/broneeri/${cityFromLocation.toLowerCase()}`);
  };

  const locations = [
    "Kõik",
    "Tallinn, Rummu tee 4, Pirita selver",
    "Tallinn, Kadaka tee 56a, Kadaka Selver", 
    "Tallinn, Mustakivi tee 17, Lasnamäe Prisma",
    "Tallinn, Tartu mnt 87, Sikupilli Prisma",
    "Tallinn, Endla 45, Kristiine Keskus",
    "Tallinn, Pärnu mnt. 238, Järve Keskus"
  ];

  const categories = [
    "Kõik",
    "Tekstiiliipesurid", 
    "Aurupesurid",
    "Aknapesurobotid",
    "Aknapesurid",
    "Tolmuimejad"
  ];

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Location */}
          <div className="space-y-2">
            <Label className="flex items-center text-sm font-medium">
              <MapPin className="w-4 h-4 mr-1" />
              Asukoht
            </Label>
            <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Vali asukoht" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label className="flex items-center text-sm font-medium">
              <Calendar className="w-4 h-4 mr-1" />
              Rendi algus
            </Label>
            <Input 
              type="date" 
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label className="flex items-center text-sm font-medium">
              <Calendar className="w-4 h-4 mr-1" />
              Rendi lõpp
            </Label>
            <Input 
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <Label className="flex items-center text-sm font-medium">
              <Tag className="w-4 h-4 mr-1" />
              Kategooriad
            </Label>
            <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Vali kategooria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Booking Button */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Renditoode
            </Label>
            <Button className="w-full h-10" size="default" onClick={handleBooking}>
              Broneeri
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};