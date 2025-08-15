import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RendiIseHeader } from "@/components/RendiIseHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, MapPin, Clock, Euro } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import wurthCleaner from "@/assets/wurth-textile-cleaner.jpg";
import steamCleaner from "@/assets/steam-cleaner-karcher.jpg";
import windowRobot from "@/assets/window-robot-new.jpg";

const BookingPage = () => {
  const { city } = useParams();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    notes: ""
  });

  const products = [
    {
      id: "1",
      name: "TEKSTIILIPESUR 1 (Järve Keskuses)",
      price: "4.5€ / Tund",
      location: `${city}, Pärnu mnt. 238, Järve Keskus`,
      image: wurthCleaner,
      available: true
    },
    {
      id: "2", 
      name: "AURUPESUR (Sikupilli Prismas)",
      price: "3.5€ / Tund",
      location: `${city}, Tartu mnt 87, Sikupilli Prisma`,
      image: steamCleaner,
      available: true
    },
    {
      id: "3",
      name: "AKNAPESURIBOT (Kristiine Keskuses)",
      price: "5.0€ / Tund", 
      location: `${city}, Endla 45, Kristiine Keskus`,
      image: windowRobot,
      available: true
    }
  ];

  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  const handleBooking = () => {
    if (!selectedProduct || !selectedDate || !selectedTime || !duration) {
      alert("Palun täida kõik väljad");
      return;
    }
    
    // Navigate to confirmation page or process booking
    alert("Broneering edukalt tehtud!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <RendiIseHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate("/")}>
            ← Tagasi esilehele
          </Button>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Broneeri seade - {city}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Selection */}
          <div>
            <h2 className="text-xl font-semibold mb-4">1. Vali seade</h2>
            <div className="space-y-4">
              {products.map((product) => (
                <Card 
                  key={product.id} 
                  className={`cursor-pointer transition-all ${
                    selectedProduct === product.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedProduct(product.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {product.location}
                        </p>
                        <p className="text-lg font-bold text-blue-600">{product.price}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Booking Details */}
          <div>
            <h2 className="text-xl font-semibold mb-4">2. Vali aeg</h2>
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Date Selection */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Kuupäev</Label>
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
                        {selectedDate ? format(selectedDate, "dd.MM.yyyy") : "Vali kuupäev"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Selection */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Kellaaeg</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <Label htmlFor="duration" className="text-sm font-medium mb-2 block">
                    Kestus (tundi)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    max="8"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Sisesta tundide arv"
                  />
                </div>

                {/* Customer Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Kontaktandmed</h3>
                  
                  <div>
                    <Label htmlFor="name">Nimi</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Teie nimi"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Telefoninumber"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="E-posti aadress"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Märkused</Label>
                    <Textarea
                      id="notes"
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Lisainfo või erisoovid"
                    />
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleBooking}
                  disabled={!selectedProduct || !selectedDate || !selectedTime || !duration}
                >
                  Kinnita broneering
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;