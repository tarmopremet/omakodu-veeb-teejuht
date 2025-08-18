import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Reservation {
  id: number;
  user_id: string | null;
  locker_id: number | null;
  start_at: string;
  end_at: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Locker {
  id: number;
  name: string;
}

export const AdminReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const [reservationsResponse, lockersResponse] = await Promise.all([
        supabase
          .from('reservations')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('lockers')
          .select('id, name')
      ]);

      if (reservationsResponse.error) throw reservationsResponse.error;
      if (lockersResponse.error) throw lockersResponse.error;

      setReservations(reservationsResponse.data || []);
      setLockers(lockersResponse.data || []);
    } catch (error) {
      toast({
        title: 'Viga',
        description: 'Andmete laadimine ebaõnnestus',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateReservationStatus = async (id: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Edukalt uuendatud',
        description: 'Reservatsiooni olek on uuendatud',
      });
      
      fetchData();
    } catch (error) {
      toast({
        title: 'Viga',
        description: 'Oleku uuendamine ebaõnnestus',
        variant: 'destructive',
      });
    }
  };

  const getLockerName = (lockerId: number | null) => {
    if (!lockerId) return 'Määramata';
    const locker = lockers.find(l => l.id === lockerId);
    return locker ? locker.name : `Kapp #${lockerId}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Ootel</Badge>;
      case 'confirmed':
        return <Badge variant="default">Kinnitatud</Badge>;
      case 'active':
        return <Badge variant="secondary">Aktiivne</Badge>;
      case 'completed':
        return <Badge variant="secondary">Lõpetatud</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Tühistatud</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredReservations = reservations.filter(reservation => 
    statusFilter === 'all' || reservation.status === statusFilter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reservatsioonide haldus</h2>
          <p className="text-muted-foreground">
            Ülevaade ja haldamine kõigist reservatsioonidest
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtreeri oleku järgi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Kõik olekud</SelectItem>
              <SelectItem value="pending">Ootel</SelectItem>
              <SelectItem value="confirmed">Kinnitatud</SelectItem>
              <SelectItem value="active">Aktiivne</SelectItem>
              <SelectItem value="completed">Lõpetatud</SelectItem>
              <SelectItem value="cancelled">Tühistatud</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kokku reservatsioone</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reservations.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ootel</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reservations.filter(r => r.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktiivsed</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reservations.filter(r => r.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lõpetatud</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reservations.filter(r => r.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reservatsioonid</CardTitle>
          <CardDescription>
            Kõik reservatsioonid ja nende olekud
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Kasutaja</TableHead>
                <TableHead>Kapp</TableHead>
                <TableHead>Algus</TableHead>
                <TableHead>Lõpp</TableHead>
                <TableHead>Olek</TableHead>
                <TableHead>Loodud</TableHead>
                <TableHead>Tegevused</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell className="font-medium">#{reservation.id}</TableCell>
                  <TableCell>{reservation.user_id || 'Määramata'}</TableCell>
                  <TableCell>{getLockerName(reservation.locker_id)}</TableCell>
                  <TableCell>
                    {new Date(reservation.start_at).toLocaleString('et-EE')}
                  </TableCell>
                  <TableCell>
                    {new Date(reservation.end_at).toLocaleString('et-EE')}
                  </TableCell>
                  <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                  <TableCell>
                    {new Date(reservation.created_at).toLocaleString('et-EE')}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={reservation.status}
                      onValueChange={(newStatus) => updateReservationStatus(reservation.id, newStatus)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Ootel</SelectItem>
                        <SelectItem value="confirmed">Kinnitatud</SelectItem>
                        <SelectItem value="active">Aktiivne</SelectItem>
                        <SelectItem value="completed">Lõpetatud</SelectItem>
                        <SelectItem value="cancelled">Tühistatud</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
              {filteredReservations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    {statusFilter === 'all' 
                      ? 'Ühtegi reservatsiooni pole veel tehtud'
                      : `Ühtegi ${statusFilter} olekuga reservatsiooni ei leitud`
                    }
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};