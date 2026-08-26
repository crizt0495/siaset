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
    const komisiId = searchParams.get("komisiId") || undefined
    const kondisi = searchParams.get("kondisi") || undefined
    const status = searchParams.get("status") || undefined
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { namaBarang: { contains: search, mode: "insensitive" } },
        { kodeBarang: { contains: search, mode: "insensitive" } },
        { spesifikasi: { contains: search, mode: "insensitive" } },
      ]
    }

    if (komisiId) where.komisiId = komisiId
    if (kondisi) where.kondisi = kondisi
    if (status) where.status = status

    const [barang, total] = await Promise.all([
      prisma.barang.findMany({
        where,
        include: { komisi: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.barang.count({ where }),
    ])

    return NextResponse.json({
      data: barang,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("GET barang error:", error)
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
    const today = new Date()
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "")

    const lastBarang = await prisma.barang.findFirst({
      where: { kodeBarang: { startsWith: `BRG-${dateStr}-` } },
      orderBy: { kodeBarang: "desc" },
    })

    let sequence = 1
    if (lastBarang) {
      const lastSeq = parseInt(lastBarang.kodeBarang.split("-").pop() || "0")
      sequence = lastSeq + 1
    }

    const kodeBarang = `BRG-${dateStr}-${String(sequence).padStart(3, "0")}`

    const barang = await prisma.barang.create({
      data: {
        kodeBarang,
        namaBarang: body.namaBarang,
        komisiId: body.komisiId || null,
        userId: session.user.id,
        spesifikasi: body.spesifikasi || null,
        kondisi: body.kondisi || "Baik",
        lokasi: body.lokasi,
        tanggalPerolehan: new Date(body.tanggalPerolehan),
        sumberPerolehan: body.sumberPerolehan,
        hargaPerolehan: body.hargaPerolehan,
        fotoBarang: body.fotoBarang || null,
        qrCode: body.qrCode || null,
        status: body.status || "Aktif",
        jumlah: body.jumlah || 0,
      },
      include: { komisi: true },
    })

    await prisma.aktivitas.create({
      data: {
        userId: session.user.id,
        aktivitas: `Menambah barang baru: ${barang.namaBarang} (${barang.kodeBarang})`,
        ipAddress: request.headers.get("x-forwarded-for") || null,
        userAgent: request.headers.get("user-agent") || null,
        meta: { barangId: barang.id, action: "create" },
      },
    })

    return NextResponse.json(barang, { status: 201 })
  } catch (error) {
    console.error("POST barang error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
