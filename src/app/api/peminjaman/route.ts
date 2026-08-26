import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || undefined
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { peminjam: { contains: search, mode: "insensitive" } },
        { barang: { namaBarang: { contains: search, mode: "insensitive" } } },
        { barang: { kodeBarang: { contains: search, mode: "insensitive" } } },
      ]
    }

    if (status) where.status = status

    const [data, total] = await Promise.all([
      prisma.peminjaman.findMany({
        where,
        include: {
          barang: { include: { komisi: true } },
          createdByUser: { select: { namaLengkap: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.peminjaman.count({ where }),
    ])

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("GET peminjaman error:", error)
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

    const body = await request.json()

    const barang = await prisma.barang.findUnique({
      where: { id: body.barangId },
    })

    if (!barang) {
      return NextResponse.json({ error: "Barang not found" }, { status: 404 })
    }

    const jumlahDipinjam = body.jumlahDipinjam || 1
    if (jumlahDipinjam > barang.jumlah) {
      return NextResponse.json(
        { error: "Jumlah dipinjam melebihi jumlah barang yang tersedia" },
        { status: 400 }
      )
    }

    const newJumlah = barang.jumlah - jumlahDipinjam
    const newStatus = newJumlah === 0 ? "Nonaktif" : barang.status

    const peminjaman = await prisma.$transaction(async (tx) => {
      const result = await tx.peminjaman.create({
        data: {
          barangId: body.barangId,
          jumlahDipinjam,
          peminjam: body.peminjam,
          tanggalPinjam: new Date(body.tanggalPinjam),
          tanggalKembali: body.tanggalKembali
            ? new Date(body.tanggalKembali)
            : null,
          keterangan: body.keterangan || null,
          status: "Dipinjam",
          createdBy: session.user!.id,
          qrCode: body.qrCode || null,
        },
        include: {
          barang: { include: { komisi: true } },
        },
      })

      await tx.barang.update({
        where: { id: body.barangId },
        data: { jumlah: newJumlah, status: newStatus },
      })

      return result
    })

    await prisma.aktivitas.create({
      data: {
        userId: session.user.id,
        aktivitas: `Meminjamkan barang: ${peminjaman.barang.namaBarang} (${jumlahDipinjam} unit) kepada ${body.peminjam}`,
        ipAddress: request.headers.get("x-forwarded-for") || null,
        userAgent: request.headers.get("user-agent") || null,
        meta: { peminjamanId: peminjaman.id, barangId: body.barangId, action: "create" },
      },
    })

    return NextResponse.json(peminjaman, { status: 201 })
  } catch (error) {
    console.error("POST peminjaman error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
