"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Wallet, Coins, TrendingDown, TrendingUp, Package, Search,
  FileDown, Printer, Filter, Landmark, PiggyBank, AlertTriangle,
} from "lucide-react"
import dynamic from "next/dynamic"
import {
  PageHeader, StatCard, Card, Label, Input, Select, Button,
  LoadingState, ErrorState, EmptyState, Badge,
} from "@/components/ui"
import { formatRupiah, formatRupiahRingkas, formatTanggal, formatMasaManfaat, formatAngka } from "@/lib/format"
import { exportCsv } from "@/lib/export"

const SvgBarChart = dynamic(() => import("@/components/ChartSection").then(m => m.SvgBarChart), { ssr: false })

interface ValuasiItem {
  id: string
  kodeBarang: string
  namaBarang: string
  namaKomisi: string | null
  kondisi: string
  status: string
  jumlah: number
  tanggalPerolehan: string
  jumlahUnit: number
  umurBulan: number
  sisaBulan: number
  masaManfaat: number
  metodePenyusutan: string
  nilaiPerolehan: number
  nilaiResidu: number
  nilaiPerolehanTotal: number
  nilaiResiduTotal: number
  nilaiDapatDisusut: number
  penyusutanPerBulan: number
  penyusutanPerTahun: number
  akumulasiPenyusutan: number
  nilaiBuku: number
  persenSusut: number
  selesai: boolean
}

interface ValuasiData {
  items: ValuasiItem[]
  summary: {
    totalBarang: number
    barangAktif: number
    barangNonaktif: number
    totalUnit: number
    nilaiPerolehanTotal: number
    nilaiResiduTotal: number
    akumulasiPenyusutanTotal: number
    nilaiBukuTotal: number
    persenSusutRata2: number
    asetTersusut: number
    asetAktifDisusut: number
  }
  byKomisi: {
    namaKomisi: string
    jumlahUnit: number
    nilaiPerolehanTotal: number
    akumulasiPenyusutanTotal: number
    nilaiBukuTotal: number
  }[]
}

interface KomisiOption {
  id: string
  namaKomisi: string
}

