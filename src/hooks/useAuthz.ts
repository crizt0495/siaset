"use client"

import { useSession } from "next-auth/react"

/**
 * Hook klien untuk membaca role & permission dari sesi aktif.
 * Dipakai untuk menampilkan / menyembunyikan tombol aksi sesuai izin.
 */
export function useAuthz() {
  const { data: session } = useSession()
  const user = session?.user as Record<string, unknown> | undefined
  const roles = ((user?.roles as string[]) || []).map(String)
  const permissions = ((user?.permissions as string[]) || []).map(String)

  return {
    roles,
    permissions,
    isSuperadmin: roles.includes("Superadmin"),
    can: (permission: string) => permissions.includes(permission),
  }
}