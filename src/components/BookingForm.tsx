import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Smartphone, CreditCard, Mail, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  startDate?: Date;
  endDate?: Date;
  startTime: string;
  endTime: string;
  totalPrice: string;
}

export const BookingForm = ({ 
  isOpen, 
  onClose, 
  productName, 
  startDate, 
  endDate, 
  startTime, 
  endTime, 
  totalPrice 
}: BookingFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [selectedSignatureMethod, setSelectedSignatureMethod] = useState<"mobile-id" | "smart-id" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.email || !formData.address || !agreeToTerms || !selectedSignatureMethod) {
      toast({
        title: "Viga",
        description: "Palun täitke kõik väljad ja nõustuge tingimustega",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate booking process
    setTimeout(() => {
      toast({
        title: "Tellimus edukalt esitatud!",
        description: "Kinnitusmeil saadetakse teie e-posti aadressile",
      });
      setIsSubmitting(false);
      onClose();
      
      // Reset form
      setFormData({ name: "", phone: "", email: "", address: "" });
      setAgreeToTerms(false);
      setSelectedSignatureMethod(null);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Broneerimine
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tellimuse kokkuvõte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Toode:</span>
                <span className="font-medium">{productName}</span>
              </div>
              {startDate && (
                <div className="flex justify-between">
                  <span>Algus:</span>
                  <span>{startDate.toLocaleDateString()} {startTime}</span>
                </div>
              )}
              {endDate && (
                <div className="flex justify-between">
                  <span>Lõpp:</span>
                  <span>{endDate.toLocaleDateString()} {endTime}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Kokku:</span>
                <span>{totalPrice}€</span>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kontaktandmed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nimi *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Teie nimi"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Telefon *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+372 ..."
                />
              </div>
              
              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="teie@email.ee"
                />
              </div>
              
              <div>
                <Label htmlFor="address">Aadress *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Teie aadress"
                />
              </div>
            </CardContent>
          </Card>

          {/* Terms and Signature */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tingimused ja allkirjastamine</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm">
                  Olen nõus kasutajatingimustega
                </Label>
              </div>

              <div>
                <Label className="text-sm font-medium">Allkirjastamisviis *</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <Button
                    type="button"
                    variant={selectedSignatureMethod === "mobile-id" ? "default" : "outline"}
                    onClick={() => setSelectedSignatureMethod("mobile-id")}
                    className="flex items-center justify-center space-x-2"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Mobiil-ID</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant={selectedSignatureMethod === "smart-id" ? "default" : "outline"}
                    onClick={() => setSelectedSignatureMethod("smart-id")}
                    className="flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Smart-ID</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.name || !formData.phone || !formData.email || !formData.address || !agreeToTerms || !selectedSignatureMethod}
            className="w-full bg-primary hover:bg-primary-hover text-lg py-3"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Esitamie...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Esita tellimus</span>
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};