import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, Wifi, WifiOff, RefreshCw, TestTube, Network } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AjaxSettings {
  ajax_hub_ip: string;
  ajax_username: string;
  ajax_password: string;
  ajax_hub_locations: string;
}

export const AjaxSettings: React.FC = () => {
  const [settings, setSettings] = useState<AjaxSettings>({
    ajax_hub_ip: '',
    ajax_username: '',
    ajax_password: '',
    ajax_hub_locations: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', Object.keys(settings));

      if (error) throw error;

      const settingsMap = data?.reduce((acc, setting) => {
        acc[setting.setting_key as keyof AjaxSettings] = setting.setting_value || '';
        return acc;
      }, {} as AjaxSettings) || {};

      setSettings(prev => ({ ...prev, ...settingsMap }));
    } catch (error: any) {
      toast({
        title: 'Viga',
        description: 'Seadete laadimine ebaõnnestus',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        setting_key: key,
        setting_value: value,
        setting_type: key.includes('password') ? 'password' : 'text',
        description: getSettingDescription(key)
      }));

      // Upsert each setting
      for (const setting of settingsArray) {
        const { error } = await supabase
          .from('site_settings')
          .upsert(setting, {
            onConflict: 'setting_key'
          });

        if (error) throw error;
      }

      toast({
        title: 'Seaded salvestatud',
        description: 'Ajax HUB seaded on edukalt salvestatud',
      });
    } catch (error: any) {
      toast({
        title: 'Viga',
        description: 'Seadete salvestamine ebaõnnestus',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async () => {
    setTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('ajax-integration', {
        body: { action: 'list_devices' }
      });

      if (error) throw error;

      if (data?.success) {
        setConnectionStatus('connected');
        toast({
          title: 'Ühendus töötab!',
          description: `Ajax HUB on kättesaadav IP: ${settings.ajax_hub_ip}`,
        });
      } else {
        setConnectionStatus('disconnected');
        throw new Error(data?.error || 'Ühenduse testimine ebaõnnestus');
      }
    } catch (error: any) {
      setConnectionStatus('disconnected');
      toast({
        title: 'Ühenduse viga',
        description: error.message || 'Ajax HUB ühendus ebaõnnestus',
        variant: 'destructive',
      });
    } finally {
      setTesting(false);
    }
  };

  const getSettingDescription = (key: string): string => {
    switch (key) {
      case 'ajax_hub_ip':
        return 'Ajax HUB IP aadress lokaalselt võrgus';
      case 'ajax_username':
        return 'Ajax HUB kasutajanimi (valikuline)';
      case 'ajax_password':
        return 'Ajax HUB parool (valikuline)';
      case 'ajax_hub_locations':
        return 'HUB-ide asukohad JSON formaadis';
      default:
        return '';
    }
  };

  const getConnectionBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800"><Wifi className="w-3 h-3 mr-1" />Ühendatud</Badge>;
      case 'disconnected':
        return <Badge className="bg-red-100 text-red-800"><WifiOff className="w-3 h-3 mr-1" />Ühendamata</Badge>;
      default:
        return <Badge variant="outline">Testimata</Badge>;
    }
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
          <h2 className="text-2xl font-bold tracking-tight">Ajax Lokaalne Integratsioon</h2>
          <p className="text-muted-foreground">
            Ühendage otse oma Ajax HUB'iga lokaalselt võrgus (ei vaja Cloud kontot)
          </p>
        </div>
        {getConnectionBadge()}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            Ajax HUB seaded
          </CardTitle>
          <CardDescription>
            Sisestage oma Ajax HUB'i võrgu andmed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="ajax_hub_ip">Ajax HUB IP aadress *</Label>
              <Input
                id="ajax_hub_ip"
                type="text"
                value={settings.ajax_hub_ip}
                onChange={(e) => setSettings(prev => ({ ...prev, ajax_hub_ip: e.target.value }))}
                placeholder="192.168.1.100"
              />
              <p className="text-sm text-muted-foreground">
                Leiate HUB'i IP aadressi oma ruuteri administreerimislehelt või Ajax äpist
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ajax_username">Kasutajanimi (valikuline)</Label>
              <Input
                id="ajax_username"
                value={settings.ajax_username}
                onChange={(e) => setSettings(prev => ({ ...prev, ajax_username: e.target.value }))}
                placeholder="admin"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ajax_password">Parool (valikuline)</Label>
              <Input
                id="ajax_password"
                type="password"
                value={settings.ajax_password}
                onChange={(e) => setSettings(prev => ({ ...prev, ajax_password: e.target.value }))}
                placeholder="••••••••"
              />
              <p className="text-sm text-muted-foreground">
                Vajalik ainult siis, kui HUB nõuab autentimist
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-2">
            <Label htmlFor="ajax_hub_locations">HUB-ide asukohad (JSON)</Label>
            <Textarea
              id="ajax_hub_locations"
              value={settings.ajax_hub_locations}
              onChange={(e) => setSettings(prev => ({ ...prev, ajax_hub_locations: e.target.value }))}
              placeholder='{"HUB-001": "Tartu keskus", "HUB-002": "Tallinn südalinn"}'
              rows={4}
            />
            <p className="text-sm text-muted-foreground">
              JSON formaat: {`{"HUB-ID": "Asukoha kirjeldus"}`}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={saveSettings} disabled={saving}>
              {saving ? 'Salvestab...' : 'Salvesta seaded'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={testConnection} 
              disabled={testing || !settings.ajax_hub_ip}
            >
              <TestTube className="w-4 h-4 mr-2" />
              {testing ? 'Testib...' : 'Testi ühendust'}
            </Button>

            <Button variant="outline" onClick={loadSettings}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Värskenda
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lokaalne integratsioon juhenid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="bg-blue-50 p-3 rounded">
              <strong>Eelised:</strong>
              <ul className="mt-2 space-y-1">
                <li>• Ei vaja Ajax Cloud kontot</li>
                <li>• Kiire ja otsene ühendus</li>
                <li>• Töötab lokaalselt võrgus</li>
                <li>• Pole sõltuv internetist</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-3 rounded">
              <strong>Seadistamise sammud:</strong>
              <ol className="mt-2 space-y-1 list-decimal list-inside">
                <li>Leidke oma Ajax HUB'i IP aadress</li>
                <li>Sisestage IP aadress ülal (nt 192.168.1.100)</li>
                <li>Kui HUB nõuab autentimist, lisage kasutajanimi ja parool</li>
                <li>Määrake HUB-ide asukohad JSON formaadis</li>
                <li>Salvestage seaded ja testige ühendust</li>
                <li>Minge "Kapid" sektsiooni ja looge lukke</li>
              </ol>
            </div>
            
            <div className="bg-green-50 p-3 rounded">
              <strong>Toimimine:</strong>
              <ul className="mt-2 space-y-1">
                <li>• Süsteem saadab käsud otse Ajax HUB'ile</li>
                <li>• Kliendid saavad kappe avada oma broneeringute kaudu</li>
                <li>• Administraatorid saavad kappe manuaalselt avada</li>
                <li>• Kõik tegevused logitakse automaatselt</li>
                <li>• Töötab isegi siis, kui HUB on ajutiselt kättesaamatu</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-3 rounded">
              <strong>IP aadressi leidmine:</strong>
              <ul className="mt-2 space-y-1">
                <li><strong>1. Ajax Mobile äpp:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Avage Ajax Security System äpp</li>
                    <li>• Minge Settings → Users → Engineers</li>
                    <li>• Valige Hub → General → Ethernet või Wi-Fi</li>
                    <li>• IP aadress on näha võrgu seadetes</li>
                  </ul>
                </li>
                <li><strong>2. Ruuteri administreerimine:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Minge ruuteri lehele (tavaliselt 192.168.1.1 või 192.168.0.1)</li>
                    <li>• Otsige "Connected Devices" või "DHCP Client List"</li>
                    <li>• Leidke seade nimega "Ajax" või "Hub"</li>
                  </ul>
                </li>
                <li><strong>3. Käsurealt (Windows):</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Avage Command Prompt (CMD)</li>
                    <li>• Sisestage: <code className="bg-gray-200 px-1 rounded">arp -a | findstr "b0-c5-54"</code></li>
                    <li>• Ajax seadmed kasutavad tavaliselt seda MAC aadressi algust</li>
                  </ul>
                </li>
                <li><strong>4. IP skannimise rakendused:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Advanced IP Scanner (Windows)</li>
                    <li>• LanScan (macOS)</li>
                    <li>• Network Scanner (Android/iOS)</li>
                  </ul>
                </li>
              </ul>
              <div className="mt-3 p-2 bg-blue-100 rounded text-sm">
                <strong>Näide:</strong> Kui teie kodu WiFi on 192.168.1.x võrgus, siis Ajax HUB võib olla 192.168.1.100 või sarnane aadress.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};