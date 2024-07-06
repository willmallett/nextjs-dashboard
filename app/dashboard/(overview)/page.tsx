import CardWrapper, {Card} from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import {lusitana} from '@/app/ui/fonts';
import {Suspense} from "react";
import {CardSkeleton, InvoiceSkeleton, RevenueChartSkeleton} from "@/app/ui/skeletons";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Dashboard',
};

export const experimental_ppr = true; // enable partial pre-rendering for this route

export default async function Page() {
    // this call is slow, moving it the RevenueChart component will make the page load faster
    // const revenue = await fetchRevenue();
    // moving this call into the LatestInvoices component as well:
    // const latestInvoices = await fetchLatestInvoices();
    // Removing these calls to group them for smoother streaming effect:
    // const {
    //     numberOfCustomers,
    //     numberOfInvoices,
    //     totalPaidInvoices,
    //     totalPendingInvoices
    // } = await fetchCardData();

    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/*Removing these so we can "Group" them for smoother streaming effect*/}
                {/*<Card title="Collected" value={totalPaidInvoices} type="collected"/>*/}
                {/*<Card title="Pending" value={totalPendingInvoices} type="pending"/>*/}
                {/*<Card title="Total Invoices" value={numberOfInvoices} type="invoices"/>*/}
                {/*<Card*/}
                {/*    title="Total Customers"*/}
                {/*    value={numberOfCustomers}*/}
                {/*    type="customers"*/}
                {/*/>*/}
                <Suspense fallback={<CardSkeleton />}>
                    <CardWrapper />
                </Suspense>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart />
                </Suspense>
                {/*// suspend the latest invoices component*/}
                <Suspense fallback={<InvoiceSkeleton />}>
                    <LatestInvoices />
                </Suspense>
            </div>
        </main>
    );
}
