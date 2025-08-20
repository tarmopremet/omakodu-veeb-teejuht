import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Edit, Trash2, Eye, AlertCircle } from 'lucide-react';
import { ProductDialog } from './ProductDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Product {
  id: string;
  name: string;
  category: string;
  location: string;
  price_per_hour: number;
  price_per_day?: number;
  price_per_week?: number;
  description?: string;
  is_active: boolean;
  images?: string[];
  created_at: string;
  locker_door?: number;
}

export const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: 'Viga',
        description: 'Toodete laadimine ebaõnnestus',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleProductStatus = async (productId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !isActive })
        .eq('id', productId);

      if (error) throw error;

      setProducts(prev => prev.map(product => 
        product.id === productId ? { ...product, is_active: !isActive } : product
      ));

      toast({
        title: 'Edukalt uuendatud',
        description: `Toode ${!isActive ? 'aktiveeritud' : 'deaktiveeritud'}`,
      });
    } catch (error) {
      console.error('Error updating product status:', error);
      toast({
        title: 'Viga',
        description: 'Toote staatuse uuendamine ebaõnnestus',
        variant: 'destructive',
      });
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setProducts(prev => prev.filter(product => product.id !== productId));

      toast({
        title: 'Edukalt kustutatud',
        description: 'Toode on edukalt kustutatud',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Viga',
        description: 'Toote kustutamine ebaõnnestus',
        variant: 'destructive',
      });
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesLocation = locationFilter === 'all' || product.location === locationFilter;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const uniqueCategories = [...new Set(products.map(p => p.category))];
  const uniqueLocations = [...new Set(products.map(p => p.location))];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tooted</CardTitle>
          <CardDescription>Laadin...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Toodete haldus</CardTitle>
            <CardDescription>
              Vaadake ja hallake kõiki renditeenuseid
            </CardDescription>
          </div>
          <ProductDialog onProductSaved={loadProducts} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Otsige toote nime või kirjelduse järgi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Kategooria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Kõik kategooriad</SelectItem>
              {uniqueCategories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Asukoht" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Kõik asukohad</SelectItem>
              {uniqueLocations.map(location => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Toode</TableHead>
                <TableHead>Kategooria</TableHead>
                <TableHead>Asukoht</TableHead>
                <TableHead>Kapi uks</TableHead>
                <TableHead>Hind/tund</TableHead>
                <TableHead>Hind/päev</TableHead>
                <TableHead>Staatus</TableHead>
                <TableHead>Tegevused</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      {product.description && (
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>{product.location}</TableCell>
                  <TableCell>
                    {product.locker_door ? (
                      <Badge variant="secondary">
                        Uks {product.locker_door}{product.locker_door === 9 ? " (Sikupilli)" : ""}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>€{product.price_per_hour}</TableCell>
                  <TableCell>
                    {product.price_per_day ? `€${product.price_per_day}` : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.is_active ? 'default' : 'secondary'}>
                      {product.is_active ? 'Aktiivne' : 'Mitteaktiivne'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <ProductDialog 
                        product={product}
                        onProductSaved={loadProducts}
                        trigger={
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <Button
                        size="sm"
                        variant={product.is_active ? 'secondary' : 'default'}
                        onClick={() => toggleProductStatus(product.id, product.is_active)}
                      >
                        {product.is_active ? 'Deaktiveeri' : 'Aktiveeri'}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Oled sa kindel?</AlertDialogTitle>
                            <AlertDialogDescription>
                              See tegevus ei ole tagasipööratav. Toode kustutatakse jäädavalt.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Tühista</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteProduct(product.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Kustuta
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Tooteid ei leitud
          </div>
        )}
      </CardContent>
    </Card>
  );
};