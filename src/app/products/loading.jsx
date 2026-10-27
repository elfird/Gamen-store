import { StoreLayout, PageContainer } from "@/components/store";
import { Skeleton } from "@/components/ui";

export default function ProductsLoading() {
  return (
    <StoreLayout>
      <PageContainer className="py-8 sm:py-12">
        {/* Header Skeleton */}
        <div className="mb-8 space-y-3">
          <Skeleton height="h-8" width="240px" />
          <Skeleton height="h-4" width="380px" />
        </div>

        {/* Filter bar Skeleton */}
        <div className="mb-8 p-4 rounded-xl border border-border bg-surface flex flex-wrap gap-3">
          <Skeleton height="h-10" width="200px" rounded="md" />
          <Skeleton height="h-10" width="140px" rounded="md" />
          <Skeleton height="h-10" width="140px" rounded="md" />
          <Skeleton height="h-10" width="140px" rounded="md" />
        </div>

        {/* Product Cards Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border/60 bg-surface p-4 flex flex-col space-y-3"
            >
              <Skeleton height="h-44 sm:h-52" rounded="lg" className="w-full" />
              <div className="pt-2 space-y-2">
                <Skeleton height="h-3" width="40%" />
                <Skeleton height="h-5" width="85%" />
                <Skeleton height="h-4" width="60%" />
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </StoreLayout>
  );
}
