import type { Metadata } from "next";
import AdminDashboard from "@/components/admin/AdminDashboard";
export const metadata:Metadata={title:"Dashboard CafeSite",robots:{index:false,follow:false}};
export default function DashboardPage():React.JSX.Element{return <AdminDashboard/>}
