import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, Eye, Check, X } from 'lucide-react';

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  product_name: string;
  location: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  payment_status: string;
  status: string;
  created_at: string;
}

export const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast({
        title: 'Viga',
        description: 'Broneeringute laadimine ebaõnnestus',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(prev => prev.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      ));

      toast({
        title: 'Edukalt uuendatud',
        description: `Broneeringu staatus muudetud: ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: 'Viga',
        description: 'Staatuse uuendamine ebaõnnestus',
        variant: 'destructive',
      });
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || booking.payment_status === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
      pending: 'outline',
      confirmed: 'default',
      completed: 'secondary',
      cancelled: 'destructive',
    };
    
    const labels: { [key: string]: string } = {
      pending: 'Ootel',
      confirmed: 'Kinnitatud',
      completed: 'Lõpetatud',
      cancelled: 'Tühistatud',
    };

    return (
      <Badge variant={variants[status] || 'outline'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
      paid: 'default',
      unpaid: 'destructive',
      refunded: 'secondary',
    };
    
    const labels: { [key: string]: string } = {
      paid: 'Makstud',
      unpaid: 'Maksmata',
      refunded: 'Tagastatud',
    };

    return (
      <Badge variant={variants[paymentStatus] || 'outline'}>
        {labels[paymentStatus] || paymentStatus}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Broneeringud</CardTitle>
          <CardDescription>Laadin...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Broneeringute haldus</CardTitle>
        <CardDescription>
          Vaadake ja hallake kõiki broneeringuid
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Otsige kliendi nime, e-maili või toote järgi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Staatus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Kõik staatused</SelectItem>
              <SelectItem value="pending">Ootel</SelectItem>
              <SelectItem value="confirmed">Kinnitatud</SelectItem>
              <SelectItem value="completed">Lõpetatud</SelectItem>
              <SelectItem value="cancelled">Tühistatud</SelectItem>
            </SelectContent>
          </Select>
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Makse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Kõik maksed</SelectItem>
              <SelectItem value="paid">Makstud</SelectItem>
              <SelectItem value="unpaid">Maksmata</SelectItem>
              <SelectItem value="refunded">Tagastatud</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Klient</TableHead>
                <TableHead>Toode</TableHead>
                <TableHead>Asukoht</TableHead>
                <TableHead>Kuupäevad</TableHead>
                <TableHead>Summa</TableHead>
                <TableHead>Makse</TableHead>
                <TableHead>Staatus</TableHead>
                <TableHead>Tegevused</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{booking.customer_name}</div>
                      <div className="text-sm text-muted-foreground">{booking.customer_email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{booking.product_name}</TableCell>
                  <TableCell>{booking.location}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(booking.start_date).toLocaleDateString('et-EE')}</div>
                      <div className="text-muted-foreground">
                        - {new Date(booking.end_date).toLocaleDateString('et-EE')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>€{booking.total_amount}</TableCell>
                  <TableCell>{getPaymentBadge(booking.payment_status)}</TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {booking.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      {booking.status !== 'cancelled' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Broneeringuid ei leitud
          </div>
        )}
      </CardContent>
    </Card>
  );
};