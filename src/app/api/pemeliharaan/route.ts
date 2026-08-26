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
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { barang: { namaBarang: { contains: search, mode: "insensitive" } } },
        { barang: { kodeBarang: { contains: search, mode: "insensitive" } } },
        { keterangan: { contains: search, mode: "insensitive" } },
      ]
    }

    const [data, total] = await Promise.all([
      prisma.pemeliharaan.findMany({
        where,
        include: {
          barang: { include: { komisi: true } },
          user: { select: { namaLengkap: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.pemeliharaan.count({ where }),
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
    console.error("GET pemeliharaan error:", error)
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

    const pemeliharaan = await prisma.pemeliharaan.create({
      data: {
        barangId: body.barangId,
        tanggal: new Date(body.tanggal),
        biaya: body.biaya,
        keterangan: body.keterangan || null,
        userId: session.user.id,
      },
      include: {
        barang: { include: { komisi: true } },
        user: { select: { namaLengkap: true } },
      },
    })

    await prisma.aktivitas.create({
      data: {
        userId: session.user.id,
        aktivitas: `Pemeliharaan barang: ${barang.namaBarang} dengan biaya Rp ${body.biaya}`,
        ipAddress: request.headers.get("x-forwarded-for") || null,
        userAgent: request.headers.get("user-agent") || null,
        meta: { pemeliharaanId: pemeliharaan.id, barangId: body.barangId, action: "create" },
      },
    })

    return NextResponse.json(pemeliharaan, { status: 201 })
  } catch (error) {
    console.error("POST pemeliharaan error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
