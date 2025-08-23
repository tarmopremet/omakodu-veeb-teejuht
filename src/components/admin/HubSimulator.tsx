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
      const testLockers = [
        { name: "Lukk A1", hub_id: selectedHub, relay_id: "A1" },
        { name: "Lukk A2", hub_id: selectedHub, relay_id: "A2" },
        { name: "Lukk B1", hub_id: selectedHub, relay_id: "B1" },
        { name: "Lukk B2", hub_id: selectedHub, relay_id: "B2" },
        { name: "Lukk C1", hub_id: selectedHub, relay_id: "C1" },
      ];

      const { error } = await supabase
        .from('lockers')
        .insert(testLockers);

      if (error) throw error;

      toast({
        title: "Õnnestus!",
        description: "Test lukud on loodud",
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
              Loo test lukud
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
              <Button onClick={createTestLockers}>
                Loo test lukud
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lockers.map((locker) => (
                <Card key={locker.id} className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{locker.name}</h3>
                      <Badge 
                        className={`${getStatusColor(locker.status)} text-white`}
                      >
                        {getStatusText(locker.status)}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div>HUB: {locker.hub_id}</div>
                      <div>Relay: {locker.relay_id}</div>
                      {locker.last_opened_at && (
                        <div>
                          Viimati avatud: {new Date(locker.last_opened_at).toLocaleString('et-EE')}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={locker.status === "open" ? "secondary" : "default"}
                        onClick={() => simulateLockerAction(locker.id, "open")}
                        disabled={hubStatus === "offline" || locker.status === "open"}
                        className="flex-1"
                      >
                        <Unlock className="w-4 h-4 mr-1" />
                        Ava
                      </Button>
                      <Button
                        size="sm"
                        variant={locker.status === "closed" ? "secondary" : "default"}
                        onClick={() => simulateLockerAction(locker.id, "close")}
                        disabled={hubStatus === "offline" || locker.status === "closed"}
                        className="flex-1"
                      >
                        <Lock className="w-4 h-4 mr-1" />
                        Sulge
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                <li>1. Vali HUB ID (või loo uus)</li>
                <li>2. Lülita HUB "Online" olekusse</li>
                <li>3. Loo test lukud</li>
                <li>4. Testi lukustuste avamist/sulgemist</li>
                <li>5. Vaata "Logid" sektsioonis tegevuste ajalugu</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-3 rounded">
              <strong>Märkused:</strong>
              <ul className="mt-2 space-y-1">
                <li>• Kõik tegevused logitakse andmebaasi</li>
                <li>• Saad testida ilma päris riistvarata</li>
                <li>• Lukke saab avada/sulgeda ainult kui HUB on "online"</li>
                <li>• Ajalugu salvestatakse ja on nähtav admin paneeli logides</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};