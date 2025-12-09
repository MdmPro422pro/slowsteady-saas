// Skeleton loader components for consistent loading states

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-shadow-grey rounded ${className}`}
      style={{ backgroundImage: 'linear-gradient(90deg, #02040f 0%, #1a1a2e 50%, #02040f 100%)' }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
      <Skeleton className="h-4 w-1/3 mb-4" />
      <Skeleton className="h-8 w-2/3 mb-2" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-shadow-grey border border-faded-copper rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 flex-1">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonDashboardStats() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
          <Skeleton className="h-4 w-1/2 mb-3" />
          <Skeleton className="h-10 w-3/4" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonMessage() {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[70%] bg-midnight-violet border-2 border-faded-copper rounded-lg p-3">
        <div className="flex items-baseline gap-2 mb-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-2 w-16" />
        </div>
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  );
}

export function SkeletonBalance() {
  return (
    <div className="text-center p-6 bg-midnight-violet rounded-lg">
      <Skeleton className="h-4 w-16 mx-auto mb-2" />
      <Skeleton className="h-10 w-32 mx-auto mb-2" />
      <Skeleton className="h-3 w-24 mx-auto" />
    </div>
  );
}
