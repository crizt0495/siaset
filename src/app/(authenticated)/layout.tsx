import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import dynamic from "next/dynamic"
import Providers from "@/components/Providers"

const Sidebar = dynamic(() => import("@/components/Sidebar"), { ssr: false })

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <Providers>
      <div className="min-h-dvh bg-paper">
        <Sidebar>{children}</Sidebar>
      </div>
    </Providers>
  )
}