import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-surface border border-border rounded-xl p-6 space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="bg-surface border border-border rounded-xl p-6 space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-20" />
        </div>
        <div className="bg-surface border border-border rounded-xl p-6 space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-16" />
        </div>
      </div>

      {/* Action Card Skeleton */}
      <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-48" />
      </div>
    </div>
  );
}
