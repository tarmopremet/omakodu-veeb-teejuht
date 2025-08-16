import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Upload, X } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(1, "Toote nimi on kohustuslik"),
  category: z.string().min(1, "Kategooria on kohustuslik"),
  location: z.string().min(1, "Asukoht on kohustuslik"),
  description: z.string().optional(),
  price_per_hour: z.number().min(0, "Tunni hind peab olema positiivne"),
  price_per_day: z.number().min(0, "Päeva hind peab olema positiivne").optional(),
  price_per_week: z.number().min(0, "Nädala hind peab olema positiivne").optional(),
  is_active: z.boolean().default(true),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Product {
  id?: string;
  name: string;
  category: string;
  location: string;
  description?: string;
  price_per_hour: number;
  price_per_day?: number;
  price_per_week?: number;
  is_active: boolean;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  images?: string[];
}

interface ProductDialogProps {
  product?: Product;
  onProductSaved: () => void;
  trigger?: React.ReactNode;
}

const categories = [
  "Tekstiilipesurid",
  "Aurupesurid",
  "Aknapesurobotid",
  "Tolmuimejad",
  "Aknapesurid",
  "Põrandapesumasinad",
  "Survepesurid"
];

const cityStores = {
  "Tallinn": [
    "Kristiine Keskus",
    "Sikupilli Prisma", 
    "Lasnamäe Prisma",
    "Kadaka Selver",
    "Pirita Selver"
  ],
  "Tartu": [
    "Sõbra Prisma",
    "Annelinna Keskus"
  ],
  "Pärnu": ["Pärnu"],
  "Rakvere": ["Rakvere"], 
  "Saku": ["Saku"]
};

const locations = Object.keys(cityStores).flatMap(city => 
  cityStores[city as keyof typeof cityStores].map(store => 
    city === store ? city : `${city} - ${store}`
  )
);

export function ProductDialog({ product, onProductSaved, trigger }: ProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      location: "",
      description: "",
      price_per_hour: 0,
      price_per_day: 0,
      price_per_week: 0,
      is_active: true,
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
    },
  });

  useEffect(() => {
    if (product && open) {
      form.reset({
        name: product.name || "",
        category: product.category || "",
        location: product.location || "",
        description: product.description || "",
        price_per_hour: product.price_per_hour || 0,
        price_per_day: product.price_per_day || 0,
        price_per_week: product.price_per_week || 0,
        is_active: product.is_active ?? true,
        meta_title: product.meta_title || "",
        meta_description: product.meta_description || "",
        meta_keywords: product.meta_keywords || "",
      });
      setImages(product.images || []);
    } else if (!product && open) {
      form.reset({
        name: "",
        category: "",
        location: "",
        description: "",
        price_per_hour: 0,
        price_per_day: 0,
        price_per_week: 0,
        is_active: true,
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
      });
      setImages([]);
    }
  }, [product, open, form]);

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const uploadPromises = Array.from(files).map(uploadImage);
      const uploadedUrls = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...uploadedUrls]);
      
      toast({
        title: "Õnnestus",
        description: `${uploadedUrls.length} pilti laeti üles`,
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Viga",
        description: "Piltide üleslaadimine ebaõnnestus",
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
      // Clear the input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      const productData = {
        name: data.name,
        category: data.category,
        location: data.location,
        description: data.description || null,
        price_per_hour: data.price_per_hour,
        price_per_day: data.price_per_day || null,
        price_per_week: data.price_per_week || null,
        is_active: data.is_active,
        meta_title: data.meta_title || null,
        meta_description: data.meta_description || null,
        meta_keywords: data.meta_keywords || null,
        images: images.length > 0 ? images : null,
      };

      if (product?.id) {
        const { error } = await supabase
          .from("products")  
          .update(productData)
          .eq("id", product.id);
        
        if (error) throw error;
        
        toast({
          title: "Õnnestus",
          description: "Toode on edukalt uuendatud",
        });
      } else {
        const { error } = await supabase
          .from("products")
          .insert([productData]);
        
        if (error) throw error;
        
        toast({
          title: "Õnnestus", 
          description: "Toode on edukalt lisatud",
        });
      }

      setOpen(false);
      onProductSaved();
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Viga",
        description: product?.id ? "Toote uuendamine ebaõnnestus" : "Toote lisamine ebaõnnestus",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const defaultTrigger = product ? (
    <Button variant="outline" size="sm">
      <Edit className="h-4 w-4" />
    </Button>
  ) : (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Lisa toode
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Muuda toodet" : "Lisa uus toode"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Toote nimi *</FormLabel>
                    <FormControl>
                      <Input placeholder="nt. Kärcher Tekstiilipesur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategooria *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Vali kategooria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asukoht *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Vali asukoht" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Aktiivne</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kirjeldus</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Toote kirjeldus..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Pildid</h4>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploadingImages}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    disabled={uploadingImages}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadingImages ? "Laaditakse üles..." : "Lisa pildid"}
                  </Button>
                  <span className="text-sm text-gray-500">
                    {images.length > 0 ? `${images.length} pilti lisatud` : "Pildid aitavad tooteid paremini müüa"}
                  </span>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Toote pilt ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price_per_hour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hind tunnis (€) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price_per_day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hind päevas (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price_per_week"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hind nädalas (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">SEO Andmed</h4>
              
              <FormField
                control={form.control}
                name="meta_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta pealkiri</FormLabel>
                    <FormControl>
                      <Input placeholder="SEO pealkiri..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meta_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta kirjeldus</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="SEO kirjeldus..." 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meta_keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Märksõnad</FormLabel>
                    <FormControl>
                      <Input placeholder="märksõna1, märksõna2, märksõna3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Tühista
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvestamine..." : (product ? "Uuenda" : "Lisa toode")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}