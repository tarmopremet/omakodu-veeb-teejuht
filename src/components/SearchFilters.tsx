import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, Home, Users, Euro, Maximize, SlidersHorizontal } from "lucide-react";

interface SearchFiltersProps {
  onSearch: (filters: any) => void;
}

export const SearchFilters = ({ onSearch }: SearchFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    propertyType: "",
    rooms: "",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    hasParking: false,
    hasStorage: false,
    petsAllowed: false
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const resetFilters = () => {
    const resetFilters = {
      location: "",
      propertyType: "",
      rooms: "",
      minPrice: "",
      maxPrice: "",
      minArea: "",
      maxArea: "",
      hasParking: false,
      hasStorage: false,
      petsAllowed: false
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  return (
    <Card className="shadow-medium">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              Asukoht
            </Label>
            <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Vali linn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tallinn">Tallinn</SelectItem>
                <SelectItem value="tartu">Tartu</SelectItem>
                <SelectItem value="parnu">Pärnu</SelectItem>
                <SelectItem value="narva">Narva</SelectItem>
                <SelectItem value="viljandi">Viljandi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Property Type */}
          <div className="space-y-2">
            <Label htmlFor="propertyType" className="flex items-center">
              <Home className="w-4 h-4 mr-1" />
              Kinnisvara tüüp
            </Label>
            <Select value={filters.propertyType} onValueChange={(value) => handleFilterChange("propertyType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Vali tüüp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Korter</SelectItem>
                <SelectItem value="house">Maja</SelectItem>
                <SelectItem value="room">Tuba</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rooms */}
          <div className="space-y-2">
            <Label htmlFor="rooms" className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Tubade arv
            </Label>
            <Select value={filters.rooms} onValueChange={(value) => handleFilterChange("rooms", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Vali tubade arv" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 tuba</SelectItem>
                <SelectItem value="2">2 tuba</SelectItem>
                <SelectItem value="3">3 tuba</SelectItem>
                <SelectItem value="4">4 tuba</SelectItem>
                <SelectItem value="5+">5+ tuba</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <Label className="flex items-center">
              <Euro className="w-4 h-4 mr-1" />
              Hind (€)
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="Min"
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              />
              <Input
                placeholder="Max"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pt-4 border-t">
            {/* Area Range */}
            <div className="space-y-2">
              <Label className="flex items-center">
                <Maximize className="w-4 h-4 mr-1" />
                Pindala (m²)
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  value={filters.minArea}
                  onChange={(e) => handleFilterChange("minArea", e.target.value)}
                />
                <Input
                  placeholder="Max"
                  type="number"
                  value={filters.maxArea}
                  onChange={(e) => handleFilterChange("maxArea", e.target.value)}
                />
              </div>
            </div>

            {/* Additional Features */}
            <div className="space-y-3">
              <Label>Lisavõimalused</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="parking"
                    checked={filters.hasParking}
                    onCheckedChange={(checked) => handleFilterChange("hasParking", checked)}
                  />
                  <Label htmlFor="parking" className="text-sm">Parkimiskoht</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="storage"
                    checked={filters.hasStorage}
                    onCheckedChange={(checked) => handleFilterChange("hasStorage", checked)}
                  />
                  <Label htmlFor="storage" className="text-sm">Panipaik</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pets"
                    checked={filters.petsAllowed}
                    onCheckedChange={(checked) => handleFilterChange("petsAllowed", checked)}
                  />
                  <Label htmlFor="pets" className="text-sm">Lemmikloomad lubatud</Label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleSearch} className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Otsi
          </Button>
          <Button variant="outline" onClick={resetFilters}>
            Lähtesta
          </Button>
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {isExpanded ? "Vähem filtreid" : "Rohkem filtreid"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};