import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { readBackupFile } from "@/lib/backup"

export async function GET(
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
    const { filename, buffer } = await readBackupFile(id)

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "text/sql; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(buffer.length),
      },
    })
  } catch (error) {
    console.error("Download backup error:", error)
    return NextResponse.json(
      { error: "File backup tidak ditemukan" },
      { status: 404 }
    )
  }
}