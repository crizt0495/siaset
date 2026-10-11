import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { forbidden, hasPermission } from "@/lib/authz"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!hasPermission(session.user, "view_penghapusan")) return forbidden()

    const { id } = await params
    const penghapusan = await prisma.penghapusan.findUnique({
      where: { id },
      include: {
        barang: { include: { komisi: true } },
        user: { select: { id: true, namaLengkap: true } },
      },
    })

    if (!penghapusan) {
      return NextResponse.json(
        { error: "Penghapusan not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(penghapusan)
  } catch (error) {
    console.error("GET penghapusan detail error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!hasPermission(session.user, "edit_penghapusan")) return forbidden()

    const { id } = await params
    const body = await request.json()

    const existing = await prisma.penghapusan.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: "Penghapusan not found" },
        { status: 404 }
      )
    }

    const penghapusan = await prisma.penghapusan.update({
      where: { id },
      data: {
        tanggalPenghapusan: body.tanggalPenghapusan
          ? new Date(body.tanggalPenghapusan)
          : existing.tanggalPenghapusan,
        alasan: body.alasan ?? existing.alasan,
        keterangan: body.keterangan !== undefined ? body.keterangan : existing.keterangan,
      },
      include: {
        barang: { include: { komisi: true } },
        user: { select: { namaLengkap: true } },
      },
    })

    await prisma.aktivitas.create({
      data: {
        userId: session.user.id,
        aktivitas: `Mengubah penghapusan: ${penghapusan.alasan}`,
        ipAddress: request.headers.get("x-forwarded-for") || null,
        userAgent: request.headers.get("user-agent") || null,
        meta: { penghapusanId: penghapusan.id, action: "update" },
      },
    })

    return NextResponse.json(penghapusan)
  } catch (error) {
    console.error("PUT penghapusan error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!hasPermission(session.user, "delete_penghapusan")) return forbidden()

    const { id } = await params
    const existing = await prisma.penghapusan.findUnique({
      where: { id },
      include: { barang: true },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Penghapusan not found" },
        { status: 404 }
      )
    }

    await prisma.penghapusan.delete({ where: { id } })

    await prisma.aktivitas.create({
      data: {
        userId: session.user.id,
        aktivitas: `Menghapus data penghapusan: ${existing.alasan}`,
        ipAddress: request.headers.get("x-forwarded-for") || null,
        userAgent: request.headers.get("user-agent") || null,
        meta: { penghapusanId: id, action: "delete" },
      },
    })

    return NextResponse.json({ message: "Penghapusan deleted" })
  } catch (error) {
    console.error("DELETE penghapusan error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
