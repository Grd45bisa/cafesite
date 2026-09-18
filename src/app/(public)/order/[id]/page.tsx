import { OrderTracking } from "@/components/order/OrderTracking";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import type { OrderTrackingPageProps } from "@/types/ordering";

export const metadata: Metadata = {
  title: "Status pesanan",
  description: "Pantau nomor antrian dan status pesanan CafeSite milikmu.",
  robots: { index: false, follow: false },
};

export default async function OrderTrackingPage({ params }: OrderTrackingPageProps): Promise<ReactElement> {
  const { id } = await params;
  return <OrderTracking orderId={id} />;
}
