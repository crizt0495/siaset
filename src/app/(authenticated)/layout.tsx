import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Providers from "@/components/Providers"
import Sidebar from "@/components/Sidebar"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <Providers>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar>{children}</Sidebar>
      </div>
    </Providers>
  )
}
