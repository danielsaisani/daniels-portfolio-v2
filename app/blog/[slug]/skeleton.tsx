import { Skeleton } from '@/app/components/ui/skeleton';

export default function BlogPostSkeleton() {
  return (
    <section>
      {/* Title Skeleton */}
      <Skeleton className="h-8 w-3/4 mb-4 rounded-lg" />

      {/* Metadata Skeleton (Date and Views) */}
      <div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]">
        <Skeleton className="h-5 w-1/4 rounded-lg" />
        <Skeleton className="h-5 w-1/4 rounded-lg" />
      </div>

      {/* Content Skeleton */}
      <article className="pb-20 space-y-4">
        <Skeleton className="h-6 w-full rounded-lg" />
        <Skeleton className="h-6 w-full rounded-lg" />
        <Skeleton className="h-6 w-5/6 rounded-lg" />
        <Skeleton className="h-6 w-full rounded-lg" />
        <Skeleton className="h-6 w-3/4 rounded-lg" />
        <Skeleton className="h-6 w-full rounded-lg" />
        <Skeleton className="h-6 w-1/2 rounded-lg" />
      </article>
    </section>
  );
}
