import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface HealthStatus {
  database: 'healthy' | 'degraded' | 'down';
  api: 'healthy' | 'degraded' | 'down';
  storage: 'healthy' | 'degraded' | 'down';
  overall: 'healthy' | 'degraded' | 'down';
  lastChecked: Date;
  details: {
    database?: string;
    api?: string;
    storage?: string;
  };
}

interface HealthCheckOptions {
  interval?: number; // in milliseconds
  enabled?: boolean;
}

export const useHealthCheck = (options: HealthCheckOptions = {}) => {
  const { interval = 60000, enabled = true } = options; // Default: check every minute
  
  const [status, setStatus] = useState<HealthStatus>({
    database: 'healthy',
    api: 'healthy',
    storage: 'healthy',
    overall: 'healthy',
    lastChecked: new Date(),
    details: {}
  });

  const [isChecking, setIsChecking] = useState(false);

  const checkDatabaseHealth = async (): Promise<{ status: 'healthy' | 'degraded' | 'down', detail?: string }> => {
    try {
      const start = Date.now();
      const { error } = await supabase.from('products').select('id').limit(1);
      const duration = Date.now() - start;

      if (error) {
        return { status: 'down', detail: error.message };
      }

      if (duration > 5000) {
        return { status: 'degraded', detail: `Slow response: ${duration}ms` };
      }

      return { status: 'healthy' };
    } catch (error) {
      return { status: 'down', detail: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const checkApiHealth = async (): Promise<{ status: 'healthy' | 'degraded' | 'down', detail?: string }> => {
    try {
      const start = Date.now();
      const response = await fetch('/favicon.ico', { method: 'HEAD' });
      const duration = Date.now() - start;

      if (!response.ok) {
        return { status: 'down', detail: `HTTP ${response.status}` };
      }

      if (duration > 3000) {
        return { status: 'degraded', detail: `Slow response: ${duration}ms` };
      }

      return { status: 'healthy' };
    } catch (error) {
      return { status: 'down', detail: error instanceof Error ? error.message : 'Network error' };
    }
  };

  const checkStorageHealth = async (): Promise<{ status: 'healthy' | 'degraded' | 'down', detail?: string }> => {
    try {
      const start = Date.now();
      const { error } = await supabase.storage.from('products').list('', { limit: 1 });
      const duration = Date.now() - start;

      if (error) {
        return { status: 'down', detail: error.message };
      }

      if (duration > 3000) {
        return { status: 'degraded', detail: `Slow response: ${duration}ms` };
      }

      return { status: 'healthy' };
    } catch (error) {
      return { status: 'down', detail: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const performHealthCheck = useCallback(async () => {
    if (!enabled || isChecking) return;

    setIsChecking(true);

    try {
      const [databaseResult, apiResult, storageResult] = await Promise.all([
        checkDatabaseHealth(),
        checkApiHealth(),
        checkStorageHealth()
      ]);

      const newStatus: HealthStatus = {
        database: databaseResult.status,
        api: apiResult.status,
        storage: storageResult.status,
        overall: 'healthy',
        lastChecked: new Date(),
        details: {
          database: databaseResult.detail,
          api: apiResult.detail,
          storage: storageResult.detail
        }
      };

      // Determine overall status
      const statuses = [databaseResult.status, apiResult.status, storageResult.status];
      if (statuses.includes('down')) {
        newStatus.overall = 'down';
      } else if (statuses.includes('degraded')) {
        newStatus.overall = 'degraded';
      }

      setStatus(newStatus);

      // Log critical issues
      if (newStatus.overall === 'down') {
        console.error('Critical system health issue detected:', newStatus);
      } else if (newStatus.overall === 'degraded') {
        console.warn('System performance degraded:', newStatus);
      }

    } catch (error) {
      console.error('Health check failed:', error);
      setStatus(prev => ({
        ...prev,
        overall: 'down',
        lastChecked: new Date(),
        details: { ...prev.details, api: 'Health check failed' }
      }));
    } finally {
      setIsChecking(false);
    }
  }, [enabled, isChecking]);

  useEffect(() => {
    if (!enabled) return;

    // Initial check
    performHealthCheck();

    // Set up interval
    const intervalId = setInterval(performHealthCheck, interval);

    return () => clearInterval(intervalId);
  }, [enabled, interval, performHealthCheck]);

  return {
    status,
    isChecking,
    checkNow: performHealthCheck
  };
};

// Component to display health status  
export const HealthIndicator = ({ className }: { className?: string }) => {
  const { status } = useHealthCheck({ interval: 30000 });

  const getStatusColor = (statusType: 'healthy' | 'degraded' | 'down') => {
    switch (statusType) {
      case 'healthy':
        return 'bg-success';
      case 'degraded':
        return 'bg-warning';
      case 'down':
        return 'bg-destructive';
    }
  };

  if (status.overall === 'healthy') return null;

  return React.createElement('div', 
    { className: `fixed bottom-4 right-4 p-2 rounded-lg border bg-card shadow-lg ${className}` },
    React.createElement('div', 
      { className: "flex items-center gap-2 text-sm" },
      React.createElement('div', { className: `w-2 h-2 rounded-full ${getStatusColor(status.overall)}` }),
      React.createElement('span', null, 
        status.overall === 'degraded' ? 'Süsteem töötab aeglaselt' : 'Süsteemi probleem'
      )
    )
  );
};