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
    const mutasi = await prisma.mutasi.findUnique({
      where: { id },
      include: {
        barang: { include: { komisi: true } },
        user: { select: { id: true, namaLengkap: true } },
      },
    })

    if (!mutasi) {
      return NextResponse.json({ error: "Mutasi not found" }, { status: 404 })
    }

    return NextResponse.json(mutasi)
  } catch (error) {
    console.error("GET mutasi detail error:", error)
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

    const existing = await prisma.mutasi.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Mutasi not found" }, { status: 404 })
    }

    const mutasi = await prisma.$transaction(async (tx) => {
      const result = await tx.mutasi.update({
        where: { id },
        data: {
          lokasiTujuan: body.lokasiTujuan ?? existing.lokasiTujuan,
          tanggalMutasi: body.tanggalMutasi
            ? new Date(body.tanggalMutasi)
            : existing.tanggalMutasi,
          keterangan: body.keterangan !== undefined ? body.keterangan : existing.keterangan,
        },
        include: {
          barang: { include: { komisi: true } },
          user: { select: { namaLengkap: true } },
        },
      })

      if (body.lokasiTujuan && body.lokasiTujuan !== existing.lokasiTujuan) {
        await tx.barang.update({
          where: { id: existing.barangId },
          data: { lokasi: body.lokasiTujuan },
        })
      }

      return result
    })

    await prisma.aktivitas.create({
      data: {
        userId: session.user.id,
        aktivitas: `Mengubah mutasi barang: ${mutasi.barang.namaBarang}`,
        ipAddress: request.headers.get("x-forwarded-for") || null,
        userAgent: request.headers.get("user-agent") || null,
        meta: { mutasiId: mutasi.id, action: "update" },
      },
    })

    return NextResponse.json(mutasi)
  } catch (error) {
    console.error("PUT mutasi error:", error)
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
    const existing = await prisma.mutasi.findUnique({
      where: { id },
      include: { barang: true },
    })

    if (!existing) {
      return NextResponse.json({ error: "Mutasi not found" }, { status: 404 })
    }

    await prisma.mutasi.delete({ where: { id } })

    await prisma.aktivitas.create({
      data: {
        userId: session.user.id,
        aktivitas: `Menghapus mutasi barang: ${existing.barang.namaBarang}`,
        ipAddress: request.headers.get("x-forwarded-for") || null,
        userAgent: request.headers.get("user-agent") || null,
        meta: { mutasiId: id, action: "delete" },
      },
    })

    return NextResponse.json({ message: "Mutasi deleted" })
  } catch (error) {
    console.error("DELETE mutasi error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