export default function ValuasiPage() {
  const [data, setData] = useState<ValuasiData | null>(null)
  const [komisiList, setKomisiList] = useState<KomisiOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [filterKomisi, setFilterKomisi] = useState("")
  const [filterKondisi, setFilterKondisi] = useState("")
  const [filterStatus, setFilterStatus] = useState("")

  const fetchValuasi = useCallback(() => {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams()
    if (filterKomisi) params.set("komisiId", filterKomisi)
    if (filterKondisi) params.set("kondisi", filterKondisi)
    if (filterStatus) params.set("status", filterStatus)
    fetch(`/api/valuasi?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat data valuasi")
        return res.json()
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [filterKomisi, filterKondisi, filterStatus])

  const fetchKomisi = useCallback(() => {
    fetch("/api/komisi")
      .then((res) => res.json())
      .then((json) => setKomisiList(json.data || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetchKomisi()
  }, [fetchKomisi])

  useEffect(() => {
    fetchValuasi()
  }, [fetchValuasi])

  const handleExport = () => {
    if (!data) return
    const headers = [
      "Kode Barang", "Nama Barang", "Komisi", "Kondisi", "Status",
      "Jumlah Unit", "Tanggal Perolehan", "Masa Manfaat (bulan)",
      "Umur (bulan)", "Sisa (bulan)", "Nilai Perolehan", "Nilai Residu",
      "Nilai Dapat Disusut", "Penyusutan/Bulan", "Penyusutan/Tahun",
      "Akumulasi Penyusutan", "Nilai Buku", "% Tersusut", "Selesai"
    ]
    const rows = data.items.map((it) => [
      it.kodeBarang,
      it.namaBarang,
      it.namaKomisi || "-",
      it.kondisi,
      it.status,
      it.jumlahUnit,
      formatTanggal(it.tanggalPerolehan),
      it.masaManfaat,
      it.umurBulan,
      it.sisaBulan,
      it.nilaiPerolehanTotal,
      it.nilaiResiduTotal,
      it.nilaiDapatDisusut,
      it.penyusutanPerBulan,
      it.penyusutanPerTahun,
      it.akumulasiPenyusutan,
      it.nilaiBuku,
      it.persenSusut,
      it.selesai ? "Ya" : "Tidak",
    ])
    exportCsv(`valuasi-${new Date().toISOString().slice(0, 10)}`, headers, rows)
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) return <LoadingState text="Memuat data valuasi..." />
  if (error || !data) return <ErrorState message={error || "Data tidak tersedia"} onRetry={() => window.location.reload()} />

  const filtered = data.items.filter((it) => {
    const matchSearch = !search || it.namaBarang.toLowerCase().includes(search.toLowerCase()) || it.kodeBarang.toLowerCase().includes(search.toLowerCase())
    const matchKomisi = !filterKomisi || it.namaKomisi === filterKomisi
    const matchKondisi = !filterKondisi || it.kondisi === filterKondisi
    const matchStatus = !filterStatus || it.status === filterStatus
    return matchSearch && matchKomisi && matchKondisi && matchStatus
  })

  const barChartData = {
    labels: data.byKomisi.filter((k) => k.jumlahUnit > 0).map((k) => k.namaKomisi),
    datasets: [
      {
        label: "Nilai Buku",
        data: data.byKomisi.filter((k) => k.jumlahUnit > 0).map((k) => k.nilaiBukuTotal),
      },
    ],
  }

  return (
    <div>
      <PageHeader
        index="03"
        title="Valuasi Aset"
        desc="Penyusutan dan nilai buku aset GKJW Probolinggo"
        extra={
          <div className="flex gap-2">
            <Button onClick={handleExport}>Export CSV</Button>
            <Button onClick={handlePrint}>Cetak</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-6">
        <StatCard icon={Wallet} title="Nilai Perolehan" value={formatRupiahRingkas(data.summary.nilaiPerolehanTotal)} sub="total perolehan" face="primary" />
        <StatCard icon={TrendingDown} title="Akumulasi Susut" value={formatRupiahRingkas(data.summary.akumulasiPenyusutanTotal)} sub={`${data.summary.persenSusutRata2.toFixed(1)}% tersusut`} face="warn" />
        <StatCard icon={PiggyBank} title="Nilai Buku" value={formatRupiahRingkas(data.summary.nilaiBukuTotal)} sub="saat ini" face="good" />
        <StatCard icon={Package} title="Total Unit" value={formatAngka(data.summary.totalUnit)} sub={`${data.summary.totalBarang} jenis aset`} face="vibe" />
      </div>

      <Card
        className="mb-4 sm:mb-6"
        icon={Filter}
        title="Filter Valuasi"
        sub="Saring data valuasi aset"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <Label>Pencarian</Label>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari barang..." />
          </div>
          <div>
            <Label>Komisi</Label>
            <Select value={filterKomisi} onChange={(e) => setFilterKomisi(e.target.value)}>
              <option value="">Semua Komisi</option>
              {komisiList.map((k) => (
                <option key={k.id} value={k.namaKomisi}>{k.namaKomisi}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Kondisi</Label>
            <Select value={filterKondisi} onChange={(e) => setFilterKondisi(e.target.value)}>
              <option value="">Semua Kondisi</option>
              <option value="Baik">Baik</option>
              <option value="Rusak">Rusak</option>
              <option value="Hilang">Hilang</option>
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </Select>
          </div>
        </div>
      </Card>

      <Card
        className="mb-4 sm:mb-6"
        icon={Landmark}
        title="Nilai Buku per Komisi"
        sub="Distribusi nilai buku aset berdasarkan komisi"
      >
        <div className="h-72">
          <SvgBarChart data={barChartData} empty={data.byKomisi.filter((k) => k.jumlahUnit > 0).length === 0} />
        </div>
      </Card>

      <Card
        className="mb-4 sm:mb-6"
        icon={Package}
        title="Rincian Valuasi"
        sub={`${filtered.length} dari ${data.items.length} aset`}
      >
        {filtered.length === 0 ? (
          <EmptyState text="Tidak ada data yang cocok dengan filter" icon={Search} />
        ) : (
          <div className="divide-y-[3px] divide-ink border-2 border-ink">
            {filtered.map((it, idx) => (
              <div key={it.id} className="hover:bg-paper2 transition-colors">
                <div className="hidden lg:grid grid-cols-12 gap-2 px-3 py-2.5 items-center">
                  <div className="col-span-1 text-xs font-bold text-muted">{idx + 1}</div>
                  <div className="col-span-2 font-mono text-xs font-bold">{it.kodeBarang}</div>
                  <div className="col-span-3 font-bold text-sm truncate">{it.namaBarang}</div>
                  <div className="col-span-2 text-xs font-bold text-muted truncate">{it.namaKomisi || "-"}</div>
                  <div className="col-span-1">
                    <Badge color={it.kondisi === "Baik" ? "green" : it.kondisi === "Rusak" ? "red" : "yellow"}>{it.kondisi}</Badge>
                  </div>
                  <div className="col-span-1">
                    <Badge color={it.status === "Aktif" ? "blue" : "gray"}>{it.status}</Badge>
                  </div>
                  <div className="col-span-1 text-xs font-bold">{formatMasaManfaat(it.masaManfaat)}</div>
                  <div className="col-span-1">
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-2 border-2 border-ink bg-card">
                        <div className="h-full bg-warn" style={{ width: `${Math.min(it.persenSusut, 100)}%` }} />
                      </div>
                      <span className="text-xs font-bold">{it.persenSusut.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
                <div className="lg:hidden px-3 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">{it.namaBarang}</p>
                      <p className="font-mono text-xs text-muted">{it.kodeBarang}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Badge color={it.kondisi === "Baik" ? "green" : it.kondisi === "Rusak" ? "red" : "yellow"}>{it.kondisi}</Badge>
                      <Badge color={it.status === "Aktif" ? "blue" : "gray"}>{it.status}</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-1.5">
                    <div><span className="font-bold text-muted">Perolehan:</span> {formatRupiah(it.nilaiPerolehanTotal)}</div>
                    <div><span className="font-bold text-muted">Nilai Buku:</span> {formatRupiah(it.nilaiBuku)}</div>
                    <div><span className="font-bold text-muted">Akumulasi:</span> {formatRupiah(it.akumulasiPenyusutan)}</div>
                    <div><span className="font-bold text-muted">Sisa Masa:</span> {it.sisaBulan} bln</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
