import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, MapPin, Phone, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Booking {
  id: string;
  product_name: string;
  location: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  status: string;
  payment_status: string;
}

export const UserDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserBookings();
    }
  }, [user]);

  const fetchUserBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: 'Viga',
        description: 'Tellimuste laadimine ebaõnnestus',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const openLocker = async (bookingId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('smart-locker-control', {
        body: { bookingId }
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: 'Nutikapp avatud!',
          description: `${data.locker_name} on edukalt avatud. Võite seadme kätte võtta.`,
        });
      } else {
        throw new Error(data?.error || 'Kapi avamine ebaõnnestus');
      }
    } catch (error: any) {
      console.error('Error opening locker:', error);
      toast({
        title: 'Viga',
        description: error.message || 'Kapi avamine ebaõnnestus',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'paid' && status === 'confirmed') {
      return <Badge className="bg-green-100 text-green-800">Aktiivsed</Badge>;
    }
    if (paymentStatus === 'paid') {
      return <Badge className="bg-blue-100 text-blue-800">Kinnitatud</Badge>;
    }
    if (status === 'completed') {
      return <Badge className="bg-gray-100 text-gray-800">Lõpetatud</Badge>;
    }
    return <Badge variant="outline">Ootel</Badge>;
  };

  const isActiveBooking = (booking: Booking) => {
    const now = new Date();
    const startDate = new Date(booking.start_date);
    const endDate = new Date(booking.end_date);
    return booking.payment_status === 'paid' && 
           booking.status === 'confirmed' && 
           now >= startDate && 
           now <= endDate;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tere tulemast, {user?.user_metadata?.full_name || user?.email}!
        </h1>
        <p className="text-gray-600">Siin näete oma aktiivseid ja varasemaid tellimusi</p>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Phone className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Teil pole veel tellimusi
            </h3>
            <p className="text-gray-600 mb-6">
              Alustage oma esimese seadme rentimisega
            </p>
            <Button asChild>
              <a href="/">Otsi seadmeid</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-gray-900">
                      {booking.product_name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{booking.location}</span>
                    </div>
                  </div>
                  {getStatusBadge(booking.status, booking.payment_status)}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600">Algus</div>
                      <div className="font-medium">
                        {new Date(booking.start_date).toLocaleDateString('et-EE')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600">Lõpp</div>
                      <div className="font-medium">
                        {new Date(booking.end_date).toLocaleDateString('et-EE')}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Summa</div>
                    <div className="font-medium text-lg">
                      €{booking.total_amount}
                    </div>
                  </div>
                </div>

                {isActiveBooking(booking) && (
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => openLocker(booking.id)}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Ava nutikapp
                    </Button>
                    <Button variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      Võta ühendust
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};