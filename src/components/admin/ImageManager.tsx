import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Trash2, Eye, Copy, Save, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageManagerProps {
  onImageUploaded?: (url: string) => void;
}

interface ImageMetadata {
  id: string;
  image_url: string;
  alt_text: string | null;
  description: string | null;
}

export const ImageManager = ({ onImageUploaded }: ImageManagerProps) => {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imageMetadata, setImageMetadata] = useState<{ [key: string]: ImageMetadata }>({});
  const [editingAlt, setEditingAlt] = useState<{ [key: string]: boolean }>({});
  const [tempAltTexts, setTempAltTexts] = useState<{ [key: string]: string }>({});
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
      
      // Load metadata for existing images
      await loadImageMetadata(imageUrls);
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

  const loadImageMetadata = async (imageUrls: string[]) => {
    try {
      const { data, error } = await supabase
        .from('image_metadata')
        .select('*')
        .in('image_url', imageUrls);

      if (error) throw error;

      const metadataMap: { [key: string]: ImageMetadata } = {};
      data?.forEach(item => {
        metadataMap[item.image_url] = item;
      });
      
      setImageMetadata(metadataMap);
    } catch (error: any) {
      console.error('Error loading image metadata:', error);
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
      
      // Create initial metadata entry
      try {
        await supabase
          .from('image_metadata')
          .insert({
            image_url: imageUrl,
            alt_text: '',
            description: ''
          });
      } catch (metaError: any) {
        console.error('Error creating metadata:', metaError);
      }
      
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

      // Also delete metadata
      await supabase
        .from('image_metadata')
        .delete()
        .eq('image_url', imageUrl);

      setUploadedImages(prev => prev.filter(url => url !== imageUrl));
      setImageMetadata(prev => {
        const newMetadata = { ...prev };
        delete newMetadata[imageUrl];
        return newMetadata;
      });
      
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

  const startEditingAlt = (imageUrl: string) => {
    setEditingAlt(prev => ({ ...prev, [imageUrl]: true }));
    setTempAltTexts(prev => ({ 
      ...prev, 
      [imageUrl]: imageMetadata[imageUrl]?.alt_text || '' 
    }));
  };

  const cancelEditingAlt = (imageUrl: string) => {
    setEditingAlt(prev => ({ ...prev, [imageUrl]: false }));
    setTempAltTexts(prev => {
      const newTexts = { ...prev };
      delete newTexts[imageUrl];
      return newTexts;
    });
  };

  const saveAltText = async (imageUrl: string) => {
    try {
      const altText = tempAltTexts[imageUrl] || '';
      
      // Check if metadata exists
      const existingMetadata = imageMetadata[imageUrl];
      
      if (existingMetadata) {
        // Update existing metadata
        const { error } = await supabase
          .from('image_metadata')
          .update({ alt_text: altText })
          .eq('id', existingMetadata.id);
          
        if (error) throw error;
        
        setImageMetadata(prev => ({
          ...prev,
          [imageUrl]: { ...existingMetadata, alt_text: altText }
        }));
      } else {
        // Create new metadata
        const { data, error } = await supabase
          .from('image_metadata')
          .insert({
            image_url: imageUrl,
            alt_text: altText,
            description: ''
          })
          .select()
          .single();
          
        if (error) throw error;
        
        setImageMetadata(prev => ({
          ...prev,
          [imageUrl]: data
        }));
      }
      
      setEditingAlt(prev => ({ ...prev, [imageUrl]: false }));
      setTempAltTexts(prev => {
        const newTexts = { ...prev };
        delete newTexts[imageUrl];
        return newTexts;
      });
      
      toast({
        title: "Õnnestus!",
        description: "Alt tekst on salvestatud",
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
                  <div key={index} className="relative group border rounded-lg p-3">
                    <img
                      src={imageUrl}
                      alt={imageMetadata[imageUrl]?.alt_text || `Pilt ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
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
                    
                    <div className="mt-3 space-y-2">
                      <div>
                        <Label className="text-xs text-gray-600">URL:</Label>
                        <Input
                          value={imageUrl}
                          readOnly
                          className="text-xs"
                          onClick={(e) => e.currentTarget.select()}
                        />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <Label className="text-xs text-gray-600">Alt tekst:</Label>
                          {!editingAlt[imageUrl] ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEditingAlt(imageUrl)}
                              title="Muuda alt teksti"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          ) : (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => saveAltText(imageUrl)}
                                title="Salvesta"
                              >
                                <Save className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => cancelEditingAlt(imageUrl)}
                                title="Tühista"
                              >
                                ×
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        {editingAlt[imageUrl] ? (
                          <Input
                            value={tempAltTexts[imageUrl] || ''}
                            onChange={(e) => setTempAltTexts(prev => ({
                              ...prev,
                              [imageUrl]: e.target.value
                            }))}
                            placeholder="Sisesta alt tekst..."
                            className="text-xs"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                saveAltText(imageUrl);
                              } else if (e.key === 'Escape') {
                                cancelEditingAlt(imageUrl);
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          <div className="text-xs text-gray-500 min-h-[20px] p-1 border rounded bg-gray-50">
                            {imageMetadata[imageUrl]?.alt_text || 'Alt tekst puudub'}
                          </div>
                        )}
                      </div>
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
            <h4 className="font-medium text-blue-900 mb-2">Kuidas kasutada:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>1. Lae üles uus pilt või vali olemasolev pilt</li>
              <li>2. Lisa alt tekst pildile, klõpsates redigeerimisnuppu</li>
              <li>3. Vajuta "Kopeeri URL" nuppu (koopia ikoon)</li>
              <li>4. Visual Edit jaoks: Mine lehele → klõpsa "Visual Edit" → vali pilt → asenda URL</li>
              <li>5. Alt tekst aitab SEO-l ja ligipääsetavusel</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};