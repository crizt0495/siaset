import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { isSuperadmin } from "@/lib/authz"
import BackupClient from "./BackupClient"

export default async function BackupPage() {
  const session = await auth()
  if (!session?.user || !isSuperadmin(session.user)) redirect("/dashboard")
  return <BackupClient />
}