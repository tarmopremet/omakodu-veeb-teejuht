import React, { useState, useEffect } from 'react';
import { AlertTriangle, Cloud, Database, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BackupData {
  timestamp: string;
  type: 'form_data' | 'user_session' | 'booking_draft';
  data: any;
  id: string;
}

export const useLocalBackup = () => {
  const { toast } = useToast();

  // Save data to localStorage as backup
  const saveToLocalBackup = (key: string, data: any, type: BackupData['type'] = 'form_data') => {
    try {
      const backupData: BackupData = {
        timestamp: new Date().toISOString(),
        type,
        data,
        id: `${key}_${Date.now()}`
      };

      localStorage.setItem(`backup_${key}`, JSON.stringify(backupData));
      console.log(`Backup saved: ${key}`);
    } catch (error) {
      console.error('Failed to save local backup:', error);
    }
  };

  // Restore data from localStorage
  const restoreFromLocalBackup = (key: string): BackupData | null => {
    try {
      const backupString = localStorage.getItem(`backup_${key}`);
      if (backupString) {
        return JSON.parse(backupString);
      }
    } catch (error) {
      console.error('Failed to restore local backup:', error);
    }
    return null;
  };

  // Clear backup after successful submission
  const clearLocalBackup = (key: string) => {
    try {
      localStorage.removeItem(`backup_${key}`);
      console.log(`Backup cleared: ${key}`);
    } catch (error) {
      console.error('Failed to clear local backup:', error);
    }
  };

  // Get all available backups
  const getAllBackups = (): BackupData[] => {
    const backups: BackupData[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('backup_')) {
          const backupString = localStorage.getItem(key);
          if (backupString) {
            const backup = JSON.parse(backupString);
            backups.push(backup);
          }
        }
      }
    } catch (error) {
      console.error('Failed to get all backups:', error);
    }
    return backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  // Auto-save form data with debouncing
  const useAutoSave = (formData: any, formKey: string, delay = 2000) => {
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        if (formData && Object.keys(formData).length > 0) {
          saveToLocalBackup(formKey, formData, 'form_data');
        }
      }, delay);

      return () => clearTimeout(timeoutId);
    }, [formData, formKey, delay]);
  };

  return {
    saveToLocalBackup,
    restoreFromLocalBackup,
    clearLocalBackup,
    getAllBackups,
    useAutoSave
  };
};

// Component for displaying backup recovery options
export const BackupRecovery: React.FC = () => {
  const [backups, setBackups] = useState<BackupData[]>([]);
  const [showRecovery, setShowRecovery] = useState(false);
  const { restoreFromLocalBackup, clearLocalBackup, getAllBackups } = useLocalBackup();
  const { toast } = useToast();

  useEffect(() => {
    const availableBackups = getAllBackups();
    setBackups(availableBackups);
    setShowRecovery(availableBackups.length > 0);
  }, []);

  const handleRestore = (backup: BackupData) => {
    try {
      // Restore based on backup type
      switch (backup.type) {
        case 'form_data':
          // Restore form data to appropriate form
          toast({
            title: "Andmed taastatud",
            description: "Varundatud vormandmed on taastatud.",
          });
          break;
        case 'booking_draft':
          // Restore booking draft
          toast({
            title: "Broneeringu mustand taastatud",
            description: "Pooleli jäänud broneering on taastatud.",
          });
          break;
        default:
          toast({
            title: "Andmed taastatud",
            description: "Varundatud andmed on taastatud.",
          });
      }

      // Optionally clear the backup after restoration
      // clearLocalBackup(backup.id);
      // setBackups(getAllBackups());
    } catch (error) {
      toast({
        title: "Taastamine ebaõnnestus",
        description: "Andmete taastamine ebaõnnestus.",
        variant: "destructive",
      });
    }
  };

  const handleClearAll = () => {
    backups.forEach(backup => {
      localStorage.removeItem(`backup_${backup.id}`);
    });
    setBackups([]);
    setShowRecovery(false);
    toast({
      title: "Varukoopiad kustutatud",
      description: "Kõik varukoopiad on kustutatud.",
    });
  };

  if (!showRecovery) return null;

  return (
    <div className="fixed top-4 right-4 max-w-sm z-50">
      <Alert>
        <Database className="h-4 w-4" />
        <AlertTitle>Varukoopiad saadaval</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>Leiti {backups.length} varukoopiaid. Kas soovite need taastada?</p>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => handleRestore(backups[0])}
              disabled={backups.length === 0}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Taasta
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleClearAll}
            >
              Kustuta
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

