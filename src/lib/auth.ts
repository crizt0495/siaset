import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { username: credentials.username as string },
          include: {
            roles: {
              include: { role: true },
            },
          },
        })

        if (!user || !user.active) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )
        if (!isValid) return null

        return {
          id: user.id,
          name: user.namaLengkap,
          username: user.username,
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = (user as any).username
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            roles: {
              include: {
                role: {
                  include: { permissions: { include: { permission: true } } },
                },
              },
            },
            komisi: true,
          },
        })
        if (dbUser) {
          token.namaLengkap = dbUser.namaLengkap
          token.komisiId = dbUser.komisiId
          token.komisiNama = dbUser.komisi?.namaKomisi || null
          token.roles = dbUser.roles.map((ur) => ur.role.name)
          token.permissions = [
            ...new Set(
              dbUser.roles.flatMap((ur) =>
                ur.role.permissions.map((rp) => rp.permission.name)
              )
            ),
          ]
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        ;(session.user as any).username = token.username
        ;(session.user as any).namaLengkap = token.namaLengkap
        ;(session.user as any).komisiId = token.komisiId
        ;(session.user as any).komisiNama = token.komisiNama
        ;(session.user as any).roles = token.roles || []
        ;(session.user as any).permissions = token.permissions || []
      }
      return session
    },
  },
})
