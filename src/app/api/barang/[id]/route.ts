import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { forbidden, hasPermission } from "@/lib/authz"
import { prisma } from "@/lib/prisma"

function parseMasaManfaat(value: unknown, fallback: number): number {
  if (value === undefined || value === null || value === "") return fallback
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.max(0, Math.floor(n))
}

function parseMetode(value: unknown): "GarisLurus" | "SaldoMenurunGanda" {
  return value === "SaldoMenurunGanda" ? "SaldoMenurunGanda" : "GarisLurus"
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!hasPermission(session.user, "view_barang")) return forbidden()

    const { id } = await params
    const barang = await prisma.barang.findUnique({
      where: { id },
      include: {
        komisi: true,
        user: { select: { id: true, namaLengkap: true } },
        peminjaman: { orderBy: { createdAt: "desc" }, take: 5 },
        mutasi: { orderBy: { createdAt: "desc" }, take: 5 },
        penghapusan: { orderBy: { createdAt: "desc" }, take: 5 },
        pemeliharaan: { orderBy: { createdAt: "desc" }, take: 5 },
      },
    })

    if (!barang) {
      return NextResponse.json({ error: "Barang not found" }, { status: 404 })
    }

    return NextResponse.json(barang)
  } catch (error) {
    console.error("GET barang detail error:", error)
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
    if (!hasPermission(session.user, "edit_barang")) return forbidden()

    const { id } = await params
    const body = await request.json()

    const existing = await prisma.barang.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Barang not found" }, { status: 404 })
    }

    const barang = await prisma.barang.update({
      where: { id },
      data: {
        namaBarang: body.namaBarang ?? existing.namaBarang,
        komisiId: body.komisiId !== undefined ? body.komisiId : existing.komisiId,
        spesifikasi: body.spesifikasi !== undefined ? body.spesifikasi : existing.spesifikasi,
        kondisi: body.kondisi ?? existing.kondisi,
        lokasi: body.lokasi ?? existing.lokasi,
        tanggalPerolehan: body.tanggalPerolehan
          ? new Date(body.tanggalPerolehan)
          : existing.tanggalPerolehan,
        sumberPerolehan: body.sumberPerolehan ?? existing.sumberPerolehan,
        hargaPerolehan: body.hargaPerolehan ?? existing.hargaPerolehan,
        fotoBarang: body.fotoBarang !== undefined ? body.fotoBarang : existing.fotoBarang,
        qrCode: body.qrCode !== undefined ? body.qrCode : existing.qrCode,
        status: body.status ?? existing.status,
        jumlah: body.jumlah ?? existing.jumlah,
        masaManfaat:
          body.masaManfaat !== undefined
            ? parseMasaManfaat(body.masaManfaat, existing.masaManfaat)
            : existing.masaManfaat,
        nilaiResidu: body.nilaiResidu !== undefined ? body.nilaiResidu : existing.nilaiResidu,
        metodePenyusutan: body.metodePenyusutan !== undefined
          ? parseMetode(body.metodePenyusutan)
          : existing.metodePenyusutan,
      },
      include: { komisi: true },
    })

    await prisma.aktivitas.create({
      data: {
        userId: session.user.id,
        aktivitas: `Mengubah barang: ${barang.namaBarang} (${barang.kodeBarang})`,
        ipAddress: request.headers.get("x-forwarded-for") || null,
        userAgent: request.headers.get("user-agent") || null,
        meta: { barangId: barang.id, action: "update" },
      },
    })

    return NextResponse.json(barang)
  } catch (error) {
    console.error("PUT barang error:", error)
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
    if (!hasPermission(session.user, "delete_barang")) return forbidden()

    const { id } = await params
    const existing = await prisma.barang.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Barang not found" }, { status: 404 })
    }

    await prisma.barang.delete({ where: { id } })

    await prisma.aktivitas.create({
      data: {
        userId: session.user.id,
        aktivitas: `Menghapus barang: ${existing.namaBarang} (${existing.kodeBarang})`,
        ipAddress: request.headers.get("x-forwarded-for") || null,
        userAgent: request.headers.get("user-agent") || null,
        meta: { barangId: id, action: "delete" },
      },
    })

    return NextResponse.json({ message: "Barang deleted" })
  } catch (error) {
    console.error("DELETE barang error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
