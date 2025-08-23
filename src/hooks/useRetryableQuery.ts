import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface RetryableQueryOptions<T> extends Omit<UseQueryOptions<T>, 'retry' | 'retryDelay'> {
  maxRetries?: number;
  retryDelay?: number | ((attempt: number) => number);
  showErrorToast?: boolean;
  fallbackData?: T;
}

interface RetryableQueryResult<T> extends UseQueryResult<T> {
  retryCount: number;
  manualRetry: () => void;
}

export const useRetryableQuery = <T>(
  options: RetryableQueryOptions<T>
): RetryableQueryResult<T> => {
  const {
    maxRetries = 3,
    retryDelay = (attempt) => Math.min(1000 * Math.pow(2, attempt), 30000), // Exponential backoff
    showErrorToast = true,
    fallbackData,
    onError,
    ...queryOptions
  } = options;

  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  const queryResult = useQuery({
    ...queryOptions,
    retry: (failureCount, error) => {
      setRetryCount(failureCount);
      
      if (failureCount >= maxRetries) {
        if (showErrorToast) {
          toast({
            title: "Andmete laadimine ebaõnnestus",
            description: `Proovitud ${maxRetries} korda. Palun kontrollige internetiühendust.`,
            variant: "destructive",
          });
        }
        return false;
      }
      
      return true;
    },
    retryDelay: typeof retryDelay === 'function' ? retryDelay : () => retryDelay,
    onError: (error: Error) => {
      console.error('Query error:', error);
      onError?.(error);
    },
    // Use fallback data if available
    placeholderData: fallbackData,
  });

  const manualRetry = useCallback(() => {
    setRetryCount(0);
    queryResult.refetch();
  }, [queryResult]);

  return {
    ...queryResult,
    retryCount,
    manualRetry,
  };
};

// Hook for handling API errors consistently
export const useApiErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((error: Error, context?: string) => {
    console.error(`API Error${context ? ` in ${context}` : ''}:`, error);

    // Determine error type and show appropriate message
    let title = "Viga";
    let description = "Midagi läks valesti. Palun proovige uuesti.";

    if (error.message.includes('network') || error.message.includes('fetch')) {
      title = "Võrguühenduse viga";
      description = "Palun kontrollige internetiühendust ja proovige uuesti.";
    } else if (error.message.includes('timeout')) {
      title = "Taotlus aegus";
      description = "Server ei vastanud õigeks ajaks. Palun proovige uuesti.";
    } else if (error.message.includes('unauthorized') || error.message.includes('401')) {
      title = "Autoriseerimise viga";
      description = "Palun logige sisse uuesti.";
    } else if (error.message.includes('forbidden') || error.message.includes('403')) {
      title = "Juurdepääs keelatud";
      description = "Teil pole õigusi selle toimingu jaoks.";
    } else if (error.message.includes('404')) {
      title = "Ei leitud";
      description = "Otsitud ressurss ei ole saadaval.";
    } else if (error.message.includes('500')) {
      title = "Serveri viga";
      description = "Serveri poolne viga. Meie arendajad on sellest teavitatud.";
    }

    toast({
      title,
      description,
      variant: "destructive",
    });

    // Log error details for debugging
    const errorData = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.error('Detailed error data:', errorData);

    // In production, send to monitoring service
    // reportErrorToService(errorData);

  }, [toast]);

  return { handleError };
};

// Utility function for creating resilient API calls
export const createResilientApiCall = <T>(
  apiCall: () => Promise<T>,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    shouldRetry?: (error: Error) => boolean;
  } = {}
): Promise<T> => {
  const { maxRetries = 3, retryDelay = 1000, shouldRetry = () => true } = options;

  return new Promise(async (resolve, reject) => {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await apiCall();
        resolve(result);
        return;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt === maxRetries || !shouldRetry(lastError)) {
          reject(lastError);
          return;
        }

        // Wait before retrying
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
        }
      }
    }
  });
};