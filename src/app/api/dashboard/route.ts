import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { hitungPenyusutan, ringkasValuasi } from "@/lib/penyusutan"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Satu snapshot barang utuh → semua angka ditarik dari snapshot yang sama
    // sehingga otomatis selalu konsisten (barangAktif + barangNonaktif = total, dsb.)
    const [allBarang, allKomisi, peminjamanAktif, totalMutasi, totalPenghapusan, totalPemeliharaan] =
      await Promise.all([
        prisma.barang.findMany({
          select: { komisiId: true, kondisi: true, status: true },
        }),
        prisma.komisi.findMany({
          select: { id: true, namaKomisi: true },
          orderBy: { namaKomisi: "asc" },
        }),
        prisma.peminjaman.count({ where: { status: "Dipinjam" } }),
        prisma.mutasi.count(),
        prisma.penghapusan.count(),
        prisma.pemeliharaan.count(),
      ])

    const totalBarang = allBarang.length
    const barangAktif = allBarang.filter((b) => b.status === "Aktif").length
    const barangNonaktif = totalBarang - barangAktif

    const kondisiCounts: Record<string, number> = { Baik: 0, Rusak: 0, Hilang: 0 }
    for (const b of allBarang) {
      kondisiCounts[b.kondisi || "Lainnya"] = (kondisiCounts[b.kondisi || "Lainnya"] || 0) + 1
    }
    const barangBaik = kondisiCounts["Baik"] || 0
    const barangRusak = kondisiCounts["Rusak"] || 0
    const barangHilang = kondisiCounts["Hilang"] || 0
    const barangLain = totalBarang - barangBaik - barangRusak - barangHilang

    const komisiIds = new Set(allKomisi.map((k) => k.id))
    const perKomisi: Record<string, number> = {}
    let tanpaKomisi = 0
    for (const b of allBarang) {
      if (b.komisiId && komisiIds.has(b.komisiId)) {
        perKomisi[b.komisiId] = (perKomisi[b.komisiId] || 0) + 1
      } else {
        tanpaKomisi += 1
      }
    }

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

    // Valuasi & penyusutan dihitung di server pada satu cut-off agar konsisten.
    const barangValuasi = await prisma.barang.findMany({
      select: {
        hargaPerolehan: true,
        jumlah: true,
        nilaiResidu: true,
        masaManfaat: true,
        metodePenyusutan: true,
        tanggalPerolehan: true,
      },
    })
    const hasilValuasi = barangValuasi.map((b) =>
      hitungPenyusutan(
        {
          hargaPerolehan: b.hargaPerolehan.toString(),
          jumlah: b.jumlah,
          nilaiResidu: b.nilaiResidu.toString(),
          masaManfaat: b.masaManfaat,
          metodePenyusutan: b.metodePenyusutan,
          tanggalPerolehan: b.tanggalPerolehan,
        },
        new Date()
      )
    )
    const valuasi = ringkasValuasi(hasilValuasi)

    const byKomisi = allKomisi.map((k) => ({
      id: k.id,
      namaKomisi: k.namaKomisi,
      count: perKomisi[k.id] || 0,
    }))

    const byKondisi = [
      { kondisi: "Baik", count: barangBaik },
      { kondisi: "Rusak", count: barangRusak },
      { kondisi: "Hilang", count: barangHilang },
      ...(barangLain > 0 ? [{ kondisi: "Lainnya", count: barangLain }] : []),
    ]

    return NextResponse.json({
      stats: {
        totalBarang,
        barangAktif,
        barangNonaktif,
        barangBaik,
        barangRusak,
        barangHilang,
        totalKomisi: allKomisi.length,
        peminjamanAktif,
        totalMutasi,
        totalPenghapusan,
        totalPemeliharaan,
      },
      distribution: {
        byKomisi,
        byKondisi,
        tanpaKomisi,
        komisiDenganAset: byKomisi.filter((k) => k.count > 0).length,
      },
      valuasi: {
        nilaiPerolehan: valuasi.nilaiPerolehan,
        akumulasiPenyusutan: valuasi.akumulasiPenyusutan,
        nilaiBuku: valuasi.nilaiBuku,
        persenSusut: valuasi.persenSusut,
        asetTersusut: valuasi.asetTersusut,
        asetAktifDisusut: valuasi.asetAktifDisusut,
      },
      recentBarang,
      recentActivities,
    })
  } catch (error) {
    console.error("Dashboard error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}