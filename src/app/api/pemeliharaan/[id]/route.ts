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
    const pemeliharaan = await prisma.pemeliharaan.findUnique({
      where: { id },
      include: {
        barang: { include: { komisi: true } },
        user: { select: { id: true, namaLengkap: true } },
      },
    })

    if (!pemeliharaan) {
      return NextResponse.json(
        { error: "Pemeliharaan not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(pemeliharaan)
  } catch (error) {
    console.error("GET pemeliharaan detail error:", error)
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

    const existing = await prisma.pemeliharaan.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: "Pemeliharaan not found" },
        { status: 404 }
      )
    }

    const pemeliharaan = await prisma.pemeliharaan.update({
      where: { id },
      data: {
        tanggal: body.tanggal ? new Date(body.tanggal) : existing.tanggal,
        biaya: body.biaya ?? existing.biaya,
        keterangan: body.keterangan !== undefined ? body.keterangan : existing.keterangan,
      },
      include: {
        barang: { include: { komisi: true } },
        user: { select: { namaLengkap: true } },
      },
    })

    await prisma.aktivitas.create({
      data: {
        userId: session.user.id,
        aktivitas: `Mengubah pemeliharaan barang: ${pemeliharaan.barang.namaBarang}`,
        ipAddress: request.headers.get("x-forwarded-for") || null,
        userAgent: request.headers.get("user-agent") || null,
        meta: { pemeliharaanId: pemeliharaan.id, action: "update" },
      },
    })

    return NextResponse.json(pemeliharaan)
  } catch (error) {
    console.error("PUT pemeliharaan error:", error)
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
    const existing = await prisma.pemeliharaan.findUnique({
      where: { id },
      include: { barang: true },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Pemeliharaan not found" },
        { status: 404 }
      )
    }

    await prisma.pemeliharaan.delete({ where: { id } })

    await prisma.aktivitas.create({
      data: {
        userId: session.user.id,
        aktivitas: `Menghapus data pemeliharaan: ${existing.barang.namaBarang}`,
        ipAddress: request.headers.get("x-forwarded-for") || null,
        userAgent: request.headers.get("user-agent") || null,
        meta: { pemeliharaanId: id, action: "delete" },
      },
    })

    return NextResponse.json({ message: "Pemeliharaan deleted" })
  } catch (error) {
    console.error("DELETE pemeliharaan error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
