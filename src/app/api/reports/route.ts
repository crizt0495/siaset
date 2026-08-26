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
    const komisiId = searchParams.get("komisiId") || undefined
    const kondisi = searchParams.get("kondisi") || undefined
    const status = searchParams.get("status") || undefined
    const dateFrom = searchParams.get("dateFrom") || undefined
    const dateTo = searchParams.get("dateTo") || undefined

    const barangWhere: Record<string, unknown> = {}
    if (komisiId) barangWhere.komisiId = komisiId
    if (kondisi) barangWhere.kondisi = kondisi
    if (status) barangWhere.status = status

    const dateFilter: Record<string, unknown> = {}
    if (dateFrom || dateTo) {
      dateFilter.gte = dateFrom ? new Date(dateFrom) : undefined
      dateFilter.lte = dateTo ? new Date(dateTo) : undefined
      if (dateFilter.gte === undefined) delete dateFilter.gte
      if (dateFilter.lte === undefined) delete dateFilter.lte
    }

    const barangWhereWithDate = { ...barangWhere }
    if (dateFrom || dateTo) {
      barangWhereWithDate.createdAt = dateFilter
    }

    const [
      totalBarang,
      barangAktif,
      barangRusak,
      barangHilang,
      totalPeminjaman,
      peminjamanAktif,
      peminjamanDikembalikan,
      totalMutasi,
      totalPenghapusan,
      totalPemeliharaan,
      biayaPemeliharaan,
    ] = await Promise.all([
      prisma.barang.count({ where: barangWhereWithDate }),
      prisma.barang.count({
        where: { ...barangWhereWithDate, status: "Aktif" },
      }),
      prisma.barang.count({
        where: { ...barangWhereWithDate, kondisi: "Rusak" },
      }),
      prisma.barang.count({
        where: { ...barangWhereWithDate, kondisi: "Hilang" },
      }),
      prisma.peminjaman.count({
        where: dateFrom || dateTo
          ? { createdAt: dateFilter }
          : {},
      }),
      prisma.peminjaman.count({
        where: {
          status: "Dipinjam",
          ...(dateFrom || dateTo ? { createdAt: dateFilter } : {}),
        },
      }),
      prisma.peminjaman.count({
        where: {
          status: "Dikembalikan",
          ...(dateFrom || dateTo ? { createdAt: dateFilter } : {}),
        },
      }),
      prisma.mutasi.count({
        where: dateFrom || dateTo ? { createdAt: dateFilter } : {},
      }),
      prisma.penghapusan.count({
        where: dateFrom || dateTo ? { createdAt: dateFilter } : {},
      }),
      prisma.pemeliharaan.count({
        where: dateFrom || dateTo ? { createdAt: dateFilter } : {},
      }),
      prisma.pemeliharaan.aggregate({
        _sum: { biaya: true },
        where: dateFrom || dateTo ? { createdAt: dateFilter } : {},
      }),
    ])

    const barangByKomisi = await prisma.komisi.findMany({
      select: {
        id: true,
        namaKomisi: true,
        _count: { select: { barang: true } },
      },
    })

    const barangByKondisi = await prisma.barang.groupBy({
      by: ["kondisi"],
      _count: { id: true },
      where: barangWhere,
    })

    const barangByStatus = await prisma.barang.groupBy({
      by: ["status"],
      _count: { id: true },
      where: barangWhere,
    })

    const peminjamanRaw = await prisma.peminjaman.findMany({
      select: { tanggalPinjam: true },
      where: dateFrom || dateTo ? { createdAt: dateFilter } : {},
      orderBy: { tanggalPinjam: "asc" },
    })

    const monthlyPeminjaman: Record<string, number> = {}
    for (const p of peminjamanRaw) {
      const key = `${p.tanggalPinjam.getFullYear()}-${String(p.tanggalPinjam.getMonth() + 1).padStart(2, "0")}`
      monthlyPeminjaman[key] = (monthlyPeminjaman[key] || 0) + 1
    }

    const monthlyPeminjamanArr = Object.entries(monthlyPeminjaman)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12)

    return NextResponse.json({
      summary: {
        totalBarang,
        barangAktif,
        barangRusak,
        barangHilang,
        totalPeminjaman,
        peminjamanAktif,
        peminjamanDikembalikan,
        totalMutasi,
        totalPenghapusan,
        totalPemeliharaan,
        biayaPemeliharaan: biayaPemeliharaan._sum.biaya || 0,
      },
      distribution: {
        byKomisi: barangByKomisi.map((k) => ({
          id: k.id,
          namaKomisi: k.namaKomisi,
          count: k._count.barang,
        })),
        byKondisi: barangByKondisi.map((k) => ({
          kondisi: k.kondisi,
          count: k._count.id,
        })),
        byStatus: barangByStatus.map((k) => ({
          status: k.status,
          count: k._count.id,
        })),
      },
      monthlyPeminjaman: monthlyPeminjamanArr,
    })
  } catch (error) {
    console.error("GET reports error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
