import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Facebook, Instagram, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  setting_type: string;
  description: string | null;
}

export const AdminSettings = () => {
  const [settings, setSettings] = useState<{ [key: string]: SiteSetting }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;

      const settingsMap: { [key: string]: SiteSetting } = {};
      data?.forEach(setting => {
        settingsMap[setting.setting_key] = setting;
      });
      
      setSettings(settingsMap);
    } catch (error: any) {
      toast({
        title: "Viga",
        description: `Seadete laadimisel tekkis viga: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        setting_value: value
      }
    }));
  };

  const saveSetting = async (setting: SiteSetting) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('site_settings')
        .update({
          setting_value: setting.setting_value
        })
        .eq('id', setting.id);

      if (error) throw error;

      toast({
        title: "Õnnestus!",
        description: "Seade on salvestatud",
      });
    } catch (error: any) {
      toast({
        title: "Viga",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveAllSettings = async () => {
    try {
      setSaving(true);
      
      for (const setting of Object.values(settings)) {
        const { error } = await supabase
          .from('site_settings')
          .update({
            setting_value: setting.setting_value
          })
          .eq('id', setting.id);

        if (error) throw error;
      }

      toast({
        title: "Õnnestus!",
        description: "Kõik seaded on salvestatud",
      });
    } catch (error: any) {
      toast({
        title: "Viga",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getSettingIcon = (key: string) => {
    switch (key) {
      case 'facebook_url':
        return <Facebook className="w-5 h-5 text-blue-600" />;
      case 'instagram_url':
        return <Instagram className="w-5 h-5 text-pink-600" />;
      case 'email':
        return <Mail className="w-5 h-5 text-gray-600" />;
      case 'phone_number':
        return <Phone className="w-5 h-5 text-gray-600" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">Laadin seadeid...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saidi seaded</CardTitle>
        <p className="text-sm text-gray-500">
          Halda sotsiaalmeedia linke ja kontaktandmeid
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {Object.entries(settings).map(([key, setting]) => (
            <div key={key} className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                {getSettingIcon(key)}
                <div>
                  <Label className="text-base font-medium">
                    {setting.description || setting.setting_key}
                  </Label>
                  {setting.setting_key === 'facebook_url' && (
                    <p className="text-xs text-gray-500">Facebook lehe täielik URL</p>
                  )}
                  {setting.setting_key === 'instagram_url' && (
                    <p className="text-xs text-gray-500">Instagram lehe täielik URL</p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={setting.setting_value || ''}
                  onChange={(e) => updateSetting(key, e.target.value)}
                  placeholder={
                    setting.setting_type === 'url' 
                      ? 'https://...' 
                      : setting.setting_type === 'email'
                      ? 'email@example.com'
                      : setting.description || ''
                  }
                  type={setting.setting_type === 'email' ? 'email' : 'text'}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => saveSetting(setting)}
                  disabled={saving}
                >
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            Muudatused rakenduvad kohe pärast salvestamist
          </div>
          <Button 
            onClick={saveAllSettings}
            disabled={saving}
            className="min-w-[120px]"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Salvestab...' : 'Salvesta kõik'}
          </Button>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Juhised:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Facebook ja Instagram jaoks sisesta täielik URL (nt: https://www.facebook.com/sinu-leht)</li>
            <li>• Kontaktandmed kuvatakse saidi jaluses</li>
            <li>• Sotsiaalmeedia lingid avanevad uues aknas</li>
            <li>• Muudatused rakenduvad kohe pärast salvestamist</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};