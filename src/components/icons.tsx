import type { ReactNode, SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & { size?: number };

type AdminIconProps = IconProps & { size?: number };

function AdminIcon({ size = 18, children, ...props }: AdminIconProps & { children: ReactNode }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{children}</svg>;
}

export function ArrowIcon({ size = 20, ...props }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" {...props}><path d="M5 12h14M12 5l7 7-7 7" /></svg>;
}

export function SearchIcon({ size = 20, ...props }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" {...props}><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>;
}

export function SparkIcon({ size = 32, ...props }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="5" aria-hidden="true" {...props}><path d="M20 2v36M2 20h36M7.3 7.3l25.4 25.4M7.3 32.7 32.7 7.3" /></svg>;
}

export function DashboardIcon(props: IconProps) {
  return <AdminIcon {...props}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></AdminIcon>;
}

export function FileTextIcon(props: IconProps) {
  return <AdminIcon {...props}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" /><path d="M14 3v6h6M8 13h8M8 17h6" /></AdminIcon>;
}

export function FolderIcon(props: IconProps) {
  return <AdminIcon {...props}><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h4l2 2H18.5A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5Z" /></AdminIcon>;
}

export function TagIcon(props: IconProps) {
  return <AdminIcon {...props}><path d="m20.5 13.5-7 7a2 2 0 0 1-2.8 0l-7.2-7.2A2 2 0 0 1 3 11.9V5a2 2 0 0 1 2-2h6.9a2 2 0 0 1 1.4.6l7.2 7.1a2 2 0 0 1 0 2.8Z" /><circle cx="7.5" cy="7.5" r="1" /></AdminIcon>;
}

export function UsersIcon(props: IconProps) {
  return <AdminIcon {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM17 3.1a4 4 0 0 1 0 7.8M21 21v-2a4 4 0 0 0-3-3.9" /></AdminIcon>;
}

export function ImageIcon(props: IconProps) {
  return <AdminIcon {...props}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.3" /><path d="m4 17 4.5-4.5 3.5 3 2.5-2.5L20 18" /></AdminIcon>;
}

export function ShieldIcon(props: IconProps) {
  return <AdminIcon {...props}><path d="M12 3 20 6v5.5c0 4.6-3.1 7.8-8 9.5-4.9-1.7-8-4.9-8-9.5V6Z" /><path d="m8.5 12 2.2 2.2 4.8-4.8" /></AdminIcon>;
}

export function SettingsIcon(props: IconProps) {
  return <AdminIcon {...props}><path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" /><path d="m19.4 15 .1.1a1.8 1.8 0 0 1-2.5 2.5l-.1-.1a1.8 1.8 0 0 0-3 1.3v.2a1.8 1.8 0 0 1-3.6 0v-.2a1.8 1.8 0 0 0-3-1.3l-.1.1a1.8 1.8 0 0 1-2.5-2.5l.1-.1a1.8 1.8 0 0 0-1.3-3h-.2a1.8 1.8 0 0 1 0-3.6h.2a1.8 1.8 0 0 0 1.3-3l-.1-.1a1.8 1.8 0 0 1 2.5-2.5l.1.1a1.8 1.8 0 0 0 3-1.3v-.2a1.8 1.8 0 0 1 3.6 0v.2a1.8 1.8 0 0 0 3 1.3l.1-.1a1.8 1.8 0 0 1 2.5 2.5l-.1.1a1.8 1.8 0 0 0 1.3 3h.2a1.8 1.8 0 0 1 0 3.6h-.2a1.8 1.8 0 0 0-1.3 3Z" /></AdminIcon>;
}

export function PlusIcon(props: IconProps) {
  return <AdminIcon {...props}><path d="M12 5v14M5 12h14" /></AdminIcon>;
}

export function LogOutIcon(props: IconProps) {
  return <AdminIcon {...props}><path d="M10 17 15 12 10 7M15 12H3M21 19V5a2 2 0 0 0-2-2h-5" /></AdminIcon>;
}

export function ArrowUpRightIcon(props: IconProps) {
  return <AdminIcon {...props}><path d="M7 17 17 7M8 7h9v9" /></AdminIcon>;
}

export function EyeIcon(props: IconProps) {
  return <AdminIcon {...props}><path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></AdminIcon>;
}

export function EditIcon(props: IconProps) {
  return <AdminIcon {...props}><path d="m14 6 4 4M4 20l3.8-.8L19 8a2.8 2.8 0 0 0-4-4L3.8 15.2Z" /></AdminIcon>;
}

export function TrashIcon(props: IconProps) {
  return <AdminIcon {...props}><path d="M4 7h16M10 11v5M14 11v5M6 7l1 13h10l1-13M9 7V4h6v3" /></AdminIcon>;
}

export function SaveIcon(props: IconProps) {
  return <AdminIcon {...props}><path d="M5 3h12l2 2v16H5Z" /><path d="M8 3v6h8V3M8 21v-7h8v7" /></AdminIcon>;
}

export function CheckIcon(props: IconProps) {
  return <AdminIcon {...props}><path d="m5 12 4 4L19 6" /></AdminIcon>;
}

export function ClockIcon(props: IconProps) {
  return <AdminIcon {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></AdminIcon>;
}

export function ArchiveIcon(props: IconProps) {
  return <AdminIcon {...props}><path d="M4 7h16v13H4Z" /><path d="M3 4h18v3H3ZM9 11h6" /></AdminIcon>;
}

export function XIcon(props: IconProps) {
  return <AdminIcon {...props}><path d="m6 6 12 12M18 6 6 18" /></AdminIcon>;
}

export function PanelLeftCloseIcon(props: IconProps) {
  return <AdminIcon {...props}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16M14 9l-2.5 3L14 15" /></AdminIcon>;
}

export function PanelLeftOpenIcon(props: IconProps) {
  return <AdminIcon {...props}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16M12 9l2.5 3-2.5 3" /></AdminIcon>;
}

export function ChevronDownIcon(props: IconProps) {
  return <AdminIcon {...props}><path d="m7 9 5 5 5-5" /></AdminIcon>;
}
