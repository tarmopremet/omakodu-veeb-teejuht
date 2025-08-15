import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Calendar, Wrench, Euro, Clock, SlidersHorizontal } from "lucide-react";

interface EquipmentFiltersProps {
  onSearch: (filters: any) => void;
}

export const EquipmentFilters = ({ onSearch }: EquipmentFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    rentalPeriod: "",
    maxDailyPrice: "",
    maxWeeklyPrice: "",
    deliveryIncluded: false,
    availableOnly: true
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
      category: "",
      rentalPeriod: "",
      maxDailyPrice: "",
      maxWeeklyPrice: "",
      deliveryIncluded: false,
      availableOnly: true
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  return (
    <Card className="shadow-medium">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="flex items-center">
              <Wrench className="w-4 h-4 mr-1" />
              Kategooria
            </Label>
            <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Vali kategooria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="floor-cleaning">Põrande puhastus</SelectItem>
                <SelectItem value="carpet-cleaning">Vaipade puhastus</SelectItem>
                <SelectItem value="pressure-washing">Survepesur</SelectItem>
                <SelectItem value="vacuum">Tolmuimejad</SelectItem>
                <SelectItem value="window-cleaning">Akende puhastus</SelectItem>
                <SelectItem value="industrial">Tööstuslik</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rental Period */}
          <div className="space-y-2">
            <Label htmlFor="rentalPeriod" className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Rendiperiood
            </Label>
            <Select value={filters.rentalPeriod} onValueChange={(value) => handleFilterChange("rentalPeriod", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Vali periood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Päevane</SelectItem>
                <SelectItem value="weekly">Nädalane</SelectItem>
                <SelectItem value="monthly">Kuune</SelectItem>
                <SelectItem value="long-term">Pikaajaline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Daily Price */}
          <div className="space-y-2">
            <Label className="flex items-center">
              <Euro className="w-4 h-4 mr-1" />
              Max päevahind
            </Label>
            <Input
              placeholder="€/päev"
              type="number"
              value={filters.maxDailyPrice}
              onChange={(e) => handleFilterChange("maxDailyPrice", e.target.value)}
            />
          </div>

          {/* Weekly Price */}
          <div className="space-y-2">
            <Label className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Max nädalahind
            </Label>
            <Input
              placeholder="€/nädal"
              type="number"
              value={filters.maxWeeklyPrice}
              onChange={(e) => handleFilterChange("maxWeeklyPrice", e.target.value)}
            />
          </div>
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pt-4 border-t">
            {/* Additional Features */}
            <div className="space-y-3">
              <Label>Lisateenused</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="delivery"
                    checked={filters.deliveryIncluded}
                    onCheckedChange={(checked) => handleFilterChange("deliveryIncluded", checked)}
                  />
                  <Label htmlFor="delivery" className="text-sm">Kohaletoimetamine kaasas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="available"
                    checked={filters.availableOnly}
                    onCheckedChange={(checked) => handleFilterChange("availableOnly", checked)}
                  />
                  <Label htmlFor="available" className="text-sm">Ainult saadaolevad</Label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleSearch} className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Otsi seadmeid
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