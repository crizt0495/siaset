import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { restoreSql } from "@/lib/backup"

export async function POST(request: NextRequest) {
  let sql = ""

  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const roles = (session.user as any)?.roles
    if (!Array.isArray(roles) || !roles.includes("Superadmin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const contentType = request.headers.get("content-type") || ""

    if (contentType.includes("application/json")) {
      const body = await request.json()
      sql = typeof body.sql === "string" ? body.sql : ""
    } else {
      sql = await request.text()
    }

    if (!sql.trim()) {
      return NextResponse.json(
        { error: "File SQL kosong atau tidak valid" },
        { status: 400 }
      )
    }

    if (!/CREATE\b/i.test(sql) && !/INSERT\b/i.test(sql)) {
      return NextResponse.json(
        { error: "File tidak mengandung perintah SQL yang valid" },
        { status: 400 }
      )
    }

    await restoreSql(sql)

    await prisma.aktivitas.create({
      data: {
        userId: session.user.id,
        aktivitas: `Melakukan restore database dari file SQL (${sql.length} bytes)`,
        ipAddress: request.headers.get("x-forwarded-for") || null,
        userAgent: request.headers.get("user-agent") || null,
        meta: { action: "restore", size: sql.length },
      },
    })

    return NextResponse.json({ message: "Restore berhasil" })
  } catch (error: any) {
    console.error("Restore backup error:", error)
    const msg =
      error?.message && /sql|relation|syntax|duplicate|constraint|type|column/i.test(error.message)
        ? `Restore gagal: ${error.message}`
        : "Internal server error"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}