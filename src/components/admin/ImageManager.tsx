import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Trash2, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageManagerProps {
  onImageUploaded?: (url: string) => void;
}

export const ImageManager = ({ onImageUploaded }: ImageManagerProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const { toast } = useToast();

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

          {uploadedImages.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Üleslaaditud pildid</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {uploadedImages.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Üleslaaditud pilt ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => window.open(imageUrl, '_blank')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteImage(imageUrl)}
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

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Kuidas kasutada:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>1. Lae üles pilt kasutades ülalolevat vormi</li>
              <li>2. Kopeeri pildi URL (see ilmub automaatselt peale üleslaadimist)</li>
              <li>3. Admin paneelil toodetes lisa see URL toote piltide sektsiooni</li>
              <li>4. Või kasuta seda URL-i otseselt koodis</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};