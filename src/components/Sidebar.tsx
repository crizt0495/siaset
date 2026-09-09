"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useState, useEffect, useCallback, type ElementType } from "react"
import {
  LayoutDashboard, Package, ArrowRightLeft, Repeat, Trash2,
  Wrench, Users, Shield, Database, ChevronLeft,
  ChevronRight, LogOut, Sun, Moon, Menu, X, ClipboardList, Boxes
} from "lucide-react"

type MenuItem = { label: string; href: string; icon: ElementType; role?: string; tag?: string }
type MenuSection = { section: string; items: MenuItem[] }
const menuItems: (MenuItem | MenuSection)[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, tag: "01" },
  {
    section: "Manajemen Aset",
    items: [
      { label: "Barang & Aset", href: "/barang", icon: Package, tag: "02" },
      { label: "Peminjaman", href: "/peminjaman", icon: ArrowRightLeft, tag: "03" },
      { label: "Mutasi", href: "/mutasi", icon: Repeat, tag: "04" },
    ],
  },
  {
    section: "Manajemen Lainnya",
    items: [
      { label: "Penghapusan", href: "/penghapusan", icon: Trash2, tag: "05" },
      { label: "Pemeliharaan", href: "/pemeliharaan", icon: Wrench, tag: "06" },
      { label: "Laporan", href: "/reports", icon: ClipboardList, tag: "07" },
    ],
  },
  {
    section: "Administrasi",
    items: [
      { label: "Komisi", href: "/komisi", icon: Users, tag: "08" },
      { label: "Pengguna", href: "/pengguna", icon: Shield, role: "Superadmin", tag: "09" },
      { label: "Backup", href: "/backup", icon: Database, role: "Superadmin", tag: "10" },
    ],
  },
]

interface SidebarNavProps {
  collapsed: boolean
  isSuperadmin: boolean
  isActive: (href: string) => boolean
  onNavigate: () => void
}

