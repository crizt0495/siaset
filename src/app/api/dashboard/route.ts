import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [
      totalBarang,
      barangAktif,
      barangRusak,
      barangHilang,
      totalKomisi,
      peminjamanAktif,
      totalMutasi,
      totalPenghapusan,
      totalPemeliharaan,
    ] = await Promise.all([
      prisma.barang.count(),
      prisma.barang.count({ where: { status: "Aktif" } }),
      prisma.barang.count({ where: { kondisi: "Rusak" } }),
      prisma.barang.count({ where: { kondisi: "Hilang" } }),
      prisma.komisi.count(),
      prisma.peminjaman.count({ where: { status: "Dipinjam" } }),
      prisma.mutasi.count(),
      prisma.penghapusan.count(),
      prisma.pemeliharaan.count(),
    ])

    const recentBarang = await prisma.barang.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { komisi: true },
    })

    const recentActivities = await prisma.aktivitas.findMany({
      take: 10,
      orderBy: { waktu: "desc" },
      include: { user: { select: { namaLengkap: true } } },
    })

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
    })

    return NextResponse.json({
      stats: {
        totalBarang,
        barangAktif,
        barangRusak,
        barangHilang,
        totalKomisi,
        peminjamanAktif,
        totalMutasi,
        totalPenghapusan,
        totalPemeliharaan,
      },
      recentBarang,
      recentActivities,
      barangByKomisi: barangByKomisi.map((k) => ({
        id: k.id,
        namaKomisi: k.namaKomisi,
        count: k._count.barang,
      })),
      barangByKondisi: barangByKondisi.map((k) => ({
        kondisi: k.kondisi,
        count: k._count.id,
      })),
    })
  } catch (error) {
    console.error("Dashboard error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
