import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Eye, EyeOff } from "lucide-react";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone_number: string;
  personal_code: string;
  is_active: boolean;
  created_at: string;
  role?: string;
  bookings_count?: number;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch profiles with user roles and booking counts
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select(`
          *,
          user_roles!inner(role),
          bookings!left(id)
        `)
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Transform the data to include role and booking count
      const transformedUsers = profiles?.map(profile => ({
        ...profile,
        role: profile.user_roles?.[0]?.role || 'user',
        bookings_count: profile.bookings?.length || 0
      })) || [];

      setUsers(transformedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Viga",
        description: "Kasutajate laadimine ebaõnnestus",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_active: !currentStatus })
        .eq("user_id", userId);

      if (error) throw error;

      toast({
        title: "Õnnestus",
        description: `Kasutaja ${!currentStatus ? 'aktiveeritud' : 'peidetud'}`,
      });

      fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
      toast({
        title: "Viga",
        description: "Kasutaja staatuse muutmine ebaõnnestus",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone_number?.includes(searchTerm) ||
                         user.personal_code?.includes(searchTerm);
    
    const matchesStatus = showInactive ? !user.is_active : user.is_active;
    
    return matchesSearch && matchesStatus;
  });

  const activeUsersCount = users.filter(u => u.is_active).length;
  const inactiveUsersCount = users.filter(u => !u.is_active).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Kasutajaid laetakse...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aktiivsed kasutajad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{activeUsersCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Peidetud kasutajad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{inactiveUsersCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Kokku kasutajaid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Otsi kasutajaid..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button
          variant={showInactive ? "default" : "outline"}
          onClick={() => setShowInactive(!showInactive)}
          className="whitespace-nowrap"
        >
          {showInactive ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Näita peidetud
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Näita aktiivseid
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {showInactive ? 'Peidetud kasutajad' : 'Aktiivsed kasutajad'} ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nimi</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Isikukood</TableHead>
                  <TableHead>Roll</TableHead>
                  <TableHead>Broneeringud</TableHead>
                  <TableHead>Staatus</TableHead>
                  <TableHead className="text-right">Tegevused</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      {searchTerm ? 'Otsingu tulemusi ei leitud' : 'Kasutajaid ei leitud'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.full_name || 'Nimetu'}
                      </TableCell>
                      <TableCell>{user.phone_number || '-'}</TableCell>
                      <TableCell>{user.personal_code || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role === 'admin' ? 'Admin' : 'Kasutaja'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.bookings_count}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? 'default' : 'secondary'}>
                          {user.is_active ? 'Aktiivne' : 'Peidetud'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleUserStatus(user.user_id, user.is_active)}
                        >
                          {user.is_active ? (
                            <>
              <EyeOff className="h-4 w-4 mr-2" />
                              Peida
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Aktiveeri
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}