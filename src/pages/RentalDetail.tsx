import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RendiIseHeader } from "@/components/RendiIseHeader";
import { Footer } from "@/components/Footer";
import { BookingForm } from "@/components/BookingForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { MapPin, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import wurthCleaner from "@/assets/wurth-textile-cleaner.jpg";

const RentalDetail = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  // Auto-set end date to exactly 24h from start date and time
  useEffect(() => {
    if (startDate && !endDate) {
      // Create end date that's exactly 24 hours later
      const endDateTime = new Date(startDate);
      const [hours, minutes] = startTime.split(':').map(Number);
      endDateTime.setHours(hours, minutes, 0, 0);
      endDateTime.setTime(endDateTime.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours
      
      setEndDate(endDateTime);
      setEndTime(startTime); // Same time as start
    }
  }, [startDate, startTime]);

  const loadProduct = async () => {
    if (!slug) return;
    
    try {
      setLoading(true);
      
      // Parse product info from slug to search database
      let productType = "";
      if (slug.includes('tekstiilipesur')) productType = "Tekstiilipesurid";
      else if (slug.includes('aurupesur')) productType = "Aurupesurid";  
      else if (slug.includes('aknapesuribot')) productType = "Aknapesurobotid";
      
      console.log('Loading product with slug:', slug, 'type:', productType);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('category', productType)
        .limit(1);
      
      if (error) {
        console.error('Error loading product:', error);
        throw error;
      }
      
      console.log('Loaded product data:', data);
      
      if (data && data.length > 0) {
        setProduct(data[0]);
      } else {
        console.log('No product found, using fallback');
        // Fallback product
        setProduct({
          name: "Tekstiilipesur",
          description: "Professionaalne tekstiilipesur",
          location: "Tallinn",
          price_per_hour: 4.5,
          price_per_day: 20.99,
          images: null,
          video_url: null
        });
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast({
        title: "Viga",
        description: "Toote andmete laadimine ebaõnnestus",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    if (!startDate || !endDate || !product) return "0.00";

    const buildDateTime = (date: Date, time: string) => {
      const [h, m] = (time || "00:00").split(":").map(Number);
      const d = new Date(date);
      d.setHours(h || 0, m || 0, 0, 0);
      return d;
    };

    const start = buildDateTime(startDate, startTime);
    const end = buildDateTime(endDate, endTime);

    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) return "0.00";

    const hourMs = 1000 * 60 * 60;
    const totalHours = Math.ceil(diffMs / hourMs);

    const perHour = Number(product.price_per_hour) || 0;
    const perDay = Number(product.price_per_day) || perHour * 24;

    let total = 0;

    if (totalHours < 24) {
      total = totalHours <= 4 ? totalHours * perHour : perDay;
    } else {
      const fullDays = Math.floor(totalHours / 24);
      const remainder = totalHours % 24;
      const remainderCost = remainder === 0
        ? 0
        : remainder <= 4
          ? remainder * perHour
          : perDay;
      total = fullDays * perDay + remainderCost;
    }

    return total.toFixed(2);
  };

  const convertYouTubeUrl = (url: string) => {
    if (!url) return null;
    
    // Convert YouTube URLs to embed format
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (videoIdMatch) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    return url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <RendiIseHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Laadime toote andmeid...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <RendiIseHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Toodet ei leitud</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const productImages = product.images || [];
  const hasVideo = product.video_url;
  const embedVideoUrl = convertYouTubeUrl(product.video_url);

  return (
    <div className="min-h-screen bg-gray-50">
      <RendiIseHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images and Videos Section */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Show database images */}
              {productImages.length > 0 ? (
                productImages.map((imageUrl: string, index: number) => (
                  <div 
                    key={`db-image-${index}`} 
                    className="aspect-square bg-white rounded-lg overflow-hidden border cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setShowBookingForm(true)}
                  >
                    <img
                      src={imageUrl}
                      alt={`${product.name} pilt ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log('Image failed to load:', imageUrl);
                        (e.target as HTMLImageElement).src = wurthCleaner;
                      }}
                    />
                  </div>
                ))
              ) : (
                // Fallback image if no database images
                <div 
                  className="aspect-square bg-white rounded-lg overflow-hidden border cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setShowBookingForm(true)}
                >
                  <img
                    src={wurthCleaner}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Show YouTube video if available */}
              {hasVideo && embedVideoUrl && (
                <div className="aspect-square bg-white rounded-lg overflow-hidden border">
                  <iframe
                    src={embedVideoUrl}
                    title={`${product.name} video`}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>

            {/* Product Info Tabs */}
            <Tabs defaultValue="description" className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Kirjeldus</TabsTrigger>
                <TabsTrigger value="manual" disabled={!product.manual_text && !product.manual_url}>Juhend</TabsTrigger>
                <TabsTrigger value="location">Asukoht</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Toote kirjeldus</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {product.description || "Kvaliteetne renditav seade, mis sobib igapäevaseks kasutamiseks."}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="manual" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Juhend</h3>
                    {product.manual_text ? (
                      <div className="space-y-4">
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                          {product.manual_text}
                        </p>
                        {product.manual_url && (
                          <div className="pt-4 border-t">
                            <p className="text-sm text-gray-500 mb-2">Täiendav materjal:</p>
                            <a 
                              href={product.manual_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors"
                            >
                              Ava PDF juhend
                            </a>
                          </div>
                        )}
                      </div>
                    ) : product.manual_url ? (
                      <div className="space-y-4">
                        <p className="text-gray-600">Kasutusjuhend on saadaval PDF-ina.</p>
                        <a 
                          href={product.manual_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors"
                        >
                          Ava kasutusjuhend
                        </a>
                      </div>
                    ) : (
                      <p className="text-gray-500">Kasutusjuhend pole hetkel saadaval.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Asukoht</h3>
                    <div className="space-y-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span className="font-medium">{product.location}</span>
                      </div>
                      <p className="text-gray-600">
                        Seade asub eeltoodud asukohas ja on valmis rendiks. 
                        Palun võtke ühendust broneerimiseks.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>1 tund</span>
                      <span className="font-semibold">{product.price_per_hour}€</span>
                    </div>
                    {product.price_per_day && (
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>1 päev</span>
                        <span className="font-semibold">{product.price_per_day}€</span>
                      </div>
                    )}
                    {product.price_per_week && (
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>1 nädal</span>
                        <span className="font-semibold">{product.price_per_week}€</span>
                      </div>
                    )}
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

            {/* Basic Features */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-3">Omadused</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Professionaalne kvaliteet
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Lihtne kasutada
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    24/7 kättesaadav
                  </li>
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