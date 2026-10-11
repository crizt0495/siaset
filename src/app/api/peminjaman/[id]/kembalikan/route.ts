import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { forbidden, hasAnyPermission } from "@/lib/authz"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!hasAnyPermission(session.user, "create_peminjaman", "edit_peminjaman"))
      return forbidden()

    const { id } = await params
    const peminjaman = await prisma.peminjaman.findUnique({
      where: { id },
      include: { barang: true },
    })

    if (!peminjaman) {
      return NextResponse.json(
        { error: "Peminjaman not found" },
        { status: 404 }
      )
    }

    if (peminjaman.status === "Dikembalikan") {
      return NextResponse.json(
        { error: "Barang sudah dikembalikan" },
        { status: 400 }
      )
    }

    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.peminjaman.update({
        where: { id },
        data: {
          status: "Dikembalikan",
          tanggalKembali: new Date(),
        },
        include: {
          barang: { include: { komisi: true } },
        },
      })

      const newStatus =
        peminjaman.barang.status === "Nonaktif" ? "Aktif" : peminjaman.barang.status

      await tx.barang.update({
        where: { id: peminjaman.barangId },
        data: {
          jumlah: { increment: peminjaman.jumlahDipinjam },
          status: newStatus,
        },
      })

      return result
    })

    await prisma.aktivitas.create({
      data: {
        userId: session.user.id,
        aktivitas: `Pengembalian barang: ${peminjaman.barang.namaBarang} dari ${peminjaman.peminjam}`,
        ipAddress: request.headers.get("x-forwarded-for") || null,
        userAgent: request.headers.get("user-agent") || null,
        meta: { peminjamanId: id, barangId: peminjaman.barangId, action: "kembalikan" },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("POST kembalikan error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
