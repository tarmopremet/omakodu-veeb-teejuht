import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Lock, Unlock, Edit2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Locker {
  id: number;
  name: string;
  hub_id: string;
  relay_id: string;
  status: string;
  last_opened_at: string | null;
  created_at: string;
  updated_at: string;
}

export const AdminLockers = () => {
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingLocker, setEditingLocker] = useState<Locker | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    hub_id: '',
    relay_id: ''
  });

  const fetchLockers = async () => {
    try {
      const { data, error } = await supabase
        .from('lockers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLockers(data || []);
    } catch (error) {
      toast({
        title: 'Viga',
        description: 'Kapid ei laadinud',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLockers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingLocker) {
        const { error } = await supabase
          .from('lockers')
          .update(formData)
          .eq('id', editingLocker.id);

        if (error) throw error;
        
        toast({
          title: 'Edukalt uuendatud',
          description: 'Kapp on uuendatud',
        });
      } else {
        const { error } = await supabase
          .from('lockers')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: 'Edukalt lisatud',
          description: 'Uus kapp on lisatud',
        });
      }

      setFormData({ name: '', hub_id: '', relay_id: '' });
      setShowAddDialog(false);
      setEditingLocker(null);
      fetchLockers();
    } catch (error) {
      toast({
        title: 'Viga',
        description: 'Kapi salvestamine ebaõnnestus',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (locker: Locker) => {
    setEditingLocker(locker);
    setFormData({
      name: locker.name,
      hub_id: locker.hub_id,
      relay_id: locker.relay_id
    });
    setShowAddDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Kas olete kindel, et soovite selle kapi kustutada?')) return;

    try {
      const { error } = await supabase
        .from('lockers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Edukalt kustutatud',
        description: 'Kapp on kustutatud',
      });
      
      fetchLockers();
    } catch (error) {
      toast({
        title: 'Viga',
        description: 'Kapi kustutamine ebaõnnestus',
        variant: 'destructive',
      });
    }
  };

  const handleOpenLocker = async (locker: Locker) => {
    try {
      // TODO: Implement Ajax Cloud integration when email is available
      toast({
        title: 'Ajax integratsioon puudub',
        description: 'Ajax Cloud email on vaja konfigureerida',
        variant: 'destructive',
      });
    } catch (error) {
      toast({
        title: 'Viga',
        description: 'Kapi avamine ebaõnnestus',
        variant: 'destructive',
      });
    }
  };

  const closeDialog = () => {
    setShowAddDialog(false);
    setEditingLocker(null);
    setFormData({ name: '', hub_id: '', relay_id: '' });
  };

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
          <h2 className="text-2xl font-bold tracking-tight">Nutikappide haldus</h2>
          <p className="text-muted-foreground">
            Hallake nutikappide seadeid ja avamisõigusi
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Lisa kapp
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingLocker ? 'Muuda kappi' : 'Lisa uus kapp'}
              </DialogTitle>
              <DialogDescription>
                Sisestage kapi andmed. Kõik väljad on kohustuslikud.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nimi</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="nt. Kapp #1"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hub_id">Hub ID</Label>
                  <Input
                    id="hub_id"
                    value={formData.hub_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, hub_id: e.target.value }))}
                    placeholder="Ajax hub identifikaator"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="relay_id">Relay ID</Label>
                  <Input
                    id="relay_id"
                    value={formData.relay_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, relay_id: e.target.value }))}
                    placeholder="Ajax relay identifikaator"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Tühista
                </Button>
                <Button type="submit">
                  {editingLocker ? 'Uuenda' : 'Lisa'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kõik kapid</CardTitle>
          <CardDescription>
            Ülevaade kõigist registreeritud nutikappidest
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nimi</TableHead>
                <TableHead>Hub ID</TableHead>
                <TableHead>Relay ID</TableHead>
                <TableHead>Olek</TableHead>
                <TableHead>Viimati avatud</TableHead>
                <TableHead>Tegevused</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lockers.map((locker) => (
                <TableRow key={locker.id}>
                  <TableCell className="font-medium">{locker.name}</TableCell>
                  <TableCell>{locker.hub_id}</TableCell>
                  <TableCell>{locker.relay_id}</TableCell>
                  <TableCell>
                    <Badge variant={locker.status === 'closed' ? 'secondary' : 'default'}>
                      {locker.status === 'closed' ? (
                        <>
                          <Lock className="mr-1 h-3 w-3" />
                          Suletud
                        </>
                      ) : (
                        <>
                          <Unlock className="mr-1 h-3 w-3" />
                          Avatud
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {locker.last_opened_at 
                      ? new Date(locker.last_opened_at).toLocaleString('et-EE')
                      : 'Pole avatud'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenLocker(locker)}
                      >
                        <Unlock className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(locker)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(locker.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {lockers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Ühtegi kappi pole veel lisatud
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