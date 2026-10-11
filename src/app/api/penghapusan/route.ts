import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { forbidden, hasPermission } from "@/lib/authz"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!hasPermission(session.user, "view_penghapusan")) return forbidden()

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
        { alasan: { contains: search, mode: "insensitive" } },
      ]
    }

    const [data, total] = await Promise.all([
      prisma.penghapusan.findMany({
        where,
        include: {
          barang: { include: { komisi: true } },
          user: { select: { namaLengkap: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.penghapusan.count({ where }),
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
    console.error("GET penghapusan error:", error)
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
    if (!hasPermission(session.user, "create_penghapusan")) return forbidden()

    const body = await request.json()

    const barang = await prisma.barang.findUnique({
      where: { id: body.barangId },
    })

    if (!barang) {
      return NextResponse.json({ error: "Barang not found" }, { status: 404 })
    }

    const penghapusan = await prisma.$transaction(async (tx) => {
      const result = await tx.penghapusan.create({
        data: {
          barangId: body.barangId,
          tanggalPenghapusan: new Date(body.tanggalPenghapusan),
          alasan: body.alasan,
          keterangan: body.keterangan || null,
          userId: session.user!.id,
          qrCode: body.qrCode || null,
        },
        include: {
          barang: { include: { komisi: true } },
          user: { select: { namaLengkap: true } },
        },
      })

      await tx.barang.update({
        where: { id: body.barangId },
        data: { status: "Nonaktif" },
      })

      return result
    })

    await prisma.aktivitas.create({
      data: {
        userId: session.user.id,
        aktivitas: `Menghapus barang: ${barang.namaBarang} (${barang.kodeBarang}) dengan alasan: ${body.alasan}`,
        ipAddress: request.headers.get("x-forwarded-for") || null,
        userAgent: request.headers.get("user-agent") || null,
        meta: { penghapusanId: penghapusan.id, barangId: body.barangId, action: "create" },
      },
    })

    return NextResponse.json(penghapusan, { status: 201 })
  } catch (error) {
    console.error("POST penghapusan error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
