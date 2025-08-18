import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar, Lock, Unlock, Search, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OpenLog {
  id: number;
  locker_id: number | null;
  user_id: string | null;
  action: string;
  timestamp: string;
  meta: any;
  created_at: string;
}

interface Locker {
  id: number;
  name: string;
}

export const AdminOpenLogs = () => {
  const [logs, setLogs] = useState<OpenLog[]>([]);
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const [logsResponse, lockersResponse] = await Promise.all([
        supabase
          .from('open_logs')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(100),
        supabase
          .from('lockers')
          .select('id, name')
      ]);

      if (logsResponse.error) throw logsResponse.error;
      if (lockersResponse.error) throw lockersResponse.error;

      setLogs(logsResponse.data || []);
      setLockers(lockersResponse.data || []);
    } catch (error) {
      toast({
        title: 'Viga',
        description: 'Logide laadimine ebaõnnestus',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getLockerName = (lockerId: number | null) => {
    if (!lockerId) return 'Määramata';
    const locker = lockers.find(l => l.id === lockerId);
    return locker ? locker.name : `Kapp #${lockerId}`;
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'open_command':
        return (
          <Badge variant="default">
            <Unlock className="mr-1 h-3 w-3" />
            Avatud
          </Badge>
        );
      case 'close_command':
        return (
          <Badge variant="secondary">
            <Lock className="mr-1 h-3 w-3" />
            Suletud
          </Badge>
        );
      case 'manual_open':
        return (
          <Badge variant="outline">
            <Activity className="mr-1 h-3 w-3" />
            Käsitsi avatud
          </Badge>
        );
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  const uniqueActions = [...new Set(logs.map(log => log.action))];

  const filteredLogs = logs.filter(log => {
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesSearch = searchTerm === '' || 
      getLockerName(log.locker_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.user_id && log.user_id.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesAction && matchesSearch;
  });

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
          <h2 className="text-2xl font-bold tracking-tight">Avamiste ajalugu</h2>
          <p className="text-muted-foreground">
            Ülevaade kõigist kappide avamise ja sulgemise logidest
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kokku tegevusi</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logs.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Viimased 24h</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logs.filter(log => 
                new Date(log.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
              ).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avamisi täna</CardTitle>
            <Unlock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logs.filter(log => 
                log.action === 'open_command' &&
                new Date(log.timestamp).toDateString() === new Date().toDateString()
              ).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tegevuste ajalugu</CardTitle>
          <CardDescription>
            Viimased 100 tegevust kappidega
          </CardDescription>
          <div className="flex items-center gap-4 pt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Otsi kapi või kasutaja järgi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtreeri tegevuse järgi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Kõik tegevused</SelectItem>
                {uniqueActions.map(action => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aeg</TableHead>
                <TableHead>Kapp</TableHead>
                <TableHead>Kasutaja</TableHead>
                <TableHead>Tegevus</TableHead>
                <TableHead>Lisainfo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {new Date(log.timestamp).toLocaleString('et-EE')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getLockerName(log.locker_id)}</TableCell>
                  <TableCell>{log.user_id || 'Süsteem'}</TableCell>
                  <TableCell>{getActionBadge(log.action)}</TableCell>
                  <TableCell>
                    {log.meta ? (
                      <div className="text-sm text-muted-foreground">
                        <pre className="max-w-xs overflow-hidden text-ellipsis">
                          {JSON.stringify(log.meta, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    {searchTerm || actionFilter !== 'all' 
                      ? 'Filtritele vastavaid logisid ei leitud'
                      : 'Ühtegi tegevust pole veel logitud'
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