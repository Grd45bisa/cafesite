import type { Metadata } from "next";
import AuthLogin from "@/components/admin/AuthLogin";
export const metadata:Metadata={title:"Masuk Dashboard",robots:{index:false,follow:false}};
export default function AuthPage():React.JSX.Element{return <AuthLogin/>}
