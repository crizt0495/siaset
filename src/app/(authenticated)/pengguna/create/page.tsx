import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { isSuperadmin } from "@/lib/authz"
import PenggunaCreateClient from "./PenggunaCreateClient"

export default async function PenggunaCreatePage() {
  const session = await auth()
  if (!session?.user || !isSuperadmin(session.user)) redirect("/dashboard")
  return <PenggunaCreateClient />
}