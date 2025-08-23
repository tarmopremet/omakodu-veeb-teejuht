import { useState, useEffect } from 'react';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const OfflineDetector: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineAlert(false);
      toast({
        title: "Ühendus taastatud",
        description: "Internetiühendus on tagasi!",
        variant: "default",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineAlert(true);
      toast({
        title: "Internetiühendus puudub",
        description: "Palun kontrollige oma internetiühendust.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection quality periodically
    const checkConnection = async () => {
      try {
        // Try to fetch a small resource to check real connectivity
        const response = await fetch('/favicon.ico', {
          method: 'HEAD',
          cache: 'no-cache'
        });
        
        if (!response.ok && isOnline) {
          handleOffline();
        }
      } catch (error) {
        if (isOnline) {
          handleOffline();
        }
      }
    };

    const intervalId = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [isOnline, toast]);

  const retryConnection = async () => {
    try {
      const response = await fetch('/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      if (response.ok) {
        setIsOnline(true);
        setShowOfflineAlert(false);
        toast({
          title: "Ühendus taastatud",
          description: "Internetiühendus töötab nüüd!",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Ühendus ebaõnnestus",
        description: "Internetiühendus ei ole veel saadaval.",
        variant: "destructive",
      });
    }
  };

  if (!showOfflineAlert) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-md">
      <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
        <WifiOff className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Internetiühendus puudub</span>
          <Button
            size="sm"
            variant="outline"
            onClick={retryConnection}
            className="ml-2 h-8"
          >
            <Wifi className="h-3 w-3 mr-1" />
            Proovi uuesti
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

// Hook for checking online status
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};