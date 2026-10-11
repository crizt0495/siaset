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
    if (!hasPermission(session.user, "view_komisi")) return forbidden()

    const { id } = await params
    const komisi = await prisma.komisi.findUnique({
      where: { id },
      include: {
        barang: { orderBy: { createdAt: "desc" } },
        users: { select: { id: true, namaLengkap: true, username: true } },
      },
    })

    if (!komisi) {
      return NextResponse.json({ error: "Komisi not found" }, { status: 404 })
    }

    return NextResponse.json(komisi)
  } catch (error) {
    console.error("GET komisi detail error:", error)
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
    if (!hasPermission(session.user, "edit_komisi")) return forbidden()

    const { id } = await params
    const body = await request.json()

    const existing = await prisma.komisi.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Komisi not found" }, { status: 404 })
    }

    if (body.namaKomisi && body.namaKomisi !== existing.namaKomisi) {
      const duplicate = await prisma.komisi.findUnique({
        where: { namaKomisi: body.namaKomisi },
      })
      if (duplicate) {
        return NextResponse.json(
          { error: "Nama komisi sudah ada" },
          { status: 409 }
        )
      }
    }

    const komisi = await prisma.komisi.update({
      where: { id },
      data: {
        namaKomisi: body.namaKomisi ?? existing.namaKomisi,
        keterangan: body.keterangan !== undefined ? body.keterangan : existing.keterangan,
      },
    })

    await prisma.aktivitas.create({
      data: {
        userId: session.user.id,
        aktivitas: `Mengubah komisi: ${komisi.namaKomisi}`,
        ipAddress: request.headers.get("x-forwarded-for") || null,
        userAgent: request.headers.get("user-agent") || null,
        meta: { komisiId: komisi.id, action: "update" },
      },
    })

    return NextResponse.json(komisi)
  } catch (error) {
    console.error("PUT komisi error:", error)
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
    if (!hasPermission(session.user, "delete_komisi")) return forbidden()

    const { id } = await params
    const existing = await prisma.komisi.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Komisi not found" }, { status: 404 })
    }

    const barangCount = await prisma.barang.count({ where: { komisiId: id } })
    if (barangCount > 0) {
      return NextResponse.json(
        { error: "Tidak bisa menghapus komisi yang masih memiliki barang" },
        { status: 400 }
      )
    }

    await prisma.komisi.delete({ where: { id } })

    await prisma.aktivitas.create({
      data: {
        userId: session.user.id,
        aktivitas: `Menghapus komisi: ${existing.namaKomisi}`,
        ipAddress: request.headers.get("x-forwarded-for") || null,
        userAgent: request.headers.get("user-agent") || null,
        meta: { komisiId: id, action: "delete" },
      },
    })

    return NextResponse.json({ message: "Komisi deleted" })
  } catch (error) {
    console.error("DELETE komisi error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
