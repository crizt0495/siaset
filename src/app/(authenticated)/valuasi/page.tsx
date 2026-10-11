"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Wallet, Coins, TrendingDown, TrendingUp, Package, Search,
  FileDown, Printer, Filter, Landmark, PiggyBank, AlertTriangle,
} from "lucide-react"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import dynamic from "next/dynamic"

const Bar = dynamic(() => import("react-chartjs-2").then(m => ({ default: m.Bar })), { ssr: false })
import {
  PageHeader, StatCard, Card, Label, Input, Select, Button, DataList,
  ListIndex, LoadingState, ErrorState, EmptyState, Badge,
} from "@/components/ui"
import { formatRupiah, formatRupiahRingkas, formatTanggal, formatMasaManfaat, formatAngka } from "@/lib/format"
import { exportCsv } from "@/lib/export"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

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
  penyusutanPerBulan: number
  penyusutanPerTahun: number
  akumulasiPenyusutan: number
  akumulasiPenyusutanTotal: number
  nilaiBuku: number
  nilaiBukuTotal: number
  persenSusut: number
  selesai: boolean
}

interface ValuasiData {
  asOf: string
  summary: {
    jumlahAset: number
    jumlahUnit: number
    nilaiPerolehan: number
    akumulasiPenyusutan: number
    nilaiBuku: number
    persenSusut: number
    asetTersusut: number
    asetAktifDisusut: number
  }
  perKomisi: {
    id: string
    namaKomisi: string
    jumlahAset: number
    jumlahUnit: number
    nilaiPerolehan: number
    akumulasi: number
    nilaiBuku: number
  }[]
  perKondisi: { kondisi: string; jumlahAset: number; nilaiPerolehan: number; nilaiBuku: number }[]
  items: ValuasiItem[]
}

interface KomisiOption { id: string; namaKomisi: string }

const metodeLabel: Record<string, string> = {
  GarisLurus: "Garis Lurus",
  SaldoMenurunGanda: "Saldo Menurun",
}

const kondisiColor: Record<string, "green" | "red" | "yellow" | "default"> = {
  Baik: "green", Rusak: "red", Hilang: "yellow",
}

function ProgressBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className="flex items-center gap-2 min-w-[110px]">
      <div className="h-3.5 flex-1 border-2 border-ink bg-paper2 overflow-hidden">
        <div
          className={`h-full ${pct >= 100 ? "bg-danger" : pct >= 60 ? "bg-warn" : "bg-good"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="brut-num text-xs shrink-0 w-9 text-right">{pct.toFixed(0)}%</span>
    </div>
  )
}


// Lazy chart wrapper
function BarChart({ data, options, empty }: { data: any; options: any; empty: boolean }) {
  const [Comp, setComp] = useState<any>(null)
  useEffect(() => {
    import("react-chartjs-2").then(m => setComp(() => m.Bar))
  }, [])
  if (empty) return <div className="h-full flex items-center justify-center text-muted font-bold">Tidak ada data</div>
  if (!Comp) return <div className="h-full flex items-center justify-center text-muted font-bold">Memuat grafik...</div>
  return <Comp data={data} options={options} />
}

export default function ValuasiPage() {
  const [data, setData] = useState<ValuasiData | null>(null)
  const [komisiList, setKomisiList] = useState<KomisiOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filterKomisi, setFilterKomisi] = useState("")
  const [filterKondisi, setFilterKondisi] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [search, setSearch] = useState("")
  const [asOf, setAsOf] = useState("")

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filterKomisi) params.set("komisiId", filterKomisi)
      if (filterKondisi) params.set("kondisi", filterKondisi)
      if (filterStatus) params.set("status", filterStatus)
      if (search) params.set("search", search)
      if (asOf) params.set("asOf", asOf)
      const res = await fetch(`/api/valuasi?${params.toString()}`)
      if (!res.ok) throw new Error("Gagal memuat data valuasi")
      setData(await res.json())
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }, [filterKomisi, filterKondisi, filterStatus, search, asOf])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => {
    fetch("/api/komisi").then((r) => r.json()).then((j) => setKomisiList(j.data || [])).catch(() => {})
  }, [])

  const handleExport = () => {
    if (!data) return
    exportCsv(
      "valuasi-aset",
      [
        "Kode", "Nama Barang", "Komisi", "Kondisi", "Status", "Jumlah Unit",
        "Tanggal Perolehan", "Harga Perolehan/Unit", "Nilai Residu/Unit",
        "Masa Manfaat (bln)", "Metode Penyusutan", "Umur (bln)", "Umur", 
        "Penyusutan/Bulan", "Penyusutan/Tahun", "Akumulasi Penyusutan",
        "Nilai Buku/Unit", "Total Nilai Buku", "% Tersusut",
      ],
      data.items.map((it) => [
        it.kodeBarang, it.namaBarang, it.namaKomisi || "-", it.kondisi, it.status, it.jumlahUnit,
        formatTanggal(it.tanggalPerolehan), it.nilaiPerolehan, it.nilaiResidu,
        it.masaManfaat, metodeLabel[it.metodePenyusutan] || it.metodePenyusutan, it.umurBulan, formatMasaManfaat(it.umurBulan),
        Math.round(it.penyusutanPerBulan), Math.round(it.penyusutanPerTahun), Math.round(it.akumulasiPenyusutan),
        Math.round(it.nilaiBuku), Math.round(it.nilaiBukuTotal), it.persenSusut.toFixed(1) + "%",
      ])
    )
  }

  if (loading && !data) return <LoadingState text="Menghitung valuasi aset..." />
  if (error && !data) return <ErrorState message={error} onRetry={() => fetchData()} />
  if (!data) return null

  const { summary, perKomisi, items } = data

  const chartData = {
    labels: perKomisi.map((k) => k.namaKomisi),
    datasets: [
      {
        label: "Nilai Buku",
        data: perKomisi.map((k) => k.nilaiBuku),
        backgroundColor: "#2b59ff",
        borderColor: "#16161a",
        borderWidth: 3,
        maxBarThickness: 48,
      },
      {
        label: "Sudah Disusut",
        data: perKomisi.map((k) => k.akumulasi),
        backgroundColor: "#ffc829",
        borderColor: "#16161a",
        borderWidth: 3,
        maxBarThickness: 48,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "bottom" as const, labels: { font: { size: 12, weight: 700 as const }, usePointStyle: true, pointStyle: "rect" as const } },
      tooltip: {
        backgroundColor: "#16161a",
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (ctx: { dataset: { label?: string }; raw: unknown }) =>
            ` ${ctx.dataset.label}: ${formatRupiah(Number(ctx.raw))}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 11, weight: 700 as const },
          color: "#6b6557",
          callback: (v: string | number) => formatRupiahRingkas(Number(v)),
        },
        grid: { color: "rgba(107,101,87,0.18)" },
        border: { color: "#16161a", width: 3 },
      },
      x: {
        ticks: { font: { size: 11, weight: 600 as const }, color: "#6b6557", maxRotation: 45 },
        grid: { display: false },
        border: { color: "#16161a", width: 3 },
      },
    },
  }

  return (
    <div className="space-y-5 sm:space-y-7">
      <PageHeader
        index="11"
        title="Valuasi Aset"
        desc="Nilai perolehan, penyusutan, dan nilai buku seluruh inventaris"
        extra={
          <span className="brut-sticker-help max-w-full">
            <Wallet className="w-4 h-4 shrink-0" strokeWidth={3} />
            Per {formatTanggal(data.asOf, { day: "2-digit", month: "long", year: "numeric" })}
          </span>
        }
      >
        <Button onClick={handleExport} variant="good" className="w-full sm:w-auto" disabled={items.length === 0}>
          <FileDown className="w-4 h-4" strokeWidth={3} /> Export CSV
        </Button>
        <Button onClick={() => window.print()} variant="dark" className="w-full sm:w-auto no-print">
          <Printer className="w-4 h-4" strokeWidth={3} /> Cetak
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <StatCard
          icon={Coins}
          title="Nilai Perolehan"
          value={formatRupiahRingkas(summary.nilaiPerolehan)}
          sub={`${formatAngka(summary.jumlahUnit)} unit · ${summary.jumlahAset} aset`}
          face="primary"
        />
        <StatCard
          icon={TrendingDown}
          title="Akumulasi Penyusutan"
          value={formatRupiahRingkas(summary.akumulasiPenyusutan)}
          sub={`${summary.persenSusut.toFixed(1)}% dari nilai disusut`}
          face="warn"
        />
        <StatCard
          icon={PiggyBank}
          title="Nilai Buku"
          value={formatRupiahRingkas(summary.nilaiBuku)}
          sub="nilai bersih saat ini"
          face="good"
        />
        <StatCard
          icon={AlertTriangle}
          title="Aset Tersusut"
          value={summary.asetTersusut}
          sub={`${summary.asetAktifDisusut} masih disusut`}
          face="vibe"
        />
      </div>

      <Card title="Filter Valuasi" sub="Persempit data & atur tanggal perhitungan" icon={Filter}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="lg:col-span-2">
            <Label>Cari Aset</Label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" strokeWidth={3} />
              <Input type="text" placeholder="Nama / kode barang..." value={search} className="!pl-10" onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Komisi</Label>
            <Select value={filterKomisi} onChange={(e) => setFilterKomisi(e.target.value)} className="mt-2">
              <option value="">Semua Komisi</option>
              {komisiList.map((k) => <option key={k.id} value={k.id}>{k.namaKomisi}</option>)}
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
            <Label>Per Tanggal</Label>
            <Input type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} className="mt-2" />
          </div>
        </div>
      </Card>

      <Card
        title="Nilai Buku per Komisi"
        sub="Perbandingan nilai buku dan akumulasi penyusutan"
        icon={Landmark}
        actions={<Label color="blue">{perKomisi.length} Komisi</Label>}
      >
        <div className="h-72 sm:h-80">
          {perKomisi.length > 0 ? (
            <BarChart data={chartData} options={chartOptions} empty={false} />
          ) : (
            <EmptyState text="Belum ada data valuasi" icon={Wallet} />
          )}
        </div>
      </Card>

      <Card
        noPad
        title="Rincian Penyusutan per Aset"
        sub={`${items.length} aset ditampilkan`}
        icon={Package}
        actions={<Label color="yellow">{formatRupiahRingkas(summary.nilaiBuku)}</Label>}
      >
        <DataList<ValuasiItem>
          rows={items}
          getKey={(it) => it.id}
          loading={loading}
          emptyIcon={Wallet}
          emptyText="Tidak ada aset pada filter ini"
          columns={[
            { header: "No", render: (_it, i) => <ListIndex value={i + 1} />, className: "!w-12", headClassName: "!w-12" },
            { header: "Aset", render: (it) => it.namaBarang, slot: "title" },
            { header: "Kode", render: (it) => <span className="font-mono text-xs font-bold">{it.kodeBarang}</span>, slot: "subtitle" },
            { header: "Kondisi", render: (it) => <Badge color={kondisiColor[it.kondisi] || "default"}>{it.kondisi}</Badge>, slot: "chip" },
            { header: "Metode", render: (it) => <Badge color="purple">{metodeLabel[it.metodePenyusutan] || it.metodePenyusutan}</Badge>, slot: "chip" },
            { header: "Komisi", render: (it) => <span className="text-muted font-semibold">{it.namaKomisi || "-"}</span> },
            { header: "Umur", render: (it) => <span title={`${it.umurBulan} bulan`}>{formatMasaManfaat(it.umurBulan)} / {formatMasaManfaat(it.masaManfaat)}</span> },
            { header: "Perolehan", render: (it) => <span className="brut-num">{formatRupiah(it.nilaiPerolehanTotal)}</span>, className: "!text-right", headClassName: "!text-right" },
            { header: "Penyusutan/Thn", render: (it) => <span className="brut-num text-danger">{formatRupiah(it.penyusutanPerTahun * it.jumlahUnit)}</span>, className: "!text-right", headClassName: "!text-right" },
            { header: "Akumulasi", render: (it) => <span className="brut-num">{formatRupiah(it.akumulasiPenyusutanTotal)}</span>, className: "!text-right", headClassName: "!text-right" },
            { header: "Nilai Buku", render: (it) => <span className="brut-num text-good">{formatRupiah(it.nilaiBukuTotal)}</span>, className: "!text-right", headClassName: "!text-right" },
            { header: "% Tersusut", render: (it) => <ProgressBar value={it.persenSusut} />, className: "!w-40", headClassName: "!w-40" },
          ]}
        />
      </Card>

      <div className="flex justify-end">
        <Label icon={TrendingUp}>GKJW Jemaat Probolinggo</Label>
      </div>
    </div>
  )
}
