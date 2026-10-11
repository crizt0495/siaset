import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { isSuperadmin } from "@/lib/authz"
import PenggunaDetailClient from "./PenggunaDetailClient"

export default async function PenggunaDetailPage() {
  const session = await auth()
  if (!session?.user || !isSuperadmin(session.user)) redirect("/dashboard")
  return <PenggunaDetailClient />
}