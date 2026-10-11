import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { hitungPenyusutan, ringkasValuasi, type HasilPenyusutan } from "@/lib/penyusutan"

/**
 * GET /api/valuasi
 * Ringkasan valuasi + penyusutan seluruh aset pada tanggal cut-off tertentu.
 * Query: komisiId, kondisi, status, search, asOf (yyyy-mm-dd)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const komisiId = searchParams.get("komisiId") || undefined
    const kondisi = searchParams.get("kondisi") || undefined
    const status = searchParams.get("status") || undefined
    const search = searchParams.get("search") || ""
    const asOfParam = searchParams.get("asOf")
    const asOf = asOfParam ? new Date(asOfParam) : new Date()

    const where: Record<string, unknown> = {}
    if (komisiId) where.komisiId = komisiId
    if (kondisi) where.kondisi = kondisi
    if (status) where.status = status
    if (search) {
      where.OR = [
        { namaBarang: { contains: search, mode: "insensitive" } },
        { kodeBarang: { contains: search, mode: "insensitive" } },
      ]
    }

    const barang = await prisma.barang.findMany({
      where,
      include: { komisi: { select: { id: true, namaKomisi: true } } },
      orderBy: { namaBarang: "asc" },
    })

    const items = barang.map((b) => {
      const hasil = hitungPenyusutan(
        {
          hargaPerolehan: b.hargaPerolehan.toString(),
          jumlah: b.jumlah,
          nilaiResidu: b.nilaiResidu.toString(),
          masaManfaat: b.masaManfaat,
          metodePenyusutan: b.metodePenyusutan,
          tanggalPerolehan: b.tanggalPerolehan,
        },
        asOf
      )
      return {
        id: b.id,
        kodeBarang: b.kodeBarang,
        namaBarang: b.namaBarang,
        komisiId: b.komisiId,
        namaKomisi: b.komisi?.namaKomisi || null,
        kondisi: b.kondisi,
        status: b.status,
        jumlah: b.jumlah,
        tanggalPerolehan: b.tanggalPerolehan,
        ...hasil,
        asOf: hasil.asOf.toISOString(),
      }
    })

    const summary = ringkasValuasi(items as unknown as HasilPenyusutan[])

    // Agregasi per komisi (termasuk aset tanpa komisi).
    const komisiMap = new Map<
      string,
      { id: string; namaKomisi: string; jumlahAset: number; jumlahUnit: number; nilaiPerolehan: number; akumulasi: number; nilaiBuku: number }
    >()
    for (const it of items) {
      const key = it.komisiId || "__tanpa__"
      const nama = it.namaKomisi || "Tanpa Komisi"
      if (!komisiMap.has(key)) {
        komisiMap.set(key, { id: key, namaKomisi: nama, jumlahAset: 0, jumlahUnit: 0, nilaiPerolehan: 0, akumulasi: 0, nilaiBuku: 0 })
      }
      const agg = komisiMap.get(key)!
      agg.jumlahAset += 1
      agg.jumlahUnit += it.jumlahUnit
      agg.nilaiPerolehan += it.nilaiPerolehanTotal
      agg.akumulasi += it.akumulasiPenyusutanTotal
      agg.nilaiBuku += it.nilaiBukuTotal
    }
    const perKomisi = Array.from(komisiMap.values()).sort((a, b) => b.nilaiBuku - a.nilaiBuku)

    const perKondisi = ["Baik", "Rusak", "Hilang"].map((k) => {
      const subset = items.filter((it) => it.kondisi === k)
      return {
        kondisi: k,
        jumlahAset: subset.length,
        nilaiPerolehan: subset.reduce((s, it) => s + it.nilaiPerolehanTotal, 0),
        nilaiBuku: subset.reduce((s, it) => s + it.nilaiBukuTotal, 0),
      }
    })

    return NextResponse.json({
      asOf: asOf.toISOString(),
      summary,
      perKomisi,
      perKondisi,
      items,
    })
  } catch (error) {
    console.error("GET valuasi error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
