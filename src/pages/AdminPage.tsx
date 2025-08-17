import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Package, TrendingUp, LogOut, Images } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdminBookings } from '@/components/admin/AdminBookings';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminProducts } from '@/components/admin/AdminProducts';
import AdminUsers from '@/components/admin/AdminUsers';
import { ImageManager } from '@/components/admin/ImageManager';

export const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin, signOut, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: 'Viga',
        description: 'Väljalogimine ebaõnnestus',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Välja logitud',
        description: 'Olete edukalt välja logitud',
      });
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">RendiIse Admin</h1>
            <Badge variant="secondary">
              {user.email}
            </Badge>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Logi välja
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Ülevaade
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Broneeringud
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Tooted
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <Images className="h-4 w-4" />
              Pildid
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Kasutajad
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="bookings">
            <AdminBookings />
          </TabsContent>

          <TabsContent value="products">
            <AdminProducts />
          </TabsContent>

          <TabsContent value="images">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">Pildi haldus</h2>
                <p className="text-muted-foreground">
                  Laadige üles ja hallake toote pilte. Pildid salvestatakse Supabase Storage'sse.
                </p>
              </div>
              <ImageManager />
            </div>
          </TabsContent>

          <TabsContent value="users">
            <AdminUsers />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};