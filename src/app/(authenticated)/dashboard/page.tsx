"use client"

import { useEffect, useState } from "react"
import {
  Package,
  ArrowRightLeft,
  AlertTriangle,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
} from "lucide-react"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"
import { Bar, Doughnut } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

interface DashboardData {
  stats: {
    totalBarang: number
    barangAktif: number
    barangRusak: number
    barangHilang: number
    totalKomisi: number
    peminjamanAktif: number
    totalMutasi: number
    totalPenghapusan: number
    totalPemeliharaan: number
  }
  recentBarang: {
    id: string
    kodeBarang: string
    namaBarang: string
    kondisi: string
    status: string
    komisi: { namaKomisi: string } | null
    createdAt: string
  }[]
  recentActivities: {
    id: string
    aktivitas: string
    waktu: string
    user: { namaLengkap: string } | null
  }[]
  barangByKomisi: {
    id: string
    namaKomisi: string
    count: number
  }[]
  barangByKondisi: {
    kondisi: string
    count: number
  }[]
}

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function kondisiColor(kondisi: string) {
  switch (kondisi) {
    case "Baik":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    case "Rusak":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    case "Hilang":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
  }
}

function statusColor(status: string) {
  return status === "Aktif"
    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat data dashboard")
        return res.json()
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">Memuat data dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <XCircle className="w-12 h-12 text-red-500" />
          <p className="text-gray-700 dark:text-gray-300 font-medium">Gagal memuat dashboard</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{error || "Data tidak tersedia"}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  const { stats, recentBarang, recentActivities, barangByKomisi, barangByKondisi } = data

  const statCards = [
    {
      title: "Total Aset",
      value: stats.totalBarang,
      icon: Package,
      gradient: "from-blue-500 to-blue-600",
      lightBg: "bg-blue-50 dark:bg-blue-950/50",
      iconBg: "bg-blue-100 dark:bg-blue-900/50",
      iconColor: "text-blue-600 dark:text-blue-400",
      textColor: "text-blue-600 dark:text-blue-400",
      subtext: `${stats.barangAktif} aktif`,
    },
    {
      title: "Dipinjam",
      value: stats.peminjamanAktif,
      icon: ArrowRightLeft,
      gradient: "from-amber-500 to-orange-500",
      lightBg: "bg-amber-50 dark:bg-amber-950/50",
      iconBg: "bg-amber-100 dark:bg-amber-900/50",
      iconColor: "text-amber-600 dark:text-amber-400",
      textColor: "text-amber-600 dark:text-amber-400",
      subtext: "saat ini",
    },
    {
      title: "Rusak / Hilang",
      value: stats.barangRusak + stats.barangHilang,
      icon: AlertTriangle,
      gradient: "from-red-500 to-rose-500",
      lightBg: "bg-red-50 dark:bg-red-950/50",
      iconBg: "bg-red-100 dark:bg-red-900/50",
      iconColor: "text-red-600 dark:text-red-400",
      textColor: "text-red-600 dark:text-red-400",
      subtext: `${stats.barangRusak} rusak, ${stats.barangHilang} hilang`,
    },
    {
      title: "Komisi",
      value: stats.totalKomisi,
      icon: Users,
      gradient: "from-purple-500 to-violet-500",
      lightBg: "bg-purple-50 dark:bg-purple-950/50",
      iconBg: "bg-purple-100 dark:bg-purple-900/50",
      iconColor: "text-purple-600 dark:text-purple-400",
      textColor: "text-purple-600 dark:text-purple-400",
      subtext: "terdaftar",
    },
  ]

  const barChartData = {
    labels: barangByKomisi.map((k) => k.namaKomisi),
    datasets: [
      {
        label: "Jumlah Aset",
        data: barangByKomisi.map((k) => k.count),
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
        ticks: {
          stepSize: 1,
          font: { size: 12 },
          color: "#9ca3af",
        },
        grid: { color: "rgba(156,163,175,0.15)" },
      },
      x: {
        ticks: {
          font: { size: 11 },
          color: "#9ca3af",
          maxRotation: 45,
        },
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
    labels: barangByKondisi.map((k) => k.kondisi),
    datasets: [
      {
        data: barangByKondisi.map((k) => k.count),
        backgroundColor: barangByKondisi.map((k) => kondisiColorMap[k.kondisi] || "rgba(156,163,175,0.75)"),
        borderColor: barangByKondisi.map((k) =>
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
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
            const pct = total > 0 ? ((context.raw / total) * 100).toFixed(1) : 0
            return ` ${context.label}: ${context.raw} (${pct}%)`
          },
        },
      },
    },
  }

  const totalKondisi = barangByKondisi.reduce((sum, k) => sum + k.count, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Ringkasan data aset GKJW Probolinggo
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className={`${card.lightBg} rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow duration-200`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
                  <p className={`text-3xl font-bold mt-1 ${card.textColor}`}>{card.value}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{card.subtext}</p>
                </div>
                <div className={`${card.iconBg} p-3 rounded-xl`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
              </div>
              <div className={`mt-3 h-1.5 rounded-full bg-gradient-to-r ${card.gradient} opacity-30`} />
            </div>
          )
        })}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Mutasi", value: stats.totalMutasi, icon: TrendingUp, color: "text-indigo-600 dark:text-indigo-400" },
          { label: "Penghapusan", value: stats.totalPenghapusan, icon: XCircle, color: "text-rose-600 dark:text-rose-400" },
          { label: "Pemeliharaan", value: stats.totalPemeliharaan, icon: Activity, color: "text-teal-600 dark:text-teal-400" },
          { label: "Aset Aktif", value: stats.barangAktif, icon: CheckCircle, color: "text-emerald-600 dark:text-emerald-400" },
        ].map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-3"
            >
              <Icon className={`w-5 h-5 ${item.color} shrink-0`} />
              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.label}</p>
                <p className="text-lg font-bold text-gray-800 dark:text-white">{item.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar Chart - Assets by Komisi */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-gray-800 dark:text-white">Aset per Komisi</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Distribusi aset berdasarkan komisi</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                {barangByKomisi.length} Komisi
              </span>
            </div>
          </div>
          <div className="h-64 sm:h-72">
            {barangByKomisi.length > 0 ? (
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
            <h2 className="text-base font-semibold text-gray-800 dark:text-white">Aset per Kondisi</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Status kondisi seluruh aset</p>
          </div>
          <div className="h-64 sm:h-72">
            {barangByKondisi.length > 0 ? (
              <Doughnut data={doughnutChartData} options={doughnutOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 text-sm">
                Belum ada data kondisi
              </div>
            )}
          </div>
          <div className="mt-3 flex justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            {barangByKondisi.map((k) => (
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

      {/* Bottom Row: Recent Assets & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Assets Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-5 pb-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-gray-800 dark:text-white">Aset Terbaru</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">5 aset yang baru ditambahkan</p>
              </div>
              <Package className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-gray-100 dark:border-gray-800">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Kode
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Komisi
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Kondisi
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {recentBarang.length > 0 ? (
                  recentBarang.map((barang) => (
                    <tr
                      key={barang.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-5 py-3 font-mono text-xs font-medium text-gray-700 dark:text-gray-300">
                        {barang.kodeBarang}
                      </td>
                      <td className="px-5 py-3 text-gray-800 dark:text-gray-200 max-w-[180px] truncate">
                        {barang.namaBarang}
                      </td>
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-400 max-w-[120px] truncate">
                        {barang.komisi?.namaKomisi || "-"}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${kondisiColor(barang.kondisi)}`}
                        >
                          {barang.kondisi}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(barang.status)}`}
                        >
                          {barang.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-8 text-center text-gray-400 dark:text-gray-500 text-sm"
                    >
                      Belum ada data aset
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-5 pb-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-gray-800 dark:text-white">Aktivitas Terbaru</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">10 aktivitas sistem terakhir</p>
              </div>
              <Activity className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
          <div className="max-h-[420px] overflow-y-auto">
            {recentActivities.length > 0 ? (
              <ul className="divide-y divide-gray-50 dark:divide-gray-800">
                {recentActivities.map((activity, idx) => (
                  <li
                    key={activity.id}
                    className="px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative mt-1">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            idx === 0
                              ? "bg-blue-500"
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        />
                        {idx < recentActivities.length - 1 && (
                          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-6 bg-gray-200 dark:bg-gray-700" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
                          {activity.aktivitas}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {activity.user?.namaLengkap || "Sistem"}
                          </span>
                          <span className="text-xs text-gray-300 dark:text-gray-600">•</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {formatDateTime(activity.waktu)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-5 py-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                Belum ada aktivitas
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
