import { useState } from "react";
import { useParams } from "react-router-dom";
import { RendiIseHeader } from "@/components/RendiIseHeader";
import { Footer } from "@/components/Footer";
import { BookingForm } from "@/components/BookingForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import wurthCleaner from "@/assets/wurth-textile-cleaner.jpg";

const RentalDetail = () => {
  const { slug } = useParams();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState(["/lovable-uploads/6e499b97-cfc1-4c42-9c13-54c706a3f46d.png"]);
  const [videos, setVideos] = useState<string[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Parse product details from slug
  const getProductDetails = () => {
    if (!slug) return { name: "Toode", price: "4.5€ / Tund", location: "Tallinn" };
    
    const productType = slug.includes('tekstiili') ? 'Tekstiilipesur' : 
                       slug.includes('auru') ? 'Aurupesur' : 'Aknapesuribot';
    const locationName = slug.includes('kristiine') ? 'Kristiine Keskus' : 'Tallinn';
    
    return {
      name: `${productType} (${locationName})`,
      price: "4.5€ / Tund",
      location: "Tallinn, Kristiine Keskus",
      description: "Professionaalne Würth tekstiilipesur RS 162. Sobib diivani, madratsi, vaiba ja tugitoolide sügavaks puhastamiseks.",
      features: [
        "Võimas 1200W mootor",
        "Sügav tekstiilipuhastus", 
        "Lihtne kasutada",
        "Kiire kuivamine",
        "Professionaalne kvaliteet"
      ],
      priceList: [
        { duration: "1 tund", price: "4.35€" },
        { duration: "1 päev", price: "20.99€" }
      ]
    };
  };

  const product = getProductDetails();

  const calculatePrice = () => {
    if (!startDate || !endDate) return "0.00";
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return "4.35"; // 1 hour rate
    } else {
      return (diffDays * 20.99).toFixed(2); // daily rate
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      
      if (type === 'image') {
        setImages(prev => [...prev, url]);
      } else {
        setVideos(prev => [...prev, url]);
      }
    }
  };

  const handleImageDelete = (index: number, type: 'image' | 'video') => {
    if (type === 'image') {
      setImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setVideos(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <RendiIseHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images and Videos Section */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4 mb-6">
              {images.map((image, index) => (
                <div key={`image-${index}`} className="relative aspect-square bg-white rounded-lg overflow-hidden border group">
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleImageDelete(index, 'image')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {videos.map((video, index) => (
                <div key={`video-${index}`} className="relative aspect-square bg-white rounded-lg overflow-hidden border group">
                  <video
                    src={video}
                    className="w-full h-full object-cover"
                    controls
                    muted
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleImageDelete(index, 'video')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col">
                <label className="flex-1 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'image')}
                    className="hidden"
                  />
                  <Plus className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Lisa pilt</span>
                </label>
                <div className="border-t border-gray-200">
                  <label className="flex-1 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors py-2">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e, 'video')}
                      className="hidden"
                    />
                    <span className="text-xs text-gray-500">Lisa video</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Description, Instructions, Location Tabs */}
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="description">Kirjeldus</TabsTrigger>
                    <TabsTrigger value="instructions">Juhend</TabsTrigger>
                    <TabsTrigger value="location">Asukoht</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="description" className="mt-4">
                    <div>
                      <Label htmlFor="description" className="text-lg font-semibold mb-3 block">Toote kirjeldus</Label>
                      <Textarea
                        id="description"
                        placeholder="Kirjutage toote kirjeldus..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[150px]"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="instructions" className="mt-4">
                    <div>
                      <Label htmlFor="instructions" className="text-lg font-semibold mb-3 block">Kasutamisjuhend</Label>
                      <Textarea
                        id="instructions"
                        placeholder="Kirjutage kasutamisjuhend..."
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        className="min-h-[150px]"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="location" className="mt-4">
                    <div>
                      <Label htmlFor="location" className="text-lg font-semibold mb-3 block">Asukoht</Label>
                      <Textarea
                        id="location"
                        placeholder="Kirjutage täpne asukoht ja juhised..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="min-h-[150px]"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Booking Section */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold mb-4">{product.name}</h1>

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

                {/* Date and Time Selection */}
                <div className="mb-6 space-y-4">
                  <h4 className="font-semibold">Algus kuupäev ja kellaaeg</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "dd.MM") : <span>Kuupäev</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  
                  <h4 className="font-semibold">Lõpp kuupäev ja kellaaeg</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "dd.MM") : <span>Kuupäev</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={(date) => date < new Date() || (startDate && date < startDate)}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>

                {/* Total Price */}
                <div className="text-2xl font-bold text-primary mb-6">
                  Kokku: {calculatePrice()}€
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full bg-primary hover:bg-primary-hover text-lg py-3"
                    disabled={!startDate || !endDate}
                    onClick={() => setShowBookingForm(true)}
                  >
                    Broneeri
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

      {/* Booking Form Modal */}
      <BookingForm
        isOpen={showBookingForm}
        onClose={() => setShowBookingForm(false)}
        productName={product.name}
        startDate={startDate}
        endDate={endDate}
        startTime={startTime}
        endTime={endTime}
        totalPrice={calculatePrice()}
      />
      
      <Footer />
    </div>
  );
};

export default RentalDetail;