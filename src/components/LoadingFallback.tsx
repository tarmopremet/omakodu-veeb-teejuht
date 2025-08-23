import { Loader2, Package, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingFallbackProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'equipment' | 'booking';
  className?: string;
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  message = "Laadimine...",
  size = 'md',
  variant = 'default',
  className
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const getIcon = () => {
    switch (variant) {
      case 'equipment':
        return <Wrench className={cn(sizeClasses[size], "animate-spin")} />;
      case 'booking':
        return <Package className={cn(sizeClasses[size], "animate-spin")} />;
      default:
        return <Loader2 className={cn(sizeClasses[size], "animate-spin")} />;
    }
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center space-y-2 p-8",
      className
    )}>
      <div className="text-primary">
        {getIcon()}
      </div>
      <p className="text-sm text-muted-foreground text-center">
        {message}
      </p>
    </div>
  );
};

// Skeleton loader for cards
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("rounded-lg border bg-card p-6", className)}>
    <div className="space-y-4">
      <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
      <div className="h-4 w-full animate-pulse rounded bg-muted" />
      <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
      <div className="flex gap-2">
        <div className="h-8 w-20 animate-pulse rounded bg-muted" />
        <div className="h-8 w-24 animate-pulse rounded bg-muted" />
      </div>
    </div>
  </div>
);

// Table skeleton
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="rounded-lg border">
    <div className="border-b p-4">
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 w-24 animate-pulse rounded bg-muted" />
        ))}
      </div>
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="border-b p-4 last:border-b-0">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, j) => (
            <div key={j} className="h-4 w-20 animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

// Page loading skeleton
export const PageSkeleton: React.FC = () => (
  <div className="container mx-auto py-8 space-y-8">
    <div className="space-y-4">
      <div className="h-8 w-1/3 animate-pulse rounded bg-muted" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
    </div>
    
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  </div>
);