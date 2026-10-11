"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Package, ArrowRightLeft, TrendingUp, XCircle, Activity,
  Filter, BarChart3, Calendar, FileText, ClipboardList,
  Repeat, Trash2, Wrench, Wallet,
} from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"
import dynamic from "next/dynamic"

const Bar = dynamic(() => import("react-chartjs-2").then(m => ({ default: m.Bar })), { ssr: false })
const Doughnut = dynamic(() => import("react-chartjs-2").then(m => ({ default: m.Doughnut })), { ssr: false })
import {
  PageHeader, Label, StatCard, Card, Select, Input,
  Button, LoadingState, ErrorState, EmptyState,
} from "@/components/ui"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

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
    biayaPemeliharaan: number
  }
  distribution: {
    byKomisi: { id: string; namaKomisi: string; count: number }[]
    byKondisi: { kondisi: string; count: number }[]
    byStatus: { status: string; count: number }[]
  }
  monthlyPeminjaman: { month: string; count: number }[]
}

interface KomisiOption {
  id: string
  namaKomisi: string
}

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)
}

function formatMonth(monthStr: string) {
  const [year, month] = monthStr.split("-")
  const date = new Date(Number(year), Number(month) - 1)
  return date.toLocaleDateString("id-ID", { month: "short", year: "2-digit" })
}


// Lazy chart wrappers
function BarChart({ data, options, empty }: { data: any; options: any; empty?: boolean }) {
  const [Comp, setComp] = useState<any>(null)
  useEffect(() => {
    import("react-chartjs-2").then(m => setComp(() => m.Bar))
  }, [])
  if (empty) return <div className="h-full flex items-center justify-center text-muted font-bold">Tidak ada data</div>
  if (!Comp) return <div className="h-full flex items-center justify-center text-muted font-bold">Memuat grafik...</div>
  return <Comp data={data} options={options} />
}

