import { Skeleton } from '@/app/components/ui/skeleton';

export default function BlogPostSkeleton() {
  return (
    <section>
      {/* Title Skeleton */}
      <Skeleton className="h-8 w-3/4 mb-4 rounded-lg opacity-75 bg-gray-300 dark:bg-gray-700" />

      {/* Metadata Skeleton (Date and Views) */}
      <div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]">
        <Skeleton className="h-5 w-1/4 rounded-lg opacity-75 bg-gray-300 dark:bg-gray-700" />
        <Skeleton className="h-5 w-1/4 rounded-lg opacity-75 bg-gray-300 dark:bg-gray-700" />
      </div>

      {/* Content Skeleton */}
      <article className="pb-20 space-y-4">
        <Skeleton className="h-6 w-full rounded-lg opacity-75 bg-gray-300 dark:bg-gray-700" />
        <Skeleton className="h-6 w-full rounded-lg opacity-75 bg-gray-300 dark:bg-gray-700" />
        <Skeleton className="h-6 w-5/6 rounded-lg opacity-75 bg-gray-300 dark:bg-gray-700" />
        <Skeleton className="h-6 w-full rounded-lg opacity-75 bg-gray-300 dark:bg-gray-700" />
        <Skeleton className="h-6 w-3/4 rounded-lg opacity-75 bg-gray-300 dark:bg-gray-700" />
        <Skeleton className="h-6 w-full rounded-lg opacity-75 bg-gray-300 dark:bg-gray-700" />
        <Skeleton className="h-6 w-1/2 rounded-lg opacity-75 bg-gray-300 dark:bg-gray-700" />
      </article>
    </section>
  );
}
