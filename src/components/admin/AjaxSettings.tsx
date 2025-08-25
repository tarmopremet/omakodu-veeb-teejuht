import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, Wifi, WifiOff, RefreshCw, TestTube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AjaxSettings {
  ajax_cloud_email: string;
  ajax_cloud_password: string;
  ajax_cloud_app_id: string;
  ajax_hub_locations: string;
}

export const AjaxSettings: React.FC = () => {
  const [settings, setSettings] = useState<AjaxSettings>({
    ajax_cloud_email: '',
    ajax_cloud_password: '',
    ajax_cloud_app_id: '',
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
        description: 'Ajax Cloud seaded on edukalt salvestatud',
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
          description: `Leitud ${data.hubs?.length || 0} Ajax HUB-i`,
        });
      } else {
        setConnectionStatus('disconnected');
        throw new Error(data?.error || 'Ühenduse testimine ebaõnnestus');
      }
    } catch (error: any) {
      setConnectionStatus('disconnected');
      toast({
        title: 'Ühenduse viga',
        description: error.message || 'Ajax Cloud ühendus ebaõnnestus',
        variant: 'destructive',
      });
    } finally {
      setTesting(false);
    }
  };

  const getSettingDescription = (key: string): string => {
    switch (key) {
      case 'ajax_cloud_email':
        return 'Ajax Cloud konto email';
      case 'ajax_cloud_password':
        return 'Ajax Cloud konto parool';
      case 'ajax_cloud_app_id':
        return 'Ajax Cloud äppi ID (valikuline)';
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
          <h2 className="text-2xl font-bold tracking-tight">Ajax Integratsiooni seaded</h2>
          <p className="text-muted-foreground">
            Konfigureerige Ajax Cloud ühendus nutikappide juhtimiseks
          </p>
        </div>
        {getConnectionBadge()}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Ajax Cloud seaded
          </CardTitle>
          <CardDescription>
            Sisestage oma Ajax Cloud konto andmed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="ajax_cloud_email">Ajax Cloud Email *</Label>
              <Input
                id="ajax_cloud_email"
                type="email"
                value={settings.ajax_cloud_email}
                onChange={(e) => setSettings(prev => ({ ...prev, ajax_cloud_email: e.target.value }))}
                placeholder="your-email@example.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ajax_cloud_password">Ajax Cloud Parool *</Label>
              <Input
                id="ajax_cloud_password"
                type="password"
                value={settings.ajax_cloud_password}
                onChange={(e) => setSettings(prev => ({ ...prev, ajax_cloud_password: e.target.value }))}
                placeholder="••••••••"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ajax_cloud_app_id">Ajax Cloud App ID (valikuline)</Label>
              <Input
                id="ajax_cloud_app_id"
                value={settings.ajax_cloud_app_id}
                onChange={(e) => setSettings(prev => ({ ...prev, ajax_cloud_app_id: e.target.value }))}
                placeholder="12345"
              />
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
              disabled={testing || !settings.ajax_cloud_email || !settings.ajax_cloud_password}
            >
              <TestTube className="w-4 h-4 mr-2" />
              {testing ? 'Testimaks...' : 'Testi ühendust'}
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
          <CardTitle>Integratsioonijuhised</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="bg-blue-50 p-3 rounded">
              <strong>Eeltingimused:</strong>
              <ul className="mt-2 space-y-1">
                <li>• Ajax Cloud konto peab olema loodud</li>
                <li>• Ajax HUB peab olema ühendatud internetiga</li>
                <li>• Ajax relay/switch seadmed peavad olema seadistatud</li>
                <li>• Kõik seadmed peavad olema lisatud Ajax Cloud äppi</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-3 rounded">
              <strong>Seadistamise sammud:</strong>
              <ol className="mt-2 space-y-1 list-decimal list-inside">
                <li>Sisestage Ajax Cloud konto email ja parool</li>
                <li>Lisage Ajax Cloud App ID (kui teate)</li>
                <li>Määrake HUB-ide asukohad JSON formaadis</li>
                <li>Salvestage seaded ja testige ühendust</li>
                <li>Minge "Kapid" sektsiooni ja looge lukke</li>
              </ol>
            </div>
            
            <div className="bg-green-50 p-3 rounded">
              <strong>Toimimine:</strong>
              <ul className="mt-2 space-y-1">
                <li>• Kliendid saavad avada kappe oma broneeringute kaudu</li>
                <li>• Administraatorid saavad kappe manuaalselt avada</li>
                <li>• Kõik tegevused logitakse automaatselt</li>
                <li>• Süsteem kontrollib broneeringute kehtivust enne avamist</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};