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

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!hasPermission(session.user, "view_barang")) return forbidden()

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

    const [barang, total, semuaMatched] = await Promise.all([
      prisma.barang.findMany({
        where,
        include: { komisi: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.barang.count({ where }),
      prisma.barang.findMany({
        where,
        select: { hargaPerolehan: true, jumlah: true, status: true },
      }),
    ])

    const ringkasan = semuaMatched.reduce(
      (acc, b) => {
        acc.jumlahUnit += b.jumlah || 0
        acc.totalNilai += Number(b.hargaPerolehan) * (b.jumlah || 0)
        if (b.status === "Aktif") acc.aktif += 1
        if (b.status === "Nonaktif") acc.nonaktif += 1
        return acc
      },
      { jumlahUnit: 0, totalNilai: 0, aktif: 0, nonaktif: 0 }
    )

    return NextResponse.json({
      data: barang,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      summary: {
        jumlahAset: total,
        jumlahUnit: ringkasan.jumlahUnit,
        totalNilai: ringkasan.totalNilai,
        aktif: ringkasan.aktif,
        nonaktif: ringkasan.nonaktif,
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
    if (!hasPermission(session.user, "create_barang")) return forbidden()

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
        masaManfaat: parseMasaManfaat(body.masaManfaat, 60),
        nilaiResidu: body.nilaiResidu ?? 0,
        metodePenyusutan: parseMetode(body.metodePenyusutan),
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
