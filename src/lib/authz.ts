import { NextResponse } from "next/server"

/**
 * Helpers otorisasi untuk API routes.
 * Role & permission dibawa dari JWT NextAuth (ditempel di token saat login).
 */

function rolesOf(user: unknown): string[] {
  const roles = (user as { roles?: unknown } | null)?.roles
  return Array.isArray(roles) ? (roles as string[]) : []
}

function permissionsOf(user: unknown): string[] {
  const permissions = (user as { permissions?: unknown } | null)?.permissions
  return Array.isArray(permissions) ? (permissions as string[]) : []
}

export function hasRoles(user: unknown, ...names: string[]): boolean {
  const roles = rolesOf(user)
  return names.every((n) => roles.includes(n))
}

export function hasPermission(user: unknown, permission: string): boolean {
  return permissionsOf(user).includes(permission)
}

export function hasAnyPermission(user: unknown, ...permissions: string[]): boolean {
  return permissions.some((p) => hasPermission(user, p))
}

export function isSuperadmin(user: unknown): boolean {
  return hasRoles(user, "Superadmin")
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}