import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { isSuperadmin } from "@/lib/authz"
import PenggunaEditClient from "./PenggunaEditClient"

export default async function PenggunaEditPage() {
  const session = await auth()
  if (!session?.user || !isSuperadmin(session.user)) redirect("/dashboard")
  return <PenggunaEditClient />
}