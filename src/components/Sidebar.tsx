"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useState, useEffect, useCallback, type ElementType } from "react"
import {
  LayoutDashboard, Package, ArrowRightLeft, Repeat, Trash2,
  Wrench, Users, Shield, Database, ScanLine, ChevronLeft,
  ChevronRight, LogOut, Sun, Moon, Menu, X, ClipboardList
} from "lucide-react"

type MenuItem = { label: string; href: string; icon: ElementType; role?: string }
type MenuSection = { section: string; items: MenuItem[] }
const menuItems: (MenuItem | MenuSection)[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    section: "Manajemen Aset",
    items: [
      { label: "Barang & Aset", href: "/barang", icon: Package },
      { label: "Peminjaman", href: "/peminjaman", icon: ArrowRightLeft },
      { label: "Mutasi", href: "/mutasi", icon: Repeat },
    ],
  },
  {
    section: "Manajemen Lainnya",
    items: [
      { label: "Penghapusan", href: "/penghapusan", icon: Trash2 },
      { label: "Pemeliharaan", href: "/pemeliharaan", icon: Wrench },
      { label: "Laporan", href: "/reports", icon: ClipboardList },
    ],
  },
  {
    section: "Administrasi",
    items: [
      { label: "Komisi", href: "/komisi", icon: Users },
      { label: "Pengguna", href: "/pengguna", icon: Shield, role: "Superadmin" },
      { label: "Backup", href: "/backup", icon: Database, role: "Superadmin" },
    ],
  },
  {
    section: "Tools",
    items: [
      { label: "Scan QR", href: "/scan", icon: ScanLine },
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
      <div className={`p-4 border-b border-gray-200 dark:border-gray-700 flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
          SA
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h2 className="font-bold text-gray-800 dark:text-white text-sm leading-tight">SiAset</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">GKJW Probolinggo</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {menuItems.map((item, idx) => {
          if ("href" in item && "icon" in item) {
            const Icon = item.icon
            return (
              <Link
                key={idx}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                  isActive(item.href)
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                } ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="text-sm">{item.label}</span>}
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
              <div key={idx} className="mb-3">
                {!collapsed && (
                  <p className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {item.section}
                  </p>
                )}
                {visibleItems.map((sub) => {
                  const Icon = sub.icon
                  return (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={onNavigate}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-colors ${
                        isActive(sub.href)
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      } ${collapsed ? "justify-center" : ""}`}
                      title={collapsed ? sub.label : undefined}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      {!collapsed && <span className="text-sm">{sub.label}</span>}
                    </Link>
                  )
                })}
              </div>
            )
          }
          return null
        })}
      </nav>

      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => {}}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-sm"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span>Tutup Sidebar</span>}
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarNav collapsed={collapsed} isSuperadmin={isSuperadmin} isActive={isActive} onNavigate={handleNavigate} />
          </div>
        </div>
      )}

      <aside
        className={`hidden lg:block fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-30 transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <SidebarNav collapsed={collapsed} isSuperadmin={isSuperadmin} isActive={isActive} onNavigate={handleNavigate} />
      </aside>

      <header
        className={`fixed top-0 right-0 h-14 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-20 flex items-center justify-between px-4 transition-all duration-300 ${
          collapsed ? "lg:left-16" : "lg:left-64"
        } left-0`}
      >
        <div className="lg:hidden" />
        <div className="flex items-center gap-3 ml-12 lg:ml-0">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 text-sm font-semibold">
              {(sessionUser?.namaLengkap as string)?.[0] || "U"}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-tight">
                {(sessionUser?.namaLengkap as string) || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(sessionUser?.komisiNama as string) || userRoles[0] || ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main
        className={`pt-14 min-h-screen bg-gray-50 dark:bg-gray-950 transition-all duration-300 ${
          collapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </>
  )
}
