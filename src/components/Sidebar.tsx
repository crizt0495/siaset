"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useState, useEffect, useCallback, type ElementType } from "react"
import {
  LayoutDashboard, Package, ArrowRightLeft, Repeat, Trash2,
  Wrench, Users, Shield, Database, ChevronLeft,
  ChevronRight, LogOut, Sun, Moon, ClipboardList, Boxes, LayoutGrid, X, Wallet
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
      { label: "Valuasi Aset", href: "/valuasi", icon: Wallet, tag: "11" },
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

type Tab = { label: string; href: string | null; icon: ElementType }
const tabs: Tab[] = [
  { label: "Beranda", href: "/dashboard", icon: LayoutDashboard },
  { label: "Aset", href: "/barang", icon: Package },
  { label: "Transaksi", href: "/peminjaman", icon: ArrowRightLeft },
  { label: "Mutasi", href: "/mutasi", icon: Repeat },
  { label: "Menu", href: null, icon: LayoutGrid },
]

const sheetItems: MenuItem[] = [
  { label: "Valuasi Aset", href: "/valuasi", icon: Wallet, tag: "11" },
  { label: "Laporan", href: "/reports", icon: ClipboardList, tag: "07" },
  { label: "Penghapusan", href: "/penghapusan", icon: Trash2, tag: "05" },
  { label: "Pemeliharaan", href: "/pemeliharaan", icon: Wrench, tag: "06" },
  { label: "Komisi", href: "/komisi", icon: Users, tag: "08" },
  { label: "Pengguna", href: "/pengguna", icon: Shield, role: "Superadmin", tag: "09" },
  { label: "Backup", href: "/backup", icon: Database, role: "Superadmin", tag: "10" },
]

const pageTitles: { path: string; title: string }[] = [
  { path: "/dashboard", title: "Beranda" },
  { path: "/barang", title: "Barang & Aset" },
  { path: "/peminjaman", title: "Peminjaman" },
  { path: "/mutasi", title: "Mutasi" },
  { path: "/penghapusan", title: "Penghapusan" },
  { path: "/pemeliharaan", title: "Pemeliharaan" },
  { path: "/valuasi", title: "Valuasi Aset" },
  { path: "/reports", title: "Laporan" },
  { path: "/komisi", title: "Komisi" },
  { path: "/pengguna", title: "Pengguna" },
  { path: "/backup", title: "Backup" },
]

function getTitle(pathname: string): string {
  for (const p of pageTitles) {
    if (pathname === p.path || pathname.startsWith(p.path + "/")) return p.title
  }
  return "SiAset"
}

interface SidebarNavProps {
  collapsed: boolean
  isSuperadmin: boolean
  isActive: (href: string) => boolean
  onNavigate: () => void
  onToggleCollapse: () => void
}

function SidebarNav({ collapsed, isSuperadmin, isActive, onNavigate, onToggleCollapse }: SidebarNavProps) {
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
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4 overscroll-contain">
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
          onClick={onToggleCollapse}
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
  const [darkMode, setDarkMode] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
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

  useEffect(() => {
    setSheetOpen(false)
  }, [pathname])

  const isActive = useCallback((href: string) => pathname === href || pathname.startsWith(href + "/"), [pathname])

  const sessionUser = session?.user as Record<string, unknown> | undefined
  const pageTitle = getTitle(pathname)
  const visibleSheetItems = sheetItems.filter((item) => !(item.role === "Superadmin" && !isSuperadmin))

  return (
    <>
      {/* Desktop sidebar (md and up) */}
      <aside
        className={`no-print hidden md:block fixed left-0 top-0 h-full bg-paper border-r-[3px] border-ink z-30 transition-all duration-200 ${
          collapsed ? "w-[4.5rem]" : "w-[16.5rem]"
        }`}
      >
        <SidebarNav
          collapsed={collapsed}
          isSuperadmin={isSuperadmin}
          isActive={isActive}
          onNavigate={() => {}}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </aside>

      {/* Top app bar (all sizes) */}
      <header
        className={`no-print fixed top-0 left-0 right-0 z-30 h-14 md:h-16 bg-paper/90 backdrop-blur-md border-b-[3px] border-ink flex items-center justify-between pl-3 pr-3 md:px-4 safe-top transition-all duration-200 ${
          collapsed ? "md:left-[4.5rem]" : "md:left-[16.5rem]"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="md:hidden w-9 h-9 brut-sticker text-[0.55rem] -rotate-3 shrink-0">
            <Boxes className="w-5 h-5" strokeWidth={3} />
          </span>
          <div className="min-w-0">
            <p className="brut-title text-base md:text-lg leading-none truncate">{pageTitle}</p>
            <p className="hidden md:block text-[0.6rem] font-bold text-muted uppercase tracking-[0.2em] mt-1">
              SiAset · GKJW Probolinggo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="brut-iconbtn"
            title={darkMode ? "Mode terang" : "Mode gelap"}
            aria-label={darkMode ? "Mode terang" : "Mode gelap"}
          >
            {darkMode ? <Sun className="w-5 h-5" strokeWidth={3} /> : <Moon className="w-5 h-5" strokeWidth={3} />}
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-warn border-[3px] border-ink grid place-items-center text-ink font-display text-sm rotate-[-4deg]">
              {(sessionUser?.namaLengkap as string)?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-bold text-ink leading-tight truncate max-w-[10rem]">
                {(sessionUser?.namaLengkap as string) || "User"}
              </p>
              <p className="text-[0.68rem] font-bold text-muted uppercase tracking-wider truncate max-w-[10rem]">
                {(sessionUser?.komisiNama as string) || userRoles[0] || ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="brut-iconbtn md:brut-btn !px-3 md:!px-3.5 md:!py-2 !text-xs"
            title="Keluar"
            aria-label="Keluar"
          >
            <LogOut className="w-4 h-4" strokeWidth={3} />
            <span className="hidden md:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main
        className={`pt-[calc(3.5rem+env(safe-area-inset-top))] md:pt-20 min-h-dvh bg-paper transition-all duration-200 ${
          collapsed ? "md:ml-[4.5rem]" : "md:ml-[16.5rem]"
        }`}
      >
        <div className="px-3 xs:px-4 py-4 sm:py-5 md:p-8 pb-28 md:pb-10 max-w-[1600px]">
          {children}
        </div>
      </main>

      {/* Bottom navigation — mobile and tablet portrait */}
      <nav className="no-print md:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t-[3px] border-ink safe-bottom">
        <div className="grid grid-cols-5 h-[3.75rem]">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = tab.href ? isActive(tab.href) : sheetOpen
            const cls = `relative flex flex-col items-center justify-center gap-0.5 ${
              active ? "text-primary" : "text-muted"
            }`
            const indicator = active ? (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-primary" />
            ) : null
            if (!tab.href) {
              return (
                <button
                  key={tab.label}
                  onClick={() => setSheetOpen(!sheetOpen)}
                  className={cls}
                  aria-label={tab.label}
                >
                  {indicator}
                  <Icon className="w-5 h-5" strokeWidth={2.75} />
                  <span className="text-[0.58rem] font-bold uppercase tracking-wide">{tab.label}</span>
                </button>
              )
            }
            return (
              <Link key={tab.label} href={tab.href} onClick={() => setSheetOpen(false)} className={cls}>
                {indicator}
                <Icon className="w-5 h-5" strokeWidth={2.75} />
                <span className="text-[0.58rem] font-bold uppercase tracking-wide">{tab.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom sheet menu */}
      {sheetOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-ink/80 brut-stripe" onClick={() => setSheetOpen(false)} />
          <div className="absolute bottom-0 inset-x-0 brut-sheet bg-paper rounded-t-2xl border-t-[3px] border-ink safe-bottom max-h-[85dvh] overflow-y-auto">
            <div className="relative flex items-center justify-center pt-3">
              <span className="h-1.5 w-12 rounded-full bg-ink/30" />
              <button
                onClick={() => setSheetOpen(false)}
                className="absolute right-3 top-1.5 p-2 text-muted active:text-ink"
                aria-label="Tutup menu"
              >
                <X className="w-5 h-5" strokeWidth={3} />
              </button>
            </div>

            <p className="px-5 pt-4 pb-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted">Menu</p>

            <div className="grid grid-cols-3 gap-2.5 px-5 pb-5 pt-2">
              {visibleSheetItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSheetOpen(false)}
                    className={`flex flex-col items-center gap-1.5 border-[3px] border-ink p-2.5 text-center transition-transform active:translate-x-0.5 active:translate-y-0.5 ${
                      active ? "bg-primary text-white" : "bg-card"
                    }`}
                  >
                    <span
                      className={`w-9 h-9 grid place-items-center border-[3px] border-ink -rotate-3 ${
                        active ? "bg-card text-primary" : "bg-warn text-ink"
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" strokeWidth={2.75} />
                    </span>
                    <span className="text-[0.58rem] font-bold uppercase leading-tight">{item.label}</span>
                    <span className={`text-[0.55rem] font-bold ${active ? "text-white/70" : "text-muted"}`}>{item.tag}</span>
                  </Link>
                )
              })}
            </div>

            <div className="grid grid-cols-2 gap-2.5 border-t-[3px] border-ink px-5 py-4">
              <button onClick={() => setDarkMode(!darkMode)} className="brut-btn brut-btn-warn w-full !py-3">
                {darkMode ? <Sun className="w-4 h-4" strokeWidth={3} /> : <Moon className="w-4 h-4" strokeWidth={3} />}
                Tema
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="brut-btn brut-btn-danger w-full !py-3"
              >
                <LogOut className="w-4 h-4" strokeWidth={3} />
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}