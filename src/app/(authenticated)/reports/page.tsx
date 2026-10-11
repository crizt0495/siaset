"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Package, ArrowRightLeft, TrendingUp, XCircle, Activity,
  Filter, BarChart3, Calendar, FileText, ClipboardList,
  Repeat, Trash2, Wrench, Wallet, AlertTriangle, CheckCircle,
} from "@/components/icons"
import dynamic from "next/dynamic"
import {
  PageHeader, Label, StatCard, Card, Select, Input,
  Button, LoadingState, ErrorState, EmptyState,
} from "@/components/ui"

const SvgBarChart = dynamic(() => import("@/components/ChartSection").then(m => m.SvgBarChart), { ssr: false })
const SvgDoughnutChart = dynamic(() => import("@/components/ChartSection").then(m => m.SvgDoughnutChart), { ssr: false })

interface ReportsData {
  summary: {
    totalBarang: number
    barangAktif: number
    barangRusak: number
    barangHilang: number
    totalPeminjaman: number
    peminjamanAktif: number
    peminjamanDikembalikan: number
    totalMutasi: number
    totalPenghapusan: number
    totalPemeliharaan: number
  }
  distribution: {
    byKomisi: { id: string; namaKomisi: string; count: number }[]
    byKondisi: { kondisi: string; count: number }[]
  }
  biayaPemeliharaan: number
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterKondisi, setFilterKondisi] = useState("")

  const fetchData = useCallback(() => {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams()
    if (filterKondisi) params.set("kondisi", filterKondisi)
    fetch(`/api/reports?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat laporan")
        return res.json()
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [filterKondisi])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) return <LoadingState text="Memuat laporan..." />
  if (error || !data) return <ErrorState message={error || "Data tidak tersedia"} onRetry={() => window.location.reload()} />

  const { summary, distribution, biayaPemeliharaan } = data

  const kondisiColors: Record<string, string> = {
    Baik: "#23c677",
    Rusak: "#ff4d3d",
    Hilang: "#ffc829",
  }

  const barChartData = {
    labels: distribution.byKomisi.filter(k => k.count > 0).map((k) => k.namaKomisi),
    datasets: [
      {
        label: "Jumlah Aset",
        data: distribution.byKomisi.filter(k => k.count > 0).map((k) => k.count),
      },
    ],
  }

  const doughnutChartData = {
    labels: distribution.byKondisi.map((k) => k.kondisi),
    datasets: [
      {
        data: distribution.byKondisi.map((k) => k.count),
      },
    ],
  }

  const totalKondisi = distribution.byKondisi.reduce((sum, k) => sum + k.count, 0)

  const kondisiFiltered = filterKondisi
    ? distribution.byKondisi.filter((k) => k.kondisi === filterKondisi)
    : distribution.byKondisi

  return (
    <div>
      <PageHeader
        index="02"
        title="Laporan"
        desc="Statistik dan laporan aset GKJW Probolinggo"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-6">
        <StatCard icon={Package} title="Total Aset" value={summary.totalBarang} sub={`${summary.barangAktif} aktif`} face="primary" />
        <StatCard icon={ArrowRightLeft} title="Peminjaman" value={summary.totalPeminjaman} sub={`${summary.peminjamanAktif} aktif`} face="warn" />
        <StatCard icon={TrendingUp} title="Mutasi" value={summary.totalMutasi} sub="total mutasi" face="vibe" />
        <StatCard icon={Activity} title="Pemeliharaan" value={summary.totalPemeliharaan} sub="total pemeliharaan" face="good" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="brut-card p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 bg-danger rotate-[0.5deg]">
          <span className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 grid place-items-center border-[3px] border-ink bg-card text-ink -rotate-3">
            <XCircle className="w-4.5 h-4.5 sm:w-5 h-5" strokeWidth={2.75} />
          </span>
          <div className="min-w-0">
            <p className="text-[0.58rem] sm:text-[0.62rem] font-bold uppercase tracking-widest opacity-70 leading-tight">Rusak</p>
            <p className="brut-num text-lg xs:text-xl sm:text-2xl leading-tight">{summary.barangRusak}</p>
          </div>
        </div>
        <div className="brut-card p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 bg-warn rotate-[-0.5deg]">
          <span className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 grid place-items-center border-[3px] border-ink bg-card text-ink rotate-3">
            <AlertTriangle className="w-4.5 h-4.5 sm:w-5 h-5" strokeWidth={2.75} />
          </span>
          <div className="min-w-0">
            <p className="text-[0.58rem] sm:text-[0.62rem] font-bold uppercase tracking-widest opacity-70 leading-tight">Hilang</p>
            <p className="brut-num text-lg xs:text-xl sm:text-2xl leading-tight">{summary.barangHilang}</p>
          </div>
        </div>
        <div className="brut-card p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 bg-good rotate-[0.5deg]">
          <span className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 grid place-items-center border-[3px] border-ink bg-card text-ink -rotate-3">
            <CheckCircle className="w-4.5 h-4.5 sm:w-5 h-5" strokeWidth={2.75} />
          </span>
          <div className="min-w-0">
            <p className="text-[0.58rem] sm:text-[0.62rem] font-bold uppercase tracking-widest opacity-70 leading-tight">Aktif</p>
            <p className="brut-num text-lg xs:text-xl sm:text-2xl leading-tight">{summary.peminjamanAktif}</p>
          </div>
        </div>
        <div className="brut-card p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 bg-vibe text-white rotate-[-0.5deg]">
          <span className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 grid place-items-center border-[3px] border-ink bg-card text-ink rotate-3">
            <Wallet className="w-4.5 h-4.5 sm:w-5 h-5" strokeWidth={2.75} />
          </span>
          <div className="min-w-0">
            <p className="text-[0.58rem] sm:text-[0.62rem] font-bold uppercase tracking-widest opacity-70 leading-tight">Biaya</p>
            <p className="brut-num text-lg xs:text-xl sm:text-2xl leading-tight">Rp {biayaPemeliharaan.toLocaleString("id-ID")}</p>
          </div>
        </div>
      </div>

      <Card
        className="mb-4 sm:mb-6"
        icon={Filter}
        title="Filter Laporan"
        sub="Saring laporan berdasarkan kondisi aset"
      >
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <Label>Kondisi</Label>
            <Select value={filterKondisi} onChange={(e) => setFilterKondisi(e.target.value)}>
              <option value="">Semua Kondisi</option>
              <option value="Baik">Baik</option>
              <option value="Rusak">Rusak</option>
              <option value="Hilang">Hilang</option>
            </Select>
          </div>
          <Button onClick={fetchData}>Terapkan</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6 mb-3 sm:mb-6">
        <Card
          title="Aset per Komisi"
          sub="Distribusi aset berdasarkan komisi"
          icon={Package}
          className="lg:col-span-2"
        >
          <div className="h-72">
            <SvgBarChart data={barChartData} empty={distribution.byKomisi.filter(k => k.count > 0).length === 0} />
          </div>
        </Card>

        <Card title="Aset per Kondisi" sub="Status kondisi seluruh aset" icon={Activity}>
          <div className="h-64">
            <SvgDoughnutChart data={doughnutChartData} empty={distribution.byKondisi.length === 0} />
          </div>
          <div className="mt-3 flex justify-center gap-3 flex-wrap">
            {kondisiFiltered.map((k) => (
              <span key={k.kondisi} className="flex items-center gap-1.5 text-xs font-bold text-muted uppercase">
                <span
                  className="w-3 h-3 border-2 border-ink"
                  style={{ backgroundColor: kondisiColors[k.kondisi] || "#6b6557" }}
                />
                {k.kondisi} ({totalKondisi > 0 ? ((k.count / totalKondisi) * 100).toFixed(0) : 0}%)
              </span>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
        <Card title="Ringkasan Peminjaman" sub="Statistik peminjaman aset" icon={ArrowRightLeft}>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b-2 border-ink pb-2">
              <span className="font-bold text-sm">Total Peminjaman</span>
              <span className="brut-num text-lg">{summary.totalPeminjaman}</span>
            </div>
            <div className="flex justify-between items-center border-b-2 border-ink pb-2">
              <span className="font-bold text-sm">Sedang Dipinjam</span>
              <span className="brut-num text-lg text-warn">{summary.peminjamanAktif}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm">Sudah Dikembalikan</span>
              <span className="brut-num text-lg text-good">{summary.peminjamanDikembalikan}</span>
            </div>
          </div>
        </Card>

        <Card title="Ringkasan Aset" sub="Statistik kondisi aset" icon={Package}>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b-2 border-ink pb-2">
              <span className="font-bold text-sm">Total Aset</span>
              <span className="brut-num text-lg">{summary.totalBarang}</span>
            </div>
            <div className="flex justify-between items-center border-b-2 border-ink pb-2">
              <span className="font-bold text-sm">Kondisi Baik</span>
              <span className="brut-num text-lg text-good">{summary.barangAktif}</span>
            </div>
            <div className="flex justify-between items-center border-b-2 border-ink pb-2">
              <span className="font-bold text-sm">Kondisi Rusak</span>
              <span className="brut-num text-lg text-danger">{summary.barangRusak}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm">Kondisi Hilang</span>
              <span className="brut-num text-lg text-warn">{summary.barangHilang}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
