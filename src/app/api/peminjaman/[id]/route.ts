import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
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

    const { id } = await params
    const peminjaman = await prisma.peminjaman.findUnique({
      where: { id },
      include: {
        barang: { include: { komisi: true } },
        createdByUser: { select: { id: true, namaLengkap: true } },
      },
    })

    if (!peminjaman) {
      return NextResponse.json(
        { error: "Peminjaman not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(peminjaman)
  } catch (error) {
    console.error("GET peminjaman detail error:", error)
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

    const { id } = await params
    const body = await request.json()

    const existing = await prisma.peminjaman.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: "Peminjaman not found" },
        { status: 404 }
      )
    }

    const peminjaman = await prisma.peminjaman.update({
      where: { id },
      data: {
        peminjam: body.peminjam ?? existing.peminjam,
        tanggalPinjam: body.tanggalPinjam
          ? new Date(body.tanggalPinjam)
          : existing.tanggalPinjam,
        tanggalKembali: body.tanggalKembali
          ? new Date(body.tanggalKembali)
          : existing.tanggalKembali,
        keterangan: body.keterangan !== undefined ? body.keterangan : existing.keterangan,
        status: body.status ?? existing.status,
      },
      include: {
        barang: { include: { komisi: true } },
      },
    })

    await prisma.aktivitas.create({
      data: {
        userId: session.user.id,
        aktivitas: `Mengubah peminjaman: ${peminjaman.peminjam}`,
        ipAddress: request.headers.get("x-forwarded-for") || null,
        userAgent: request.headers.get("user-agent") || null,
        meta: { peminjamanId: peminjaman.id, action: "update" },
      },
    })

    return NextResponse.json(peminjaman)
  } catch (error) {
    console.error("PUT peminjaman error:", error)
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

    const { id } = await params
    const existing = await prisma.peminjaman.findUnique({
      where: { id },
      include: { barang: true },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Peminjaman not found" },
        { status: 404 }
      )
    }

    await prisma.$transaction(async (tx) => {
      if (existing.status === "Dipinjam") {
        await tx.barang.update({
          where: { id: existing.barangId },
          data: {
            jumlah: { increment: existing.jumlahDipinjam },
            status: "Aktif",
          },
        })
      }

      await tx.peminjaman.delete({ where: { id } })
    })

    await prisma.aktivitas.create({
      data: {
        userId: session.user.id,
        aktivitas: `Menghapus peminjaman: ${existing.peminjam}`,
        ipAddress: request.headers.get("x-forwarded-for") || null,
        userAgent: request.headers.get("user-agent") || null,
        meta: { peminjamanId: id, action: "delete" },
      },
    })

    return NextResponse.json({ message: "Peminjaman deleted" })
  } catch (error) {
    console.error("DELETE peminjaman error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
