import type { ReactNode } from "react";
import type { MenuItem } from "./index";

export type AdminModule = "orders" | "menu" | "tables" | "cafe" | "gallery" | "testimonials" | "faq" | "location" | "reports" | "modules";
export interface AdminProfile { id: string; role: "admin" | "staff"; }
export interface AdminModuleSetting { id: string; enabled: boolean; }
export interface AdminBootstrap { profile: AdminProfile; modules: AdminModuleSetting[]; }
export interface AdminMenuRecord { id: string; data: MenuItem; is_available: boolean; sort_order: number; }
export interface AdminFloor { id: string; name: string; sort_order: number; }
export interface AdminTable { id: string; floor_id: string; label: string; x: number; y: number; status: "available" | "occupied" | "dirty"; }
export interface AdminFieldProps { label: string; children: ReactNode; hint?: string; }
export interface AdminNoticeProps { message: string; error?: boolean; }
export interface AdminContentProps { resource: "gallery" | "testimonials" | "faq" | "location"; }
export interface AdminImageUploadProps { value: string; onChange: (value: string) => void; folder: "menu" | "gallery"; }
export interface AdminGalleryRecord { id: string; src: string; alt: string; title: string; caption: string; category: string; aspect: string; year?: string; }
export interface AdminContentRecord { id: string; [key: string]: string | number | undefined; }
