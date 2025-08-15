import { useState } from "react";
import { useParams } from "react-router-dom";
import { RendiIseHeader } from "@/components/RendiIseHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Clock, Star, Phone, CalendarIcon, Upload, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import wurthCleaner from "@/assets/wurth-textile-cleaner.jpg";

const RentalDetail = () => {
  const { slug } = useParams();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedHours, setSelectedHours] = useState<number>(1);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState(["/lovable-uploads/6e499b97-cfc1-4c42-9c13-54c706a3f46d.png"]);

  // Parse product details from slug
  const getProductDetails = () => {
    if (!slug) return { name: "Toode", price: "4.5€ / Tund", location: "Tallinn", rating: 4.8 };
    
    const productType = slug.includes('tekstiili') ? 'Tekstiilipesur' : 
                       slug.includes('auru') ? 'Aurupesur' : 'Aknapesuribot';
    const locationName = slug.includes('kristiine') ? 'Kristiine Keskus' : 'Tallinn';
    
    return {
      name: `${productType} (${locationName})`,
      price: "4.5€ / Tund",
      location: "Tallinn, Kristiine Keskus",
      rating: 4.8,
      description: "Professionaalne Würth tekstiilipesur RS 162. Sobib diivani, madratsi, vaiba ja tugitoolide sügavaks puhastamiseks.",
      features: [
        "Võimas 1200W mootor",
        "Sügav tekstiilipuhastus", 
        "Lihtne kasutada",
        "Kiire kuivamine",
        "Professionaalne kvaliteet"
      ],
      priceList: [
        { duration: "1 tund", price: "4.50€" },
        { duration: "4 tundi", price: "16.00€" },
        { duration: "1 päev (8h)", price: "30.00€" },
        { duration: "1 nädal", price: "180.00€" }
      ]
    };
  };

  const product = getProductDetails();

  const calculatePrice = () => {
    const hourlyRate = 4.5;
    return (hourlyRate * selectedHours).toFixed(2);
  };

  const addImage = () => {
    // Placeholder for image upload functionality
    const newImage = `https://via.placeholder.com/400x400?text=Pilt+${images.length + 1}`;
    setImages([...images, newImage]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <RendiIseHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images Section */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4 mb-6">
              {images.map((image, index) => (
                <div key={index} className="aspect-square bg-white rounded-lg overflow-hidden border">
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <Button
                variant="outline"
                className="aspect-square border-2 border-dashed border-gray-300 hover:border-primary"
                onClick={addImage}
              >
                <div className="text-center">
                  <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <span className="text-sm text-gray-500">Lisa pilt</span>
                </div>
              </Button>
            </div>

            {/* Description Editor */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Toote kirjeldus</h3>
                <Textarea
                  placeholder="Kirjutage toote kirjeldus..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px]"
                />
              </CardContent>
            </Card>
          </div>

          {/* Booking Section */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
                
                <div className="flex items-center mb-4">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium">{product.rating}</span>
                </div>

                <div className="flex items-center text-muted-foreground mb-6">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{product.location}</span>
                </div>

                {/* Price List */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Hinnakiri</h4>
                  <div className="space-y-2">
                    {product.priceList.map((item, index) => (
                      <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>{item.duration}</span>
                        <span className="font-semibold">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calendar */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Vali kuupäev</h4>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Vali kuupäev</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Hours Selection */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Tundide arv</h4>
                  <select 
                    value={selectedHours} 
                    onChange={(e) => setSelectedHours(Number(e.target.value))}
                    className="w-full p-2 border rounded-md"
                  >
                    {[1,2,3,4,5,6,7,8].map(hour => (
                      <option key={hour} value={hour}>{hour} tund{hour > 1 ? 'i' : ''}</option>
                    ))}
                  </select>
                </div>

                {/* Total Price */}
                <div className="text-2xl font-bold text-primary mb-6">
                  Kokku: {calculatePrice()}€
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full bg-primary hover:bg-primary-hover text-lg py-3"
                    disabled={!selectedDate}
                  >
                    Broneeri ({selectedHours}h)
                  </Button>
                  
                  <Button variant="outline" className="w-full flex items-center justify-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Helista +3725027355
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-3">Omadused</h4>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalDetail;