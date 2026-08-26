import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { qrCode, scanType } = body

    if (!qrCode) {
      return NextResponse.json(
        { error: "QR code content is required" },
        { status: 400 }
      )
    }

    let parsed: Record<string, string>
    try {
      parsed = JSON.parse(qrCode)
    } catch {
      return NextResponse.json(
        { error: "Invalid QR code format" },
        { status: 400 }
      )
    }

    let entity = null
    let modelType = ""
    let modelId = ""

    if (parsed.type === "barang" || parsed.kodeBarang) {
      modelType = "Barang"
      modelId = parsed.id || parsed.barangId || ""
      if (modelId) {
        entity = await prisma.barang.findUnique({
          where: { id: modelId },
          include: { komisi: true },
        })
      } else if (parsed.kodeBarang) {
        entity = await prisma.barang.findUnique({
          where: { kodeBarang: parsed.kodeBarang },
          include: { komisi: true },
        })
        if (entity) modelId = entity.id
      }
    } else if (parsed.type === "peminjaman" || parsed.peminjamanId) {
      modelType = "Peminjaman"
      modelId = parsed.id || parsed.peminjamanId || ""
      if (modelId) {
        entity = await prisma.peminjaman.findUnique({
          where: { id: modelId },
          include: {
            barang: { include: { komisi: true } },
            createdByUser: { select: { namaLengkap: true } },
          },
        })
      }
    } else if (parsed.type === "mutasi" || parsed.mutasiId) {
      modelType = "Mutasi"
      modelId = parsed.id || parsed.mutasiId || ""
      if (modelId) {
        entity = await prisma.mutasi.findUnique({
          where: { id: modelId },
          include: {
            barang: { include: { komisi: true } },
            user: { select: { namaLengkap: true } },
          },
        })
      }
    } else if (parsed.type === "penghapusan" || parsed.penghapusanId) {
      modelType = "Penghapusan"
      modelId = parsed.id || parsed.penghapusanId || ""
      if (modelId) {
        entity = await prisma.penghapusan.findUnique({
          where: { id: modelId },
          include: {
            barang: { include: { komisi: true } },
            user: { select: { namaLengkap: true } },
          },
        })
      }
    }

    await prisma.qrScanLog.create({
      data: {
        scanType: scanType || "manual",
        modelId: modelId || "",
        modelType: modelType || "unknown",
        qrCodeContent: qrCode,
        ipAddress: request.headers.get("x-forwarded-for") || null,
        userAgent: request.headers.get("user-agent") || null,
        additionalData: { found: !!entity },
      },
    })

    if (!entity) {
      return NextResponse.json(
        { error: "Entity not found for this QR code", parsed },
        { status: 404 }
      )
    }

    return NextResponse.json({
      modelType,
      modelId,
      data: entity,
    })
  } catch (error) {
    console.error("POST scan error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
