import { CartProvider } from "@/components/order/CartProvider";
import type { ReactElement } from "react";
import type { CartProviderProps } from "@/types/ordering";

export default function OrderLayout({ children }: CartProviderProps): ReactElement {
  return <CartProvider>{children}</CartProvider>;
}
