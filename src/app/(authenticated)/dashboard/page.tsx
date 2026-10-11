"use client"

import { useEffect, useState } from "react"
import {
  ArrowRightLeft,
  AlertTriangle,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  Landmark,
  Package,
  Wallet,
} from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

const Bar = dynamic(() => import("react-chartjs-2").then(m => ({ default: m.Bar })), { ssr: false })
const Doughnut = dynamic(() => import("react-chartjs-2").then(m => ({ default: m.Doughnut })), { ssr: false })
import { PageHeader, Marquee, StatCard, Card, Label, EmptyState, LoadingState, ErrorState, Badge } from "@/components/ui"
import { formatRupiahRingkas } from "@/lib/format"


interface DashboardData {
  stats: {
    totalBarang: number
    barangAktif: number
    barangNonaktif: number
    barangBaik: number
    barangRusak: number
    barangHilang: number
    totalKomisi: number
    peminjamanAktif: number
    totalMutasi: number
    totalPenghapusan: number
    totalPemeliharaan: number
  }
  distribution: {
    byKomisi: {
      id: string
      namaKomisi: string
      count: number
    }[]
    byKondisi: {
      kondisi: string
      count: number
    }[]
    tanpaKomisi: number
    komisiDenganAset: number
  }
  valuasi: {
    nilaiPerolehan: number
    akumulasiPenyusutan: number
    nilaiBuku: number
    persenSusut: number
    asetTersusut: number
    asetAktifDisusut: number
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


// Lightweight SVG Bar Chart
function SvgBarChart({ data, options, empty }: { data: any; options?: any; empty?: boolean }) {
  if (empty || !data?.labels?.length) return <EmptyState text="Belum ada data komisi" icon={Landmark} />
  const max = Math.max(...data.datasets[0].data)
  const colors = ["#2b59ff", "#23c677", "#ffc829", "#8b5cf6", "#ff4d3d", "#0cc0df", "#ff7a1a", "#16161a"]
  return (
    <div className="flex items-end gap-2 h-full px-2">
      {data.labels.map((label: string, i: number) => {
        const val = data.datasets[0].data[i]
        const h = max > 0 ? (val / max) * 100 : 0
        return (
          <div key={label} className="flex-1 flex flex-col items-center gap-1 min-w-0">
            <span className="text-xs font-bold text-muted">{val}</span>
            <div className="w-full max-w-[42px] border-[3px] border-ink" style={{ height: `${h}%`, backgroundColor: colors[i % colors.length] }} />
            <span className="text-[0.6rem] font-bold text-muted truncate w-full text-center">{label}</span>
          </div>
        )
      })}
    </div>
  )
}

// Lightweight SVG Doughnut Chart
function SvgDoughnutChart({ data, options, empty }: { data: any; options?: any; empty?: boolean }) {
  if (empty || !data?.labels?.length) return <EmptyState text="Belum ada data kondisi" icon={Activity} />
  const total = data.datasets[0].data.reduce((a: number, b: number) => a + b, 0)
  const colors = data.labels.map((l: string) => l === 'Baik' ? '#23c677' : l === 'Rusak' ? '#ff4d3d' : '#ffc829')
  let cumulative = 0
  const segments = data.datasets[0].data.map((val: number, i: number) => {
    const pct = total > 0 ? (val / total) * 100 : 0
    const start = cumulative
    cumulative += pct
    return { pct, color: colors[i], label: data.labels[i], val, start }
  })
  // SVG arc path
  const R = 40, C = 50
  const polar = (angle: number) => ({ x: C + R * Math.cos(angle * Math.PI / 180), y: C + R * Math.sin(angle * Math.PI / 180) })
  const arc = (start: number, end: number) => {
    const s = polar(start), e = polar(end)
    const large = end - start > 180 ? 1 : 0
    return `M ${C} ${C} L ${s.x} ${s.y} A ${R} ${R} 0 ${large} 1 ${e.x} ${e.y} Z`
  }
  return (
    <div className="flex flex-col items-center gap-2 h-full justify-center">
      <svg viewBox="0 0 100 100" className="w-32 h-32">
        {segments.map((seg: any, i: number) => seg.pct > 0 ? (
          <path key={i} d={arc(segments.slice(0, i).reduce((a: number, s: any) => a + s.pct, 0), segments.slice(0, i + 1).reduce((a: number, s: any) => a + s.pct, 0))} fill={seg.color} stroke="#16161a" strokeWidth="1" />
        ) : null)}
      </svg>
      <div className="flex gap-3 flex-wrap justify-center">
        {data.labels.map((l: string, i: number) => (
          <span key={l} className="flex items-center gap-1 text-xs font-bold text-muted uppercase">
            <span className="w-3 h-3 border-2 border-ink" style={{ backgroundColor: colors[i] }} />
            {l} ({total > 0 ? ((data.datasets[0].data[i] / total) * 100).toFixed(0) : 0}%)
          </span>
        ))}
      </div>
    </div>
  )
}

// Lazy chart wrappers (now using SVG, no dynamic import needed)
function BarChart({ data, options, empty }: { data: any; options?: any; empty?: boolean }) {
  return <SvgBarChart data={data} options={options} empty={empty} />
}
function DoughnutChart({ data, options, empty }: { data: any; options?: any; empty?: boolean }) {
  return <SvgDoughnutChart data={data} options={options} empty={empty} />
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

  const { stats, distribution, valuasi, recentBarang, recentActivities } = data

  const quickStats = [
    { label: "Dipinjam", value: stats.peminjamanAktif, icon: ArrowRightLeft, color: "warn" as const },
    { label: "Mutasi", value: stats.totalMutasi, icon: TrendingUp, color: "vibe" as const },
    { label: "Penghapusan", value: stats.totalPenghapusan, icon: XCircle, color: "danger" as const },
    { label: "Pemeliharaan", value: stats.totalPemeliharaan, icon: Activity, color: "good" as const },
  ]

  const checks = [
    {
      label: "Aktif + Nonaktif = Total",
      detail: `${stats.barangAktif} + ${stats.barangNonaktif} = ${stats.totalBarang}`,
      ok: stats.barangAktif + stats.barangNonaktif === stats.totalBarang,
    },
    {
      label: "Baik + Rusak + Hilang = Total",
      detail: `${stats.barangBaik} + ${stats.barangRusak} + ${stats.barangHilang} = ${stats.totalBarang}`,
      ok: stats.barangBaik + stats.barangRusak + stats.barangHilang === stats.totalBarang,
    },
    {
      label: "Σ Aset per Komisi = Total",
      detail: `${distribution.byKomisi.reduce((s, k) => s + k.count, 0)} + ${distribution.tanpaKomisi} tanpa komisi = ${stats.totalBarang}`,
      ok:
        distribution.byKomisi.reduce((s, k) => s + k.count, 0) +
          distribution.tanpaKomisi ===
        stats.totalBarang,
    },
  ]
  const dataValid = checks.every((c) => c.ok)

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

  const komisiDenganAset = distribution.byKomisi.filter((k) => k.count > 0)

  const barChartData = {
    labels: komisiDenganAset.map((k) => k.namaKomisi),
    datasets: [
      {
        label: "Jumlah Aset",
        data: komisiDenganAset.map((k) => k.count),
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
    labels: distribution.byKondisi.map((k) => k.kondisi),
    datasets: [
      {
        data: distribution.byKondisi.map((k) => k.count),
        backgroundColor: distribution.byKondisi.map((k) => kondisiColorMap[k.kondisi] || "#6b6557"),
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

  const totalKondisi = distribution.byKondisi.reduce((sum, k) => sum + k.count, 0)

  return (
    <div>
      <PageHeader
        index="01"
        title="Dashboard"
        desc="Ringkasan data aset GKJW Probolinggo"
        extra={
          <span className="brut-sticker-help max-w-full">
            <Clock className="w-4 h-4 shrink-0" strokeWidth={3} />
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-6">
        <StatCard
          icon={Package}
          title="Total Aset"
          value={stats.totalBarang}
          sub={`${stats.barangAktif} aktif · ${stats.barangNonaktif} nonaktif`}
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
          sub={`${distribution.komisiDenganAset} komisi punya aset`}
          face="vibe"
        />
      </div>

      {/* Quick stats chips */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {quickStats.map((item) => {
          const Icon = item.icon
          const face =
            item.color === "good" ? "bg-good" :
            item.color === "danger" ? "bg-danger text-white" :
            item.color === "warn" ? "bg-warn" : "bg-vibe text-white"
          return (
            <div key={item.label} className={`brut-card p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 ${face} rotate-[0.5deg] transition-transform`}>
              <span className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 grid place-items-center border-[3px] border-ink bg-card text-ink -rotate-3">
                <Icon className="w-4.5 h-4.5 sm:w-5 h-5" strokeWidth={2.75} />
              </span>
              <div className="min-w-0">
                <p className="text-[0.58rem] sm:text-[0.62rem] font-bold uppercase tracking-widest opacity-70 leading-tight">
                  {item.label}
                </p>
                <p className="brut-num text-lg xs:text-xl sm:text-2xl leading-tight">{item.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Valuasi aset */}
      <Card
        className="mb-4 sm:mb-6" 
        icon={Wallet}
        title="Valuasi Aset"
        sub="Nilai perolehan, penyusutan, dan nilai buku seluruh inventaris"
        actions={
          <Link href="/valuasi" className="brut-btn brut-btn-sm brut-btn-primary">
            Buka Valuasi →
          </Link>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
          <div className="brut-card-pad !shadow-[3px_3px_0_0_var(--shadow)] !p-3.5 sm:!p-4 bg-primary text-white">
            <p className="text-[0.6rem] font-bold uppercase tracking-widest opacity-80">Nilai Perolehan</p>
            <p className="brut-num text-xl sm:text-2xl mt-1.5">{formatRupiahRingkas(valuasi.nilaiPerolehan)}</p>
          </div>
          <div className="brut-card-pad !shadow-[3px_3px_0_0_var(--shadow)] !p-3.5 sm:!p-4 bg-warn">
            <p className="text-[0.6rem] font-bold uppercase tracking-widest opacity-80">Akumulasi Penyusutan</p>
            <p className="brut-num text-xl sm:text-2xl mt-1.5">{formatRupiahRingkas(valuasi.akumulasiPenyusutan)}</p>
            <p className="text-[0.68rem] font-semibold mt-1 opacity-75">{valuasi.persenSusut.toFixed(1)}% tersusut</p>
          </div>
          <div className="brut-card-pad !shadow-[3px_3px_0_0_var(--shadow)] !p-3.5 sm:!p-4 bg-good">
            <p className="text-[0.6rem] font-bold uppercase tracking-widest opacity-80">Nilai Buku</p>
            <p className="brut-num text-xl sm:text-2xl mt-1.5">{formatRupiahRingkas(valuasi.nilaiBuku)}</p>
            <p className="text-[0.68rem] font-semibold mt-1 opacity-75">
              {valuasi.asetTersusut} habis · {valuasi.asetAktifDisusut} aktif disusut
            </p>
          </div>
        </div>
      </Card>

      {/* Data validation banner */}
      <Card
        className="mb-4 sm:mb-6"
        icon={dataValid ? CheckCircle : AlertTriangle}
        title="Verifikasi Data"
        sub="Seluruh angka dashboard lolos pemeriksaan konsistensi"
        actions={
          <span
            className={`brut-sticker-help !px-3 !py-1 ${
              dataValid ? "!bg-good" : "!bg-danger !text-white"
            }`}
          >
            {dataValid ? "Data 100% Valid" : "Ketidaksesuaian ditemukan"}
          </span>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {checks.map((c) => (
            <div
              key={c.label}
              className={`flex items-start gap-2.5 border-[3px] border-ink p-3 sm:p-3.5 ${
                c.ok ? "bg-good/15" : "bg-danger/15"
              }`}
            >
              {c.ok ? (
                <CheckCircle className="w-5 h-5 shrink-0 text-good" strokeWidth={3} />
              ) : (
                <XCircle className="w-5 h-5 shrink-0 text-danger" strokeWidth={3} />
              )}
              <div className="min-w-0">
                <p className="text-[0.7rem] font-bold uppercase tracking-wide">{c.label}</p>
                <p className="text-xs font-mono font-bold text-muted mt-0.5">{c.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6 mb-3 sm:mb-6">
        <Card
          title="Aset per Komisi"
          sub={`${komisiDenganAset.length} dari ${distribution.byKomisi.length} komisi punya aset${distribution.tanpaKomisi > 0 ? ` · ${distribution.tanpaKomisi} tanpa komisi` : ""}`}
          icon={Package}
          className="lg:col-span-2"
          actions={<span className="brut-sticker-help !px-3 !py-1 !text-[0.62rem]">{stats.totalBarang} Aset</span>}
        >
          <div className="h-72">
            <BarChart data={barChartData} options={chartOptions} empty={komisiDenganAset.length === 0} />
          </div>
        </Card>

        <Card title="Aset per Kondisi" sub="Status kondisi seluruh aset" icon={Activity}>
          <div className="h-64">
            <DoughnutChart data={doughnutChartData} options={doughnutOptions} empty={distribution.byKondisi.length === 0} />
          </div>
          <div className="mt-3 flex justify-center gap-3 flex-wrap">
            {distribution.byKondisi.map((k) => (
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
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
                    <span className="hidden lg:inline text-xs font-bold text-muted">{barang.komisi?.namaKomisi || "-"}</span>
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