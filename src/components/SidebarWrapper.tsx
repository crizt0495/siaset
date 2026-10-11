"use client";

import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("@/components/Sidebar"), { ssr: false });

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
  return <Sidebar>{children}</Sidebar>;
}
