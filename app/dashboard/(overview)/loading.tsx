import DashboardSkeleton from '@/app/ui/skeletons';

// This is no longer being used since all the components are now using their own Suspense fallbacks
export default function Loading() {
    return <DashboardSkeleton />;
}
