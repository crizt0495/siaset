import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { listBackupFiles, createBackup } from "@/lib/backup"

function isSuperadmin(session: any): boolean {
  return Array.isArray(session?.user?.roles) && session.user.roles.includes("Superadmin")
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!isSuperadmin(session)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const backups = await listBackupFiles()
    return NextResponse.json({ data: backups })
  } catch (error) {
    console.error("GET backup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!isSuperadmin(session)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const backup = await createBackup()

    await prisma.aktivitas.create({
      data: {
        userId: session.user.id,
        aktivitas: `Membuat backup database: ${backup.filename} (${backup.size})`,
        ipAddress: request.headers.get("x-forwarded-for") || null,
        userAgent: request.headers.get("user-agent") || null,
        meta: { backupId: backup.id, action: "backup" },
      },
    })

    return NextResponse.json(backup, { status: 201 })
  } catch (error) {
    console.error("POST backup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}