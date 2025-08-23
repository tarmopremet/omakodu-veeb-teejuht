import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Unlock, Wifi, WifiOff, Play, Square, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Locker {
  id: number;
  name: string;
  hub_id: string;
  relay_id: string;
  status: string;
  last_opened_at: string | null;
}

export const HubSimulator = () => {
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [loading, setLoading] = useState(true);
  const [hubStatus, setHubStatus] = useState<"online" | "offline">("offline");
  const [autoMode, setAutoMode] = useState(false);
  const [selectedHub, setSelectedHub] = useState("HUB-001");
  const { toast } = useToast();

  useEffect(() => {
    loadLockers();
  }, [selectedHub]);

  const loadLockers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lockers')
        .select('*')
        .eq('hub_id', selectedHub)
        .order('name');

      if (error) throw error;
      setLockers(data || []);
    } catch (error: any) {
      toast({
        title: "Viga",
        description: `Lukustuste laadimisel tekkis viga: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const simulateLockerAction = async (lockerId: number, action: "open" | "close") => {
    try {
      const locker = lockers.find(l => l.id === lockerId);
      if (!locker) return;

      // Update locker status
      const { error: updateError } = await supabase
        .from('lockers')
        .update({
          status: action === "open" ? "open" : "closed",
          last_opened_at: action === "open" ? new Date().toISOString() : locker.last_opened_at,
          updated_at: new Date().toISOString()
        })
        .eq('id', lockerId);

      if (updateError) throw updateError;

      // Log the action
      const { error: logError } = await supabase
        .from('open_logs')
        .insert({
          locker_id: lockerId,
          action: `simulator_${action}`,
          meta: {
            simulator: true,
            hub_id: locker.hub_id,
            relay_id: locker.relay_id,
            timestamp: new Date().toISOString()
          }
        });

      if (logError) throw logError;

      // Update local state
      setLockers(prev => prev.map(l => 
        l.id === lockerId 
          ? { 
              ...l, 
              status: action === "open" ? "open" : "closed",
              last_opened_at: action === "open" ? new Date().toISOString() : l.last_opened_at
            }
          : l
      ));

      toast({
        title: "Simulator",
        description: `${locker.name} ${action === "open" ? "avatud" : "suletud"}`,
      });

    } catch (error: any) {
      toast({
        title: "Viga",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createTestLockers = async () => {
    try {
      const testLockers = [];
      
      // Loo 7 kappi, igaühes 8 luuki
      const cabinets = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
      
      for (const cabinet of cabinets) {
        for (let door = 1; door <= 8; door++) {
          testLockers.push({
            name: `Kapp ${cabinet} - Luuk ${door}`,
            hub_id: selectedHub,
            relay_id: `${cabinet}${door}`
          });
        }
      }

      const { error } = await supabase
        .from('lockers')
        .insert(testLockers);

      if (error) throw error;

      toast({
        title: "Õnnestus!",
        description: `${testLockers.length} lukku on loodud (7 kappi x 8 luuki)`,
      });

      loadLockers();
    } catch (error: any) {
      toast({
        title: "Viga",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const clearAllLockers = async () => {
    try {
      const { error } = await supabase
        .from('lockers')
        .delete()
        .eq('hub_id', selectedHub);

      if (error) throw error;

      toast({
        title: "Õnnestus!",
        description: "Kõik lukud on kustutatud",
      });

      loadLockers();
    } catch (error: any) {
      toast({
        title: "Viga",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleHubStatus = () => {
    setHubStatus(prev => prev === "online" ? "offline" : "online");
    toast({
      title: "HUB Simulator",
      description: `HUB on nüüd ${hubStatus === "online" ? "offline" : "online"}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-green-500";
      case "closed": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "open": return "Avatud";
      case "closed": return "Suletud";
      default: return "Teadmata";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            HUB Simulator
          </CardTitle>
          <p className="text-sm text-gray-500">
            Testimiseks mõeldud HUB ja lukustuste simulaator
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>HUB ID</Label>
              <Select value={selectedHub} onValueChange={setSelectedHub}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HUB-001">HUB-001 (Test)</SelectItem>
                  <SelectItem value="HUB-002">HUB-002 (Test)</SelectItem>
                  <SelectItem value="HUB-TARTU">HUB-TARTU</SelectItem>
                  <SelectItem value="HUB-TALLINN">HUB-TALLINN</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button
                onClick={toggleHubStatus}
                variant={hubStatus === "online" ? "default" : "secondary"}
                className="flex items-center gap-2"
              >
                {hubStatus === "online" ? (
                  <>
                    <Wifi className="w-4 h-4" />
                    Online
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4" />
                    Offline
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-end gap-2">
              <Badge variant={hubStatus === "online" ? "default" : "secondary"}>
                {hubStatus === "online" ? "Ühendatud" : "Ühendamata"}
              </Badge>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={createTestLockers} variant="outline">
              Loo 56 lukku (7 kappi x 8 luuki)
            </Button>
            <Button onClick={clearAllLockers} variant="destructive">
              Kustuta kõik lukud
            </Button>
            <Button onClick={loadLockers} variant="outline">
              Värskenda
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lukustused ({lockers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">Laadin lukustusi...</p>
            </div>
          ) : lockers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Lukustusi ei leitud</p>
              <p className="text-sm text-gray-400 mb-4">
                Loodetakse 7 kappi, igaühes 8 luuki (kokku 56 lukku)
              </p>
              <Button onClick={createTestLockers}>
                Loo 56 lukku
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Group lockers by cabinet */}
              {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(cabinet => {
                const cabinetLockers = lockers.filter(l => l.relay_id.startsWith(cabinet));
                if (cabinetLockers.length === 0) return null;
                
                return (
                  <div key={cabinet} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3 text-lg">Kapp {cabinet} ({cabinetLockers.length}/8 luuki)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {cabinetLockers.sort((a, b) => a.relay_id.localeCompare(b.relay_id)).map((locker) => (
                        <Card key={locker.id} className="border">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">{locker.relay_id}</span>
                              <Badge 
                                className={`${getStatusColor(locker.status)} text-white text-xs`}
                              >
                                {getStatusText(locker.status)}
                              </Badge>
                            </div>

                            {locker.last_opened_at && (
                              <div className="text-xs text-gray-500 mb-2">
                                {new Date(locker.last_opened_at).toLocaleString('et-EE', {
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            )}

                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant={locker.status === "open" ? "secondary" : "default"}
                                onClick={() => simulateLockerAction(locker.id, "open")}
                                disabled={hubStatus === "offline" || locker.status === "open"}
                                className="flex-1 text-xs p-1 h-7"
                              >
                                <Unlock className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant={locker.status === "closed" ? "secondary" : "default"}
                                onClick={() => simulateLockerAction(locker.id, "close")}
                                disabled={hubStatus === "offline" || locker.status === "closed"}
                                className="flex-1 text-xs p-1 h-7"
                              >
                                <Lock className="w-3 h-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Simulatsiooni juhised</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="bg-blue-50 p-3 rounded">
              <strong>Kuidas kasutada:</strong>
              <ul className="mt-2 space-y-1">
                <li>1. Vali HUB ID või loo uus</li>
                <li>2. Lülita HUB "Online" olekusse</li>
                <li>3. Loo 56 lukku (7 kappi x 8 luuki igaühes)</li>
                <li>4. Testi lukustuste avamist/sulgemist kappide kaupa</li>
                <li>5. Vaata "Logid" sektsioonis kõigi tegevuste ajalugu</li>
                <li>6. Admin paneelis "Kapid" sektsioonis saad siduda lukke toodetega</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-3 rounded">
              <strong>Kappide struktuur:</strong>
              <ul className="mt-2 space-y-1">
                <li>• Kapp A: luugid A1, A2, A3, A4, A5, A6, A7, A8</li>
                <li>• Kapp B: luugid B1, B2, B3, B4, B5, B6, B7, B8</li>
                <li>• ... jne kuni Kapp G</li>
                <li>• Kokku 56 lukku</li>
                <li>• Iga luuk saab olla seotud konkreetse tootega</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-3 rounded">
              <strong>Toodete sidumine:</strong>
              <ul className="mt-2 space-y-1">
                <li>• Admin paneelis "Tooted" sektsioonis saad valida millised luugid kuuluvad tootele</li>
                <li>• Klient rendib toote → süsteem määrab automaatselt vaba luugi</li>
                <li>• Saad manuaalselt avada mis tahes luugi</li>
                <li>• Kõik tegevused logitakse ja on jälgitavad</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};