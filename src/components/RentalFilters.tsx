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
    const selectedCity = locations.find(l => l.label === filters.location)?.city || "Tallinn";
    const citySlug = selectedCity.toLowerCase();
    navigate(`/et/broneeri/${citySlug}`);
  };

  const locations = [
    { label: "Kõik asukohad", city: "Tallinn" },
    { label: "Pirita Selver – Rummu tee 4", city: "Tallinn" },
    { label: "Kadaka Selver – Kadaka tee 56a", city: "Tallinn" },
    { label: "Lasnamäe Prisma – Mustakivi tee 17", city: "Tallinn" },
    { label: "Sikupilli Prisma – Tartu mnt 87", city: "Tallinn" },
    { label: "Kristiine Keskus – Endla 45", city: "Tallinn" },
    { label: "Järve Keskus – Pärnu mnt 238", city: "Tallinn" }
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
                  <SelectItem key={location.label} value={location.label}>
                    {location.label}
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