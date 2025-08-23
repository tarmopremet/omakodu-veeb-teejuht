import { useState, useEffect } from "react";
import { Mail, Phone, Facebook, Instagram } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Footer = () => {
  const [settings, setSettings] = useState<{ [key: string]: string }>({
    facebook_url: "https://www.facebook.com/rendiise",
    instagram_url: "https://www.instagram.com/rendiise",
    phone_number: "+372 502 7355",
    email: "info@rendiise.ee"
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['facebook_url', 'instagram_url', 'phone_number', 'email']);

      if (error) throw error;

      const settingsMap: { [key: string]: string } = {};
      data?.forEach(setting => {
        if (setting.setting_value) {
          settingsMap[setting.setting_key] = setting.setting_value;
        }
      });
      
      setSettings(prev => ({ ...prev, ...settingsMap }));
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };
  return (
    <footer className="bg-gray-800 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Kontaktid</h3>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-lg">Rendiise OÜ</p>
                <p className="text-gray-300">Reg. nr: 10646588</p>
                <p className="text-gray-300">KMKR nr: EE100645776</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-blue-400" />
                <a href={`mailto:${settings.email}`} className="text-blue-400 hover:text-blue-300">
                  {settings.email}
                </a>
              </div>
              
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-blue-400" />
                <a href={`tel:${settings.phone_number}`} className="text-blue-400 hover:text-blue-300">
                  {settings.phone_number}
                </a>
              </div>
            </div>
          </div>
          
          {/* Legal Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Tingimused</h3>
            <div className="space-y-2">
              <a href="/privaatsustingimused" className="text-gray-300 hover:text-white block">
                Privaatsustingimused
              </a>
              <a href="/kasutustingimused" className="text-gray-300 hover:text-white block">
                Kasutustingimused
              </a>
              <a href="/rendieeskiri" className="text-gray-300 hover:text-white block">
                Rendieeskiri
              </a>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-4">Jälgi meid</h3>
            <div className="space-y-3">
              <a 
                href={settings.facebook_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5 text-blue-400" />
                <span>Facebook</span>
              </a>
              
              <a 
                href={settings.instagram_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5 text-pink-400" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Rendiise OÜ. Kõik õigused kaitstud.
          </p>
        </div>
      </div>
    </footer>
  );
};