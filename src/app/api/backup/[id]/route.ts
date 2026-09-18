import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { deleteBackupFile, readBackupFile } from "@/lib/backup"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const roles = (session.user as any)?.roles
    if (!Array.isArray(roles) || !roles.includes("Superadmin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    let filename = id
    try {
      filename = (await readBackupFile(id)).filename
    } catch {
      // fallback: use id as filename for logging
    }

    await deleteBackupFile(id)

    await prisma.aktivitas.create({
      data: {
        userId: session.user.id,
        aktivitas: `Menghapus backup: ${filename}`,
        ipAddress: request.headers.get("x-forwarded-for") || null,
        userAgent: request.headers.get("user-agent") || null,
        meta: { backupId: id, action: "delete_backup" },
      },
    })

    return NextResponse.json({ message: "Backup deleted" })
  } catch (error) {
    console.error("DELETE backup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}