function SidebarNav({ collapsed, isSuperadmin, isActive, onNavigate }: SidebarNavProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="relative p-4 border-b-[3px] border-ink bg-ink flex items-center gap-3 overflow-hidden">
        <div className="w-11 h-11 bg-warn border-[3px] border-ink grid place-items-center shadow-[3px_3px_0_0_#00000033] shrink-0 -rotate-3">
          <Boxes className="w-6 h-6 text-ink" strokeWidth={3} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h2 className="brut-title text-paper text-lg leading-none">SiAset</h2>
            <p className="text-[0.65rem] text-paper/60 font-bold uppercase tracking-[0.2em] mt-1">
              GKJW Probolinggo
            </p>
          </div>
        )}
        <span className="absolute -right-4 top-1/2 -translate-y-1/2 hidden">
          <svg className="w-16 h-16 text-paper/10 fill-current" viewBox="0 0 24 24">
            <path d="M6 0l6 6-6 6-6-6z" />
          </svg>
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
        {menuItems.map((item, idx) => {
          if ("href" in item && "icon" in item) {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={idx}
                href={item.href}
                onClick={onNavigate}
                className={`group flex items-center gap-3 border-[3px] border-ink px-3 py-2.5 transition-all duration-100 ${
                  active
                    ? "bg-primary text-white shadow-[4px_4px_0_0_var(--shadow)] -translate-x-0.5 -translate-y-0.5"
                    : "bg-card text-ink hover:bg-warn hover:shadow-[3px_3px_0_0_var(--shadow)] hover:-translate-x-0.5 hover:-translate-y-0.5"
                } ${collapsed ? "justify-center" : ""}`}
                title={item.label}
              >
                <Icon className="w-5 h-5 shrink-0" strokeWidth={2.75} />
                {!collapsed && <span className="text-sm font-bold uppercase tracking-wide truncate flex-1">{item.label}</span>}
                {!collapsed && item.tag && (
                  <span className={`text-[0.6rem] font-bold ${active ? "text-white/70" : "text-muted opacity-60"}`}>
                    {item.tag}
                  </span>
                )}
              </Link>
            )
          }

          if ("section" in item) {
            const visibleItems = item.items.filter((sub) => {
              if (sub.role === "Superadmin" && !isSuperadmin) return false
              return true
            })
            if (visibleItems.length === 0) return null
            return (
              <div key={idx}>
                {!collapsed && (
                  <p className="px-3 py-1.5 text-[0.62rem] font-bold text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-3 h-[3px] bg-warn inline-block rotate-6" />
                    {item.section}
                  </p>
                )}
                <div className="space-y-1.5">
                  {visibleItems.map((sub) => {
                    const Icon = sub.icon
                    const active = isActive(sub.href)
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={onNavigate}
                        className={`group flex items-center gap-3 border-2 border-ink px-3 py-2 transition-all duration-100 ${
                          active
                            ? "bg-primary text-white shadow-[3px_3px_0_0_var(--shadow)] -translate-x-0.5 -translate-y-0.5"
                            : "bg-card text-ink hover:bg-warn hover:shadow-[3px_3px_0_0_var(--shadow)] hover:-translate-x-0.5 hover:-translate-y-0.5"
                        } ${collapsed ? "justify-center border-[3px]" : ""}`}
                        title={sub.label}
                      >
                        <Icon className="w-5 h-5 shrink-0" strokeWidth={2.75} />
                        {!collapsed && (
                          <span className="text-sm font-bold uppercase tracking-wide truncate flex-1">
                            {sub.label}
                          </span>
                        )}
                        {!collapsed && sub.tag && (
                          <span className={`text-[0.6rem] font-bold ${active ? "text-white/70" : "text-muted opacity-60"}`}>
                            {sub.tag}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          }
          return null
        })}
      </nav>

      <div className="p-3 border-t-[3px] border-ink bg-paper2">
        <button
          onClick={() => {}}
          className="w-full flex items-center justify-center gap-2 border-[3px] border-ink bg-card px-3 py-2 text-sm font-bold uppercase tracking-wider text-ink hover:bg-warn transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" strokeWidth={3} /> : <ChevronLeft className="w-4 h-4" strokeWidth={3} />}
          {!collapsed && <span>Tutup Menu</span>}
        </button>
      </div>
    </div>
  )
}

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  const userRoles: string[] = (session?.user as Record<string, unknown>)?.roles as string[] || []
  const isSuperadmin = userRoles.includes("Superadmin")

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("darkMode")
    if (saved !== null) {
      setDarkMode(saved === "true")
    } else {
      setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches)
    }
    const savedCollapsed = localStorage.getItem("sidebarCollapsed")
    if (savedCollapsed !== null) {
      setCollapsed(savedCollapsed === "true")
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle("dark", darkMode)
      localStorage.setItem("darkMode", String(darkMode))
    }
  }, [darkMode, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sidebarCollapsed", String(collapsed))
    }
  }, [collapsed, mounted])

  const isActive = useCallback((href: string) => pathname === href || pathname.startsWith(href + "/"), [pathname])

  const handleNavigate = useCallback(() => setMobileOpen(false), [])

  const sessionUser = session?.user as Record<string, unknown> | undefined

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="brut-btn no-print fixed top-4 left-4 z-50 !p-2.5 !shadow-none"
        aria-label="Buka menu"
      >
        <Menu className="w-5 h-5" strokeWidth={3} />
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-ink/80 brut-stripe" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute left-0 top-0 h-full w-[17rem] bg-paper shadow-[6px_0_0_0_#000]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 z-10 p-1.5 bg-card border-[3px] border-ink text-ink hover:bg-danger hover:text-white"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" strokeWidth={3} />
            </button>
            <SidebarNav collapsed={false} isSuperadmin={isSuperadmin} isActive={isActive} onNavigate={handleNavigate} />
          </div>
        </div>
      )}

      <aside
        className={`no-print hidden lg:block fixed left-0 top-0 h-full bg-paper border-r-[3px] border-ink z-30 transition-all duration-200 ${
          collapsed ? "w-[4.5rem]" : "w-[16.5rem]"
        }`}
      >
        <SidebarNav collapsed={collapsed} isSuperadmin={isSuperadmin} isActive={isActive} onNavigate={handleNavigate} />
      </aside>

      <header
        className={`no-print fixed top-0 right-0 h-16 bg-paper/90 backdrop-blur-md border-b-[3px] border-ink z-20 flex items-center justify-between px-4 transition-all duration-200 ${
          collapsed ? "lg:left-[4.5rem]" : "lg:left-[16.5rem]"
        } left-0`}
      >
        <div className="lg:hidden w-12" />
        <div className="flex items-center gap-3 ml-12 lg:ml-0">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="brut-iconbtn"
            title={darkMode ? "Mode terang" : "Mode gelap"}
          >
            {darkMode ? <Sun className="w-5 h-5" strokeWidth={3} /> : <Moon className="w-5 h-5" strokeWidth={3} />}
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-warn border-[3px] border-ink grid place-items-center text-ink font-display text-sm rotate-[-4deg]">
              {(sessionUser?.namaLengkap as string)?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-ink leading-tight">
                {(sessionUser?.namaLengkap as string) || "User"}
              </p>
              <p className="text-[0.68rem] font-bold text-muted uppercase tracking-wider">
                {(sessionUser?.komisiNama as string) || userRoles[0] || ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="brut-btn !px-3.5 !py-2 !text-xs"
            title="Logout"
          >
            <LogOut className="w-4 h-4" strokeWidth={3} />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      <main
        className={`pt-20 min-h-screen bg-paper transition-all duration-200 ${
          collapsed ? "lg:ml-[4.5rem]" : "lg:ml-[16.5rem]"
        }`}
      >
        <div className="p-5 lg:p-8 max-w-[1600px]">{children}</div>
      </main>
    </>
  )
}