function DoughnutChart({ data, options, empty }: { data: any; options: any; empty?: boolean }) {
  const [Comp, setComp] = useState<any>(null)
  useEffect(() => {
    import("react-chartjs-2").then(m => setComp(() => m.Doughnut))
  }, [])
  if (empty) return <div className="h-full flex items-center justify-center text-muted font-bold">Tidak ada data</div>
  if (!Comp) return <div className="h-full flex items-center justify-center text-muted font-bold">Memuat grafik...</div>
  return <Comp data={data} options={options} />
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [komisiList, setKomisiList] = useState<KomisiOption[]>([])
  const [filterKomisi, setFilterKomisi] = useState("")
  const [filterKondisi, setFilterKondisi] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filterKomisi) params.set("komisiId", filterKomisi)
      if (filterKondisi) params.set("kondisi", filterKondisi)
      if (filterStatus) params.set("status", filterStatus)
      if (dateFrom) params.set("dateFrom", dateFrom)
      if (dateTo) params.set("dateTo", dateTo)

      const res = await fetch(`/api/reports?${params.toString()}`)
      if (!res.ok) throw new Error("Gagal memuat data laporan")
      const json = await res.json()
      setData(json)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }, [filterKomisi, filterKondisi, filterStatus, dateFrom, dateTo])

  useEffect(() => {
    fetch("/api/komisi")
      .then((res) => (res.ok ? res.json() : []))
      .then((json) => setKomisiList(Array.isArray(json) ? json : json.data || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  function resetFilters() {
    setFilterKomisi("")
    setFilterKondisi("")
    setFilterStatus("")
    setDateFrom("")
    setDateTo("")
  }

  if (loading && !data) return <LoadingState text="Memuat data laporan..." />

  if (error && !data) return (
    <ErrorState message={error} onRetry={() => fetchData()} />
  )

  if (!data) return null

  const { summary, distribution, monthlyPeminjaman } = data

  const barChartData = {
    labels: distribution.byKomisi.map((k) => k.namaKomisi),
    datasets: [
      {
        label: "Jumlah Aset",
        data: distribution.byKomisi.map((k) => k.count),
        backgroundColor: [
          "#2b59ff",
          "#23c677",
          "#ffc829",
          "#8b5cf6",
          "#ff4d3d",
          "#14b8a6",
          "#f97316",
          "#6366f1",
        ],
        borderColor: "#16161a",
        borderWidth: 3,
        borderRadius: 0,
      },
    ],
  }

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: "#16161a",
        titleFont: { size: 13, family: "Space Grotesk", weight: "bold" as const },
        bodyFont: { size: 12, family: "Space Grotesk" },
        padding: 10,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, font: { size: 12, family: "Space Grotesk" }, color: "#6b6b6b" },
        grid: { color: "rgba(22,22,26,0.12)" },
        border: { color: "#16161a" },
      },
      x: {
        ticks: { font: { size: 11, family: "Space Grotesk" }, color: "#6b6b6b", maxRotation: 45 },
        grid: { display: false },
        border: { color: "#16161a" },
      },
    },
  }

  const kondisiColorMap: Record<string, string> = {
    Baik: "#23c677",
    Rusak: "#ff4d3d",
    Hilang: "#ffc829",
  }

  const doughnutChartData = {
    labels: distribution.byKondisi.map((k) => k.kondisi),
    datasets: [
      {
        data: distribution.byKondisi.map((k) => k.count),
        backgroundColor: distribution.byKondisi.map(
          (k) => kondisiColorMap[k.kondisi] || "#9ca3af"
        ),
        borderColor: "#16161a",
        borderWidth: 4,
        hoverOffset: 8,
      },
    ],
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "58%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyle: "rectRounded" as const,
          font: { size: 13, family: "Space Grotesk", weight: "bold" as const },
          color: "#6b6b6b",
        },
      },
      tooltip: {
        backgroundColor: "#16161a",
        titleFont: { size: 13, family: "Space Grotesk", weight: "bold" as const },
        bodyFont: { size: 12, family: "Space Grotesk" },
        padding: 10,
        callbacks: {
          label: function (context: any) {
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            )
            const pct =
              total > 0 ? ((context.raw / total) * 100).toFixed(1) : 0
            return ` ${context.label}: ${context.raw} (${pct}%)`
          },
        },
      },
    },
  }

  const totalKondisi = distribution.byKondisi.reduce(
    (sum, k) => sum + k.count,
    0
  )

  const monthlyChartData = {
    labels: monthlyPeminjaman.map((m) => formatMonth(m.month)),
    datasets: [
      {
        label: "Peminjaman",
        data: monthlyPeminjaman.map((m) => m.count),
        backgroundColor: "#ffc829",
        borderColor: "#16161a",
        borderWidth: 3,
        borderRadius: 0,
      },
    ],
  }

  const subReports = [
    {
      title: "Laporan Aset",
      desc: "Data seluruh aset dan inventaris",
      icon: ClipboardList,
      href: "/reports/aset",
      face: "primary" as const,
    },
    {
      title: "Laporan Peminjaman",
      desc: "Riwayat peminjaman aset",
      icon: FileText,
      href: "/reports/peminjaman",
      face: "warn" as const,
    },
    {
      title: "Laporan Mutasi",
      desc: "Perpindahan lokasi aset",
      icon: Repeat,
      href: "/reports/mutasi",
      face: "vibe" as const,
    },
    {
      title: "Laporan Penghapusan",
      desc: "Aset yang telah dihapus",
      icon: Trash2,
      href: "/reports/penghapusan",
      face: "danger" as const,
    },
    {
      title: "Laporan Valuasi Aset",
      desc: "Nilai buku, penyusutan & valuasi aset",
      icon: Wallet,
      href: "/valuasi",
      face: "vibe" as const,
    },
    {
      title: "Laporan Pemeliharaan",
      desc: "Riwayat perawatan aset",
      icon: Wrench,
      href: "/reports/pemeliharaan",
      face: "good" as const,
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        index="07"
        title="Laporan"
        desc="Ringkasan dan analisis data aset GKJW Probolinggo"
        extra={
          <Label icon={Calendar}>
            {new Date().toLocaleDateString("id-ID", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Label>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
        <StatCard icon={Package} title="Total Aset" value={summary.totalBarang} sub={`${summary.barangAktif} aktif`} face="primary" />
        <StatCard icon={ArrowRightLeft} title="Peminjaman" value={summary.totalPeminjaman} sub={`${summary.peminjamanAktif} aktif`} face="warn" />
        <StatCard icon={TrendingUp} title="Mutasi" value={summary.totalMutasi} sub="total riwayat" face="vibe" />
        <StatCard icon={XCircle} title="Penghapusan" value={summary.totalPenghapusan} sub="total dihapus" face="danger" />
        <StatCard icon={Activity} title="Pemeliharaan" value={summary.totalPemeliharaan} sub={formatRupiah(summary.biayaPemeliharaan)} face="good" />
      </div>

      <Card
        title="Filter Laporan"
        sub="Persempit rentang data laporan"
        icon={Filter}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div>
            <Label>Komisi</Label>
            <Select value={filterKomisi} onChange={(e) => setFilterKomisi(e.target.value)} className="mt-2">
              <option value="">Semua Komisi</option>
              {komisiList.map((k) => (
                <option key={k.id} value={k.id}>{k.namaKomisi}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Kondisi</Label>
            <Select value={filterKondisi} onChange={(e) => setFilterKondisi(e.target.value)} className="mt-2">
              <option value="">Semua Kondisi</option>
              <option value="Baik">Baik</option>
              <option value="Rusak">Rusak</option>
              <option value="Hilang">Hilang</option>
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="mt-2">
              <option value="">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </Select>
          </div>
          <div>
            <Label>Dari Tanggal</Label>
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="mt-2" />
          </div>
          <div>
            <Label>Sampai Tanggal</Label>
            <div className="flex gap-2 mt-2">
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              <Button onClick={resetFilters} variant="dark" className="shrink-0">Reset</Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card
          title="Aset per Komisi"
          sub="Distribusi aset berdasarkan komisi"
          icon={BarChart3}
          className="lg:col-span-2"
          actions={<Label color="blue">{distribution.byKomisi.length} Komisi</Label>}
        >
          <div className="h-64 sm:h-72">
            {distribution.byKomisi.length > 0 ? (
              <BarChart data={barChartData} options={barChartOptions} />
            ) : (
              <EmptyState text="Belum ada data komisi" />
            )}
          </div>
        </Card>

        <Card
          title="Aset per Kondisi"
          sub="Status kondisi seluruh aset"
          icon={BarChart3}
          actions={<Label color="yellow">{totalKondisi} Total</Label>}
        >
          <div className="h-64 sm:h-72">
            {distribution.byKondisi.length > 0 ? (
              <DoughnutChart data={doughnutChartData} options={doughnutOptions} empty={false} />
            ) : (
              <EmptyState text="Belum ada data kondisi" />
            )}
          </div>
          <div className="mt-3 flex justify-center gap-4 text-xs font-bold text-muted">
            {distribution.byKondisi.map((k) => (
              <span key={k.kondisi} className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 border-2 border-ink"
                  style={{ backgroundColor: kondisiColorMap[k.kondisi] || "#9ca3af" }}
                />
                {k.kondisi} ({totalKondisi > 0 ? ((k.count / totalKondisi) * 100).toFixed(0) : 0}%)
              </span>
            ))}
          </div>
        </Card>
      </div>

      <Card
        title="Aktivitas Peminjaman Bulanan"
        sub="Jumlah peminjaman per bulan (12 bulan terakhir)"
        icon={BarChart3}
        actions={<Label color="yellow">{summary.totalPeminjaman} Total</Label>}
      >
        <div className="h-64 sm:h-72">
          {monthlyPeminjaman.length > 0 ? (
            <BarChart data={monthlyChartData} options={barChartOptions} />
          ) : (
            <EmptyState text="Belum ada data peminjaman" />
          )}
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="brut-sticker w-10 h-10 text-base">
            <FileText className="w-5 h-5" strokeWidth={3} />
          </span>
          <h2 className="brut-title brut-h2">Laporan Detail</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-5">
          {subReports.map((report) => {
            const Icon = report.icon
            return (
              <a
                key={report.title}
                href={report.href}
                className="brut-card p-4 sm:p-5 bg-card hover:bg-paper2 transition-colors group"
              >
                <span className="brut-sticker w-11 h-11 text-lg mb-3 sm:mb-4 rotate-3 group-hover:-rotate-3 transition-transform">
                  <Icon className="w-5 h-5" strokeWidth={3} />
                </span>
                <h3 className="brut-title brut-h3 break-words">{report.title}</h3>
                <p className="text-xs text-muted font-semibold mt-1">{report.desc}</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-wider text-primary">
                  Lihat detail →
                </p>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}