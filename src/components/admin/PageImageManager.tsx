import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PageImage {
  id: string;
  page_name: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  is_active: boolean;
}

const pageOptions = [
  { value: "tekstiilipesuri", label: "Tekstiilipesuri rent" },
  { value: "aurupesurid", label: "Aurupesurid" },
  { value: "aknapesurobot", label: "Aknapesurobot" },
  { value: "tolmuimejad", label: "Tolmuimejad" },
];

export const PageImageManager = () => {
  const [images, setImages] = useState<PageImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<string>("tekstiilipesuri");
  const { toast } = useToast();

  useEffect(() => {
    loadPageImages();
  }, [selectedPage]);

  const loadPageImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('page_images')
        .select('*')
        .eq('page_name', selectedPage)
        .order('display_order');

      if (error) throw error;
      setImages(data || []);
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

  const addNewImage = () => {
    const newImage: PageImage = {
      id: `temp-${Date.now()}`,
      page_name: selectedPage,
      image_url: "",
      alt_text: "",
      display_order: images.length + 1,
      is_active: true,
    };
    setImages([...images, newImage]);
  };

  const updateImage = (id: string, field: keyof PageImage, value: any) => {
    setImages(images.map(img => 
      img.id === id ? { ...img, [field]: value } : img
    ));
  };

  const deleteImage = async (id: string) => {
    if (id.startsWith('temp-')) {
      setImages(images.filter(img => img.id !== id));
      return;
    }

    try {
      const { error } = await supabase
        .from('page_images')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setImages(images.filter(img => img.id !== id));
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

  const saveImage = async (image: PageImage) => {
    if (!image.image_url.trim()) {
      toast({
        title: "Viga",
        description: "Pildi URL on kohustuslik",
        variant: "destructive",
      });
      return;
    }

    try {
      if (image.id.startsWith('temp-')) {
        // Insert new image
        const { data, error } = await supabase
          .from('page_images')
          .insert({
            page_name: image.page_name,
            image_url: image.image_url,
            alt_text: image.alt_text,
            display_order: image.display_order,
            is_active: image.is_active,
          })
          .select()
          .single();

        if (error) throw error;

        // Update local state with real ID
        setImages(images.map(img => 
          img.id === image.id ? { ...data } : img
        ));
      } else {
        // Update existing image
        const { error } = await supabase
          .from('page_images')
          .update({
            image_url: image.image_url,
            alt_text: image.alt_text,
            display_order: image.display_order,
            is_active: image.is_active,
          })
          .eq('id', image.id);

        if (error) throw error;
      }

      toast({
        title: "Õnnestus!",
        description: "Pilt on salvestatud",
      });
    } catch (error: any) {
      toast({
        title: "Viga",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">Laadin pilte...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lehekülgede pildid</CardTitle>
        <div className="w-full max-w-xs">
          <Label>Vali lehekülg</Label>
          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={addNewImage} className="mb-4">
          <Plus className="w-4 h-4 mr-2" />
          Lisa uus pilt
        </Button>

        {images.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Sellel lehel pole veel pilte. Lisa esimene pilt!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {images.map((image) => (
              <div key={image.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Pilt #{image.display_order}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => saveImage(image)}
                      disabled={!image.image_url.trim()}
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteImage(image.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Pildi URL *</Label>
                    <Input
                      value={image.image_url}
                      onChange={(e) => updateImage(image.id, 'image_url', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label>Alt tekst</Label>
                    <Input
                      value={image.alt_text || ""}
                      onChange={(e) => updateImage(image.id, 'alt_text', e.target.value)}
                      placeholder="Pildi kirjeldus"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <Label>Järjekord</Label>
                    <Input
                      type="number"
                      value={image.display_order}
                      onChange={(e) => updateImage(image.id, 'display_order', parseInt(e.target.value))}
                      className="w-20"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={image.is_active}
                      onChange={(e) => updateImage(image.id, 'is_active', e.target.checked)}
                    />
                    <Label>Aktiivne</Label>
                  </div>
                </div>

                {image.image_url && (
                  <div className="mt-2">
                    <img
                      src={image.image_url}
                      alt={image.alt_text || "Preview"}
                      className="w-32 h-24 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Juhised:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>1. Vali lehekülg, mille pilte soovid hallata</li>
            <li>2. Lisa uusi pilte või muuda olemasolevaid</li>
            <li>3. Kasuta "Pildid" tabi üles laaditud piltide URL-ide saamiseks</li>
            <li>4. Salvesta muudatused enne lehekülje vahetamist</li>
            <li>5. Pildid kuvatakse leheküljel järjekorras</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};