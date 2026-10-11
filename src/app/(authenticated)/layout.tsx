import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Providers from "@/components/Providers"
import SidebarWrapper from "@/components/SidebarWrapper"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <Providers>
      <div className="min-h-dvh bg-paper">
        <SidebarWrapper>{children}</SidebarWrapper>
      </div>
    </Providers>
  )
}