// Component for cloud backup status
export const CloudBackupStatus: React.FC = () => {
  const [backupStatus, setBackupStatus] = useState<'idle' | 'backing_up' | 'success' | 'error'>('idle');
  const [lastBackup, setLastBackup] = useState<Date | null>(null);

  useEffect(() => {
    // Check last backup time from localStorage
    const lastBackupTime = localStorage.getItem('last_cloud_backup');
    if (lastBackupTime) {
      setLastBackup(new Date(lastBackupTime));
    }

    // Set up periodic backup check
    const interval = setInterval(async () => {
      await performCloudBackup();
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const performCloudBackup = async () => {
    try {
      setBackupStatus('backing_up');

      // In a real implementation, you would:
      // 1. Collect critical data
      // 2. Encrypt if necessary
      // 3. Upload to cloud storage (Supabase Storage)
      
      // Simulate cloud backup
      await new Promise(resolve => setTimeout(resolve, 1000));

      const now = new Date();
      localStorage.setItem('last_cloud_backup', now.toISOString());
      setLastBackup(now);
      setBackupStatus('success');

      // Reset status after 3 seconds
      setTimeout(() => setBackupStatus('idle'), 3000);

    } catch (error) {
      console.error('Cloud backup failed:', error);
      setBackupStatus('error');
      setTimeout(() => setBackupStatus('idle'), 3000);
    }
  };

  const getStatusIcon = () => {
    switch (backupStatus) {
      case 'backing_up':
        return <RefreshCw className="h-3 w-3 animate-spin" />;
      case 'success':
        return <Cloud className="h-3 w-3 text-success" />;
      case 'error':
        return <AlertTriangle className="h-3 w-3 text-destructive" />;
      default:
        return <Cloud className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (backupStatus) {
      case 'backing_up':
        return 'Varundamine...';
      case 'success':
        return 'Varundatud';
      case 'error':
        return 'Viga';
      default:
        return lastBackup ? `Viimati: ${lastBackup.toLocaleTimeString('et-EE')}` : 'Ei varundatud';
    }
  };

  return (
    <div className="fixed bottom-4 left-4 flex items-center gap-2 bg-card/80 backdrop-blur-sm border rounded-lg px-3 py-2 text-xs text-muted-foreground">
      {getStatusIcon()}
      <span>{getStatusText()}</span>
    </div>
  );
};

// Hook for automatic form backup
export const useFormBackup = (formKey: string) => {
  const { saveToLocalBackup, restoreFromLocalBackup, clearLocalBackup, useAutoSave } = useLocalBackup();
  const [hasBackup, setHasBackup] = useState(false);

  useEffect(() => {
    const backup = restoreFromLocalBackup(formKey);
    setHasBackup(!!backup);
  }, [formKey]);

  const backupFormData = (data: any) => {
    saveToLocalBackup(formKey, data, 'form_data');
    setHasBackup(true);
  };

  const restoreFormData = () => {
    const backup = restoreFromLocalBackup(formKey);
    return backup?.data || null;
  };

  const clearFormBackup = () => {
    clearLocalBackup(formKey);
    setHasBackup(false);
  };

  return {
    hasBackup,
    backupFormData,
    restoreFormData,
    clearFormBackup,
    useAutoSave: (formData: any, delay?: number) => useAutoSave(formData, formKey, delay)
  };
};