import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { isSuperadmin } from "@/lib/authz"
import PenggunaListClient from "./PenggunaListClient"

export default async function PenggunaPage() {
  const session = await auth()
  if (!session?.user || !isSuperadmin(session.user)) redirect("/dashboard")
  return <PenggunaListClient />
}