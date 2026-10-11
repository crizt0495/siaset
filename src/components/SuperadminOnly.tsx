"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthz } from "@/hooks/useAuthz"

/**
 * Guard level halaman: hanya Superadmin yang boleh melihat konten.
 * Non-Superadmin diarahkan kembali ke dashboard.
 */
export default function SuperadminOnly({ children }: { children: React.ReactNode }) {
  const { isSuperadmin } = useAuthz()
  const router = useRouter()

  useEffect(() => {
    if (!isSuperadmin) router.replace("/dashboard")
  }, [isSuperadmin, router])

  if (!isSuperadmin) return null
  return <>{children}</>
}