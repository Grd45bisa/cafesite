import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Ruang Kelola | CafeSite",
  description: "Kelola pesanan, menu, meja, dan konten CafeSite.",
  robots: { index: false, follow: false },
};

export default function AdminPage(): React.JSX.Element {
  redirect("/dashboard");
}
