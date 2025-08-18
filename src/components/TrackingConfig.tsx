import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const TrackingConfig: React.FC = () => {
  const [gaId, setGaId] = useState('');
  const [fbPixelId, setFbPixelId] = useState('');
  const [gtmId, setGtmId] = useState('');
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Kopeeritud!",
      description: "Kood on lõikelauale kopeeritud.",
    });
  };

  const gaSetupInstructions = `
1. Mine Google Analytics (analytics.google.com)
2. Loo uus konto või vali olemasolev
3. Loo uus omadus (Property)
4. Kopeeri Measurement ID (G-XXXXXXXXXX)
5. Lisa see ID siia konfiguratsiooni
  `;

  const fbPixelInstructions = `
1. Mine Facebook Business Manager
2. Ava Events Manager
3. Loo uus Pixel või vali olemasolev
4. Kopeeri Pixel ID (15-16 numbrit)
5. Lisa see ID siia konfiguratsiooni
  `;

  const gtmInstructions = `
1. Mine Google Tag Manager (tagmanager.google.com)
2. Loo uus konto või vali olemasolev
3. Loo uus kontainer
4. Kopeeri Container ID (GTM-XXXXXXX)
5. Lisa see ID siia konfiguratsiooni
  `;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Analüütika ja Jälgimise Seadistus
        </h1>
        <p className="text-muted-foreground">
          Seadista Google Analytics, Facebook Pixel ja Google Tag Manager oma veebilehele
        </p>
      </div>

      <Tabs defaultValue="config" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="config">Konfigureerimine</TabsTrigger>
          <TabsTrigger value="ga">Google Analytics</TabsTrigger>
          <TabsTrigger value="fb">Facebook Pixel</TabsTrigger>
          <TabsTrigger value="gtm">Tag Manager</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Jälgimise ID-d</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ga-id">Google Analytics ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="ga-id"
                      placeholder="G-XXXXXXXXXX"
                      value={gaId}
                      onChange={(e) => setGaId(e.target.value)}
                    />
                    <Badge variant={gaId ? "default" : "secondary"}>
                      {gaId ? <CheckCircle className="w-3 h-3" /> : "Pole määratud"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fb-id">Facebook Pixel ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="fb-id"
                      placeholder="000000000000000"
                      value={fbPixelId}
                      onChange={(e) => setFbPixelId(e.target.value)}
                    />
                    <Badge variant={fbPixelId ? "default" : "secondary"}>
                      {fbPixelId ? <CheckCircle className="w-3 h-3" /> : "Pole määratud"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gtm-id">Google Tag Manager ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="gtm-id"
                      placeholder="GTM-XXXXXXX"
                      value={gtmId}
                      onChange={(e) => setGtmId(e.target.value)}
                    />
                    <Badge variant={gtmId ? "default" : "secondary"}>
                      {gtmId ? <CheckCircle className="w-3 h-3" /> : "Pole määratud"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Praegune konfiguratsioon:</h4>
                <div className="text-sm space-y-1">
                  <p>Google Analytics: {gaId || 'Pole konfigureeritud'}</p>
                  <p>Facebook Pixel: {fbPixelId || 'Pole konfigureeritud'}</p>
                  <p>Google Tag Manager: {gtmId || 'Pole konfigureeritud'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Koodinäited</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>TrackingProvider konfiguratsioon</Label>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(`<TrackingProvider config={{
  googleAnalyticsId: "${gaId || 'G-XXXXXXXXXX'}",
  facebookPixelId: "${fbPixelId || '000000000000000'}",
  googleTagManagerId: "${gtmId || 'GTM-XXXXXXX'}"
}}>`)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <pre className="p-3 bg-muted rounded text-sm overflow-x-auto">
{`<TrackingProvider config={{
  googleAnalyticsId: "${gaId || 'G-XXXXXXXXXX'}",
  facebookPixelId: "${fbPixelId || '000000000000000'}",
  googleTagManagerId: "${gtmId || 'GTM-XXXXXXX'}"
}}>`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ga" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Google Analytics Seadistus
                <ExternalLink className="w-4 h-4" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="text-sm whitespace-pre-line p-4 bg-muted rounded">
                {gaSetupInstructions}
              </pre>
              
              <div className="space-y-2">
                <h4 className="font-medium">Mis jälgitakse:</h4>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Lehekülje vaatamised</li>
                  <li>Kasutajate tegevused (klõpsud, vormid)</li>
                  <li>Renditoote vaatamised</li>
                  <li>Broneerimised ja ostud</li>
                  <li>Otsingud ja filtreerimised</li>
                </ul>
              </div>

              <Button asChild className="w-full">
                <a 
                  href="https://analytics.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ava Google Analytics
                </a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fb" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Facebook Pixel Seadistus
                <ExternalLink className="w-4 h-4" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="text-sm whitespace-pre-line p-4 bg-muted rounded">
                {fbPixelInstructions}
              </pre>
              
              <div className="space-y-2">
                <h4 className="font-medium">Facebook Pixel sündmused:</h4>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>PageView - Lehekülje vaatamised</li>
                  <li>ViewContent - Toote vaatamised</li>
                  <li>InitiateCheckout - Broneerimise alustamine</li>
                  <li>Purchase - Ostu sooritamine</li>
                  <li>Lead - Kontaktvormi täitmine</li>
                  <li>Search - Otsingud</li>
                </ul>
              </div>

              <Button asChild className="w-full">
                <a 
                  href="https://business.facebook.com/events_manager" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ava Facebook Events Manager
                </a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gtm" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Google Tag Manager Seadistus
                <ExternalLink className="w-4 h-4" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="text-sm whitespace-pre-line p-4 bg-muted rounded">
                {gtmInstructions}
              </pre>
              
              <div className="space-y-2">
                <h4 className="font-medium">GTM eelised:</h4>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Keskne jälgimise koodide haldus</li>
                  <li>Koodi muutmine ilma arendajata</li>
                  <li>Täpsem sündmuste jälgimine</li>
                  <li>A/B testide tugi</li>
                  <li>Kolmandate osapoolte integratsioonid</li>
                </ul>
              </div>

              <Button asChild className="w-full">
                <a 
                  href="https://tagmanager.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ava Google Tag Manager
                </a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>SEO Täiendused</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Automaatselt lisatud:</h4>
              <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                <li>Meta title ja description</li>
                <li>Open Graph tagid</li>
                <li>Twitter Card tagid</li>
                <li>Canonical URL-id</li>
                <li>Structured Data (JSON-LD)</li>
                <li>Sitemap.xml</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Täiendavad võimalused:</h4>
              <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                <li>Lehekülje kiiruse optimeerimine</li>
                <li>Mobiilisõbralikkus</li>
                <li>SSL sertifikaat</li>
                <li>Robots.txt konfiguratsioon</li>
                <li>XML sitemap automaatne genereerimine</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};