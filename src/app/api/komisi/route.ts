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

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { namaKomisi: { contains: search, mode: "insensitive" } },
        { keterangan: { contains: search, mode: "insensitive" } },
      ]
    }

    const data = await prisma.komisi.findMany({
      where,
      include: {
        _count: { select: { barang: true, users: true } },
      },
      orderBy: { namaKomisi: "asc" },
    })

    return NextResponse.json({
      data: data.map((k) => ({
        ...k,
        jumlahBarang: k._count.barang,
        jumlahPengguna: k._count.users,
      })),
    })
  } catch (error) {
    console.error("GET komisi error:", error)
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

    const existing = await prisma.komisi.findUnique({
      where: { namaKomisi: body.namaKomisi },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Nama komisi sudah ada" },
        { status: 409 }
      )
    }

    const komisi = await prisma.komisi.create({
      data: {
        namaKomisi: body.namaKomisi,
        keterangan: body.keterangan || null,
      },
    })

    await prisma.aktivitas.create({
      data: {
        userId: session.user.id,
        aktivitas: `Menambah komisi baru: ${komisi.namaKomisi}`,
        ipAddress: request.headers.get("x-forwarded-for") || null,
        userAgent: request.headers.get("user-agent") || null,
        meta: { komisiId: komisi.id, action: "create" },
      },
    })

    return NextResponse.json(komisi, { status: 201 })
  } catch (error) {
    console.error("POST komisi error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
