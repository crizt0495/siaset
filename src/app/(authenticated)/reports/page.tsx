"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Package,
  ArrowRightLeft,
  TrendingUp,
  XCircle,
  Activity,
  Filter,
  BarChart3,
  Calendar,
  FileText,
  ClipboardList,
  Repeat,
  Trash2,
  Wrench,
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
import { Bar, Doughnut } from "react-chartjs-2"

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

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">Memuat data laporan...</p>
        </div>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <XCircle className="w-12 h-12 text-red-500" />
          <p className="text-gray-700 dark:text-gray-300 font-medium">Gagal memuat laporan</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{error}</p>
          <button
            onClick={() => fetchData()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { summary, distribution, monthlyPeminjaman } = data

  const statCards = [
    {
      title: "Total Aset",
      value: summary.totalBarang,
      icon: Package,
      gradient: "from-blue-500 to-blue-600",
      lightBg: "bg-blue-50 dark:bg-blue-950/50",
      iconBg: "bg-blue-100 dark:bg-blue-900/50",
      iconColor: "text-blue-600 dark:text-blue-400",
      textColor: "text-blue-600 dark:text-blue-400",
      subtext: `${summary.barangAktif} aktif`,
    },
    {
      title: "Peminjaman",
      value: summary.totalPeminjaman,
      icon: ArrowRightLeft,
      gradient: "from-amber-500 to-orange-500",
      lightBg: "bg-amber-50 dark:bg-amber-950/50",
      iconBg: "bg-amber-100 dark:bg-amber-900/50",
      iconColor: "text-amber-600 dark:text-amber-400",
      textColor: "text-amber-600 dark:text-amber-400",
      subtext: `${summary.peminjamanAktif} aktif`,
    },
    {
      title: "Mutasi",
      value: summary.totalMutasi,
      icon: TrendingUp,
      gradient: "from-indigo-500 to-violet-500",
      lightBg: "bg-indigo-50 dark:bg-indigo-950/50",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/50",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      textColor: "text-indigo-600 dark:text-indigo-400",
      subtext: "total riwayat",
    },
    {
      title: "Penghapusan",
      value: summary.totalPenghapusan,
      icon: XCircle,
      gradient: "from-rose-500 to-red-500",
      lightBg: "bg-rose-50 dark:bg-rose-950/50",
      iconBg: "bg-rose-100 dark:bg-rose-900/50",
      iconColor: "text-rose-600 dark:text-rose-400",
      textColor: "text-rose-600 dark:text-rose-400",
      subtext: "total dihapus",
    },
    {
      title: "Pemeliharaan",
      value: summary.totalPemeliharaan,
      icon: Activity,
      gradient: "from-teal-500 to-emerald-500",
      lightBg: "bg-teal-50 dark:bg-teal-950/50",
      iconBg: "bg-teal-100 dark:bg-teal-900/50",
      iconColor: "text-teal-600 dark:text-teal-400",
      textColor: "text-teal-600 dark:text-teal-400",
      subtext: formatRupiah(summary.biayaPemeliharaan),
    },
  ]

  const barChartData = {
    labels: distribution.byKomisi.map((k) => k.namaKomisi),
    datasets: [
      {
        label: "Jumlah Aset",
        data: distribution.byKomisi.map((k) => k.count),
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(236, 72, 153, 0.7)",
          "rgba(20, 184, 166, 0.7)",
          "rgba(249, 115, 22, 0.7)",
          "rgba(99, 102, 241, 0.7)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
          "rgb(139, 92, 246)",
          "rgb(236, 72, 153)",
          "rgb(20, 184, 166)",
          "rgb(249, 115, 22)",
          "rgb(99, 102, 241)",
        ],
        borderWidth: 1,
        borderRadius: 6,
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
        backgroundColor: "rgba(0,0,0,0.8)",
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, font: { size: 12 }, color: "#9ca3af" },
        grid: { color: "rgba(156,163,175,0.15)" },
      },
      x: {
        ticks: { font: { size: 11 }, color: "#9ca3af", maxRotation: 45 },
        grid: { display: false },
      },
    },
  }

  const kondisiColorMap: Record<string, string> = {
    Baik: "rgba(34, 197, 94, 0.75)",
    Rusak: "rgba(239, 68, 68, 0.75)",
    Hilang: "rgba(234, 179, 8, 0.75)",
  }

  const doughnutChartData = {
    labels: distribution.byKondisi.map((k) => k.kondisi),
    datasets: [
      {
        data: distribution.byKondisi.map((k) => k.count),
        backgroundColor: distribution.byKondisi.map(
          (k) => kondisiColorMap[k.kondisi] || "rgba(156,163,175,0.75)"
        ),
        borderColor: distribution.byKondisi.map((k) =>
          k.kondisi === "Baik"
            ? "rgb(34, 197, 94)"
            : k.kondisi === "Rusak"
              ? "rgb(239, 68, 68)"
              : "rgb(234, 179, 8)"
        ),
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
          font: { size: 13 },
          color: "#9ca3af",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 8,
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
        backgroundColor: "rgba(245, 158, 11, 0.7)",
        borderColor: "rgb(245, 158, 11)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  }

  const subReports = [
    {
      title: "Laporan Aset",
      desc: "Data seluruh aset dan inventaris",
      icon: ClipboardList,
      href: "/reports/aset",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Laporan Peminjaman",
      desc: "Riwayat peminjaman aset",
      icon: FileText,
      href: "/reports/peminjaman",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      title: "Laporan Mutasi",
      desc: "Perpindahan lokasi aset",
      icon: Repeat,
      href: "/reports/mutasi",
      gradient: "from-indigo-500 to-violet-500",
    },
    {
      title: "Laporan Penghapusan",
      desc: "Aset yang telah dihapus",
      icon: Trash2,
      href: "/reports/penghapusan",
      gradient: "from-rose-500 to-red-500",
    },
    {
      title: "Laporan Pemeliharaan",
      desc: "Riwayat perawatan aset",
      icon: Wrench,
      href: "/reports/pemeliharaan",
      gradient: "from-teal-500 to-emerald-500",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Laporan</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Ringkasan dan analisis data aset GKJW Probolinggo
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className={`${card.lightBg} rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow duration-200`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {card.title}
                  </p>
                  <p className={`text-3xl font-bold mt-1 ${card.textColor}`}>
                    {card.value}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {card.subtext}
                  </p>
                </div>
                <div className={`${card.iconBg} p-3 rounded-xl`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
              </div>
              <div
                className={`mt-3 h-1.5 rounded-full bg-gradient-to-r ${card.gradient} opacity-30`}
              />
            </div>
          )
        })}
      </div>

      {/* Filter Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h2 className="text-base font-semibold text-gray-800 dark:text-white">
            Filter Laporan
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              Komisi
            </label>
            <select
              value={filterKomisi}
              onChange={(e) => setFilterKomisi(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">Semua Komisi</option>
              {komisiList.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.namaKomisi}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              Kondisi
            </label>
            <select
              value={filterKondisi}
              onChange={(e) => setFilterKondisi(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">Semua Kondisi</option>
              <option value="Baik">Baik</option>
              <option value="Rusak">Rusak</option>
              <option value="Hilang">Hilang</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              Dari Tanggal
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              Sampai Tanggal
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button
                onClick={resetFilters}
                className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shrink-0"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar Chart - Assets by Komisi */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-gray-800 dark:text-white">
                Aset per Komisi
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Distribusi aset berdasarkan komisi
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                {distribution.byKomisi.length} Komisi
              </span>
            </div>
          </div>
          <div className="h-64 sm:h-72">
            {distribution.byKomisi.length > 0 ? (
              <Bar data={barChartData} options={barChartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 text-sm">
                Belum ada data komisi
              </div>
            )}
          </div>
        </div>

        {/* Doughnut Chart - Assets by Kondisi */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white">
              Aset per Kondisi
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Status kondisi seluruh aset
            </p>
          </div>
          <div className="h-64 sm:h-72">
            {distribution.byKondisi.length > 0 ? (
              <Doughnut data={doughnutChartData} options={doughnutOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 text-sm">
                Belum ada data kondisi
              </div>
            )}
          </div>
          <div className="mt-3 flex justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            {distribution.byKondisi.map((k) => (
              <span key={k.kondisi} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      k.kondisi === "Baik"
                        ? "rgb(34, 197, 94)"
                        : k.kondisi === "Rusak"
                          ? "rgb(239, 68, 68)"
                          : "rgb(234, 179, 8)",
                  }}
                />
                {k.kondisi} ({totalKondisi > 0 ? ((k.count / totalKondisi) * 100).toFixed(0) : 0}%)
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Activity Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white">
              Aktivitas Peminjaman Bulanan
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Jumlah peminjaman per bulan (12 bulan terakhir)
            </p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full">
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              {summary.totalPeminjaman} Total
            </span>
          </div>
        </div>
        <div className="h-64 sm:h-72">
          {monthlyPeminjaman.length > 0 ? (
            <Bar data={monthlyChartData} options={barChartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 text-sm">
              Belum ada data peminjaman
            </div>
          )}
        </div>
      </div>

      {/* Sub-report Links */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h2 className="text-base font-semibold text-gray-800 dark:text-white">
            Laporan Detail
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {subReports.map((report) => {
            const Icon = report.icon
            return (
              <a
                key={report.title}
                href={report.href}
                className="group bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-200"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${report.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                  {report.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {report.desc}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Lihat detail
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
