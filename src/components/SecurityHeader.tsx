import { useEffect } from 'react';

export const SecurityHeader: React.FC = () => {
  useEffect(() => {
    // Set security headers via meta tags (for additional protection)
    const setSecurityMeta = () => {
      // Content Security Policy
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://analytics.google.com; frame-ancestors 'none';";
      
      // X-Frame-Options
      const xFrameOptionsMeta = document.createElement('meta');
      xFrameOptionsMeta.httpEquiv = 'X-Frame-Options';
      xFrameOptionsMeta.content = 'DENY';
      
      // X-Content-Type-Options
      const xContentTypeMeta = document.createElement('meta');
      xContentTypeMeta.httpEquiv = 'X-Content-Type-Options';
      xContentTypeMeta.content = 'nosniff';
      
      // Referrer Policy
      const referrerPolicyMeta = document.createElement('meta');
      referrerPolicyMeta.name = 'referrer';
      referrerPolicyMeta.content = 'strict-origin-when-cross-origin';
      
      // Permissions Policy
      const permissionsPolicyMeta = document.createElement('meta');
      permissionsPolicyMeta.httpEquiv = 'Permissions-Policy';
      permissionsPolicyMeta.content = 'camera=(), microphone=(), geolocation=(self), payment=(self)';

      // Check if already exists before adding
      if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
        document.head.appendChild(cspMeta);
      }
      if (!document.querySelector('meta[http-equiv="X-Frame-Options"]')) {
        document.head.appendChild(xFrameOptionsMeta);
      }
      if (!document.querySelector('meta[http-equiv="X-Content-Type-Options"]')) {
        document.head.appendChild(xContentTypeMeta);
      }
      if (!document.querySelector('meta[name="referrer"]')) {
        document.head.appendChild(referrerPolicyMeta);
      }
      if (!document.querySelector('meta[http-equiv="Permissions-Policy"]')) {
        document.head.appendChild(permissionsPolicyMeta);
      }
    };

    setSecurityMeta();

    // Disable right-click context menu in production
    const handleContextMenu = (e: MouseEvent) => {
      if (process.env.NODE_ENV === 'production') {
        e.preventDefault();
      }
    };

    // Disable F12, Ctrl+Shift+I, Ctrl+U in production
    const handleKeyDown = (e: KeyboardEvent) => {
      if (process.env.NODE_ENV === 'production') {
        // Disable F12
        if (e.key === 'F12') {
          e.preventDefault();
        }
        
        // Disable Ctrl+Shift+I (Developer Tools)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
          e.preventDefault();
        }
        
        // Disable Ctrl+U (View Source)
        if (e.ctrlKey && e.key === 'u') {
          e.preventDefault();
        }
        
        // Disable Ctrl+S (Save Page)
        if (e.ctrlKey && e.key === 's') {
          e.preventDefault();
        }
      }
    };

    // Detect developer tools (basic detection)
    const detectDevTools = () => {
      if (process.env.NODE_ENV === 'production') {
        const threshold = 160;
        
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
          console.warn('Developer tools detected');
          // You could log this to your monitoring service
        }
      }
    };

    // Set up event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    
    // Check for dev tools periodically
    const devToolsInterval = setInterval(detectDevTools, 1000);

    // Clean up
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(devToolsInterval);
    };
  }, []);

  return null;
};

// Hook for secure data handling
export const useSecureData = () => {
  const sanitizeInput = (input: string): string => {
    // Basic XSS prevention
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 254;
  };

  const validatePhone = (phone: string): boolean => {
    // Estonian phone number validation
    const phoneRegex = /^(\+372|372)?[-\s]?[0-9]{7,8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validatePersonalCode = (code: string): boolean => {
    // Estonian personal code validation (basic)
    const codeRegex = /^[1-6]\d{10}$/;
    return codeRegex.test(code);
  };

  const encryptSensitiveData = (data: string): string => {
    // Basic encoding (in production, use proper encryption)
    if (typeof btoa !== 'undefined') {
      return btoa(data);
    }
    return data;
  };

  const decryptSensitiveData = (encryptedData: string): string => {
    // Basic decoding (in production, use proper decryption)
    try {
      if (typeof atob !== 'undefined') {
        return atob(encryptedData);
      }
      return encryptedData;
    } catch {
      return encryptedData;
    }
  };

  return {
    sanitizeInput,
    validateEmail,
    validatePhone,
    validatePersonalCode,
    encryptSensitiveData,
    decryptSensitiveData,
  };
};

// Component for secure form handling
export const SecureFormWrapper: React.FC<{ 
  children: React.ReactNode;
  onSubmit: (data: FormData) => void;
}> = ({ children, onSubmit }) => {
  const { sanitizeInput } = useSecureData();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    
    // Sanitize all form inputs
    const sanitizedData = new FormData();
    formData.forEach((value, key) => {
      if (typeof value === 'string') {
        sanitizedData.append(key, sanitizeInput(value));
      } else {
        sanitizedData.append(key, value);
      }
    });
    
    onSubmit(sanitizedData);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {children}
    </form>
  );
};