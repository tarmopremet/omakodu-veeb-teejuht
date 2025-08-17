import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Trash2, Eye, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageManagerProps {
  onImageUploaded?: (url: string) => void;
}

export const ImageManager = ({ onImageUploaded }: ImageManagerProps) => {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const { toast } = useToast();

  // Load existing images on component mount
  useEffect(() => {
    loadExistingImages();
  }, []);

  const loadExistingImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from('product-images')
        .list('products', {
          limit: 100,
          offset: 0,
        });

      if (error) throw error;

      const imageUrls = data
        .filter(file => file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/))
        .map(file => {
          const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(`products/${file.name}`);
          return urlData.publicUrl;
        });

      setUploadedImages(imageUrls);
    } catch (error: any) {
      toast({
        title: "Viga",
        description: `Piltide laadimisel tekkis viga: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Kopeeritud!",
        description: "URL on lõikelauale kopeeritud",
      });
    } catch (error) {
      toast({
        title: "Viga",
        description: "URL kopeerimine ebaõnnestus",
        variant: "destructive",
      });
    }
  };

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Sa pead valima faili üleslaadimiseks.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const imageUrl = data.publicUrl;
      
      setUploadedImages(prev => [...prev, imageUrl]);
      
      if (onImageUploaded) {
        onImageUploaded(imageUrl);
      }

      toast({
        title: "Õnnestus!",
        description: "Pilt on üles laaditud",
      });

    } catch (error: any) {
      toast({
        title: "Viga",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageUrl: string) => {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/');
      const filePath = urlParts.slice(-2).join('/'); // products/filename.ext
      
      const { error } = await supabase.storage
        .from('product-images')
        .remove([filePath]);

      if (error) throw error;

      setUploadedImages(prev => prev.filter(url => url !== imageUrl));
      
      toast({
        title: "Õnnestus!",
        description: "Pilt on kustutatud",
      });

    } catch (error: any) {
      toast({
        title: "Viga",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="image-upload" className="text-base font-medium">
              Lae üles uus pilt
            </Label>
            <div className="mt-2">
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={uploadImage}
                disabled={uploading}
                className="cursor-pointer"
              />
            </div>
            {uploading && (
              <p className="text-sm text-gray-500 mt-2">Laadin üles...</p>
            )}
          </div>

          {loading && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">Laadin olemasolevaid pilte...</p>
            </div>
          )}

          {!loading && uploadedImages.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Kõik pildid ({uploadedImages.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {uploadedImages.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Pilt ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => copyToClipboard(imageUrl)}
                          title="Kopeeri URL"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => window.open(imageUrl, '_blank')}
                          title="Vaata täissuuruses"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteImage(imageUrl)}
                          title="Kustuta pilt"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Input
                        value={imageUrl}
                        readOnly
                        className="text-xs"
                        onClick={(e) => e.currentTarget.select()}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && uploadedImages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Ühtegi pilti ei leitud. Lae üles esimene pilt!</p>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Kuidas kasutada Visual Edit-iga:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>1. Lae üles uus pilt või vali olemasolev pilt</li>
              <li>2. Vajuta "Kopeeri URL" nuppu (koopia ikoon)</li>
              <li>3. Mine lehele, kus soovid pilti muuta</li>
              <li>4. Klõpsa "Visual Edit" nuppu chatis</li>
              <li>5. Vali pilt, mida soovid asendada</li>
              <li>6. Asenda pildi URL kopeeritud URL-iga</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};