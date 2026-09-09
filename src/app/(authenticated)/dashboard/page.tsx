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
  Landmark,
} from "lucide-react"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"
import { Bar, Doughnut } from "react-chartjs-2"
import { PageHeader, Marquee, StatCard, Card, Label, EmptyState, LoadingState, ErrorState, Badge } from "@/components/ui"

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

const kondisiBadge: Record<string, { c: "green" | "red" | "yellow"; t: string }> = {
  Baik: { c: "green", t: "Baik" },
  Rusak: { c: "red", t: "Rusak" },
  Hilang: { c: "yellow", t: "Hilang" },
}

const statusBadge: Record<string, "blue" | "gray"> = {
  Aktif: "blue",
  Nonaktif: "gray",
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

  if (loading) return <LoadingState text="Memuat dashboard..." />
  if (error || !data) return <ErrorState message={error || "Data tidak tersedia"} onRetry={() => window.location.reload()} />

  const { stats, recentBarang, recentActivities, barangByKomisi, barangByKondisi } = data

  const quickStats = [
    { label: "Mutasi", value: stats.totalMutasi, icon: TrendingUp, color: "vibe" as const },
    { label: "Penghapusan", value: stats.totalPenghapusan, icon: XCircle, color: "danger" as const },
    { label: "Pemeliharaan", value: stats.totalPemeliharaan, icon: Activity, color: "good" as const },
    { label: "Aset Aktif", value: stats.barangAktif, icon: CheckCircle, color: "warn" as const },
  ]

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: "#16161a",
        titleFont: { family: "'Space Grotesk', sans-serif", size: 13, weight: 700 as const },
        bodyFont: { family: "'Space Grotesk', sans-serif", size: 12, weight: 600 as const },
        padding: 12,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, font: { size: 12, weight: 700 as const }, color: "#6b6557" },
        grid: { color: "rgba(107,101,87,0.18)", lineWidth: 1 },
        border: { color: "#16161a", width: 3 },
      },
      x: {
        ticks: { font: { size: 11, weight: 600 as const }, color: "#6b6557", maxRotation: 45 },
        grid: { display: false },
        border: { color: "#16161a", width: 3 },
      },
    },
  }

  const barChartData = {
    labels: barangByKomisi.map((k) => k.namaKomisi),
    datasets: [
      {
        label: "Jumlah Aset",
        data: barangByKomisi.map((k) => k.count),
        backgroundColor: ["#2b59ff", "#23c677", "#ffc829", "#8b5cf6", "#ff4d3d", "#0cc0df", "#ff7a1a", "#16161a"],
        borderColor: "#16161a",
        borderWidth: 3,
        borderRadius: 0,
        maxBarThickness: 42,
      },
    ],
  }

  const kondisiColorMap: Record<string, string> = {
    Baik: "#23c677",
    Rusak: "#ff4d3d",
    Hilang: "#ffc829",
  }

  const doughnutChartData = {
    labels: barangByKondisi.map((k) => k.kondisi),
    datasets: [
      {
        data: barangByKondisi.map((k) => k.count),
        backgroundColor: barangByKondisi.map((k) => kondisiColorMap[k.kondisi] || "#6b6557"),
        borderColor: "#16161a",
        borderWidth: 3,
        hoverOffset: 12,
      },
    ],
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "62%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyle: "rect" as const,
          font: { family: "'Space Grotesk', sans-serif", size: 12, weight: 700 as const },
          color: "#6b6557",
        },
      },
      tooltip: {
        backgroundColor: "#16161a",
        titleFont: { family: "'Space Grotesk', sans-serif", size: 13, weight: 700 as const },
        bodyFont: { family: "'Space Grotesk', sans-serif", size: 12, weight: 600 as const },
        padding: 12,
        displayColors: false,
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
    <div>
      <PageHeader
        index="01"
        title="Dashboard"
        desc="Ringkasan data aset GKJW Probolinggo"
        extra={
          <span className="brut-sticker-help hidden sm:inline-flex">
            <Clock className="w-4 h-4" strokeWidth={3} />
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        }
      />

      <Marquee
        items={[
          "Total Aset " + stats.totalBarang,
          "Dipinjam " + stats.peminjamanAktif,
          "Rusak " + stats.barangRusak,
          "Hilang " + stats.barangHilang,
          "Komisi " + stats.totalKomisi,
          "GKJW PROBOLINGGO",
        ]}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          icon={Package}
          title="Total Aset"
          value={stats.totalBarang}
          sub={`${stats.barangAktif} aktif`}
          face="primary"
        />
        <StatCard
          icon={ArrowRightLeft}
          title="Dipinjam"
          value={stats.peminjamanAktif}
          sub="saat ini"
          face="warn"
        />
        <StatCard
          icon={AlertTriangle}
          title="Rusak / Hilang"
          value={stats.barangRusak + stats.barangHilang}
          sub={`${stats.barangRusak} rusak · ${stats.barangHilang} hilang`}
          face="danger"
        />
        <StatCard
          icon={Landmark}
          title="Komisi"
          value={stats.totalKomisi}
          sub="terdaftar"
          face="vibe"
        />
      </div>

      {/* Quick stats chips */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {quickStats.map((item) => {
          const Icon = item.icon
          const face =
            item.color === "good" ? "bg-good" :
            item.color === "danger" ? "bg-danger text-white" :
            item.color === "warn" ? "bg-warn" : "bg-vibe text-white"
          return (
            <div key={item.label} className={`brut-card p-4 flex items-center gap-3 ${face} rotate-[0.5deg] hover:rotate-0 transition-transform`}>
              <span className="w-10 h-10 shrink-0 grid place-items-center border-[3px] border-ink bg-card text-ink -rotate-3">
                <Icon className="w-5 h-5" strokeWidth={2.75} />
              </span>
              <div className="min-w-0">
                <p className="text-[0.62rem] font-bold uppercase tracking-widest opacity-70">{item.label}</p>
                <p className="brut-num text-xl leading-tight">{item.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card
          title="Aset per Komisi"
          sub="Distribusi aset berdasarkan komisi"
          icon={Package}
          className="lg:col-span-2"
          actions={<span className="brut-sticker-help !px-3 !py-1 !text-[0.62rem]">{barangByKomisi.length} Komisi</span>}
        >
          <div className="h-72">
            {barangByKomisi.length > 0 ? (
              <Bar data={barChartData} options={chartOptions} />
            ) : (
              <EmptyState text="Belum ada data komisi" icon={Landmark} />
            )}
          </div>
        </Card>

        <Card title="Aset per Kondisi" sub="Status kondisi seluruh aset" icon={Activity}>
          <div className="h-64">
            {barangByKondisi.length > 0 ? (
              <Doughnut data={doughnutChartData} options={doughnutOptions} />
            ) : (
              <EmptyState text="Belum ada data kondisi" icon={Activity} />
            )}
          </div>
          <div className="mt-3 flex justify-center gap-3 flex-wrap">
            {barangByKondisi.map((k) => (
              <span key={k.kondisi} className="flex items-center gap-1.5 text-xs font-bold text-muted uppercase">
                <span
                  className="w-3 h-3 border-2 border-ink"
                  style={{ backgroundColor: kondisiColorMap[k.kondisi] }}
                />
                {k.kondisi} ({totalKondisi > 0 ? ((k.count / totalKondisi) * 100).toFixed(0) : 0}%)
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Aset Terbaru" sub="5 aset yang baru ditambahkan" icon={Package}>
          {recentBarang.length > 0 ? (
            <div className="divide-y-[3px] divide-ink border-2 border-ink">
              {recentBarang.map((barang) => (
                <div key={barang.id} className="flex items-center justify-between gap-3 px-3 py-2.5 hover:bg-paper2 transition-colors">
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">{barang.namaBarang}</p>
                    <p className="font-mono text-xs text-muted">{barang.kodeBarang}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline text-xs font-bold text-muted">{barang.komisi?.namaKomisi || "-"}</span>
                    <Badge color={kondisiBadge[barang.kondisi]?.c || "default"}>{barang.kondisi}</Badge>
                    <Badge color={statusBadge[barang.status] || "default"}>{barang.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="Belum ada data aset" icon={Package} />
          )}
        </Card>

        <Card title="Aktivitas Terbaru" sub="10 aktivitas sistem terakhir" icon={Activity}>
          {recentActivities.length > 0 ? (
            <div className="max-h-[380px] overflow-y-auto pr-2">
              {recentActivities.map((activity, idx) => (
                <div key={activity.id} className="relative flex items-start gap-4 pb-5 last:pb-0">
                  <div className="flex flex-col items-center shrink-0">
                    <span
                      className={`w-4 h-4 border-2 border-ink ${
                        idx === 0 ? "bg-warn" : "bg-paper2"
                      }`}
                    />
                    {idx < recentActivities.length - 1 && <span className="w-[3px] flex-1 bg-ink/25 mt-1" />}
                  </div>
                  <div className="min-w-0 -mt-0.5">
                    <p className="text-sm font-bold leading-snug">{activity.aktivitas}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 border-2 border-ink bg-paper2 px-2 py-0.5 text-[0.65rem] font-bold text-ink uppercase tracking-wider">
                        {activity.user?.namaLengkap || "Sistem"}
                      </span>
                      <span className="text-xs font-bold text-muted">·</span>
                      <span className="text-xs font-bold text-muted">{formatDateTime(activity.waktu)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="Belum ada aktivitas" icon={Activity} />
          )}
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Label icon={Users}>GKJW Jemaat Probolinggo</Label>
      </div>
    </div>
  )
}