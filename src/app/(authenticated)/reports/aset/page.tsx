"use client"

import { useState, useEffect, useCallback } from "react"
import { FileDown, Package } from "lucide-react"
import {
  PageHeader, BackLink, Badge, Card, StatCard, Select, DataList,
  ListIndex, Pagination, Button,
} from "@/components/ui"
import { formatRupiah, formatTanggal } from "@/lib/format"
import { exportCsv } from "@/lib/export"

interface Aset {
  id: string; kodeBarang: string; namaBarang: string; kondisi: string; status: string; lokasi: string; jumlah: number; hargaPerolehan: number
  spesifikasi?: string | null; tanggalPerolehan: string
  komisi?: { namaKomisi: string } | null
}
interface Komisi { id: string; namaKomisi: string }

const kondisiColor: Record<string, "green" | "red" | "yellow" | "default"> = {
  Baik: "green", Rusak: "red", Hilang: "yellow",
}
const statusColor: Record<string, "blue" | "yellow" | "default"> = {
  Aktif: "blue", Nonaktif: "yellow",
}

export default function LaporanAset() {
  const [data, setData] = useState<Aset[]>([])
  const [komisiList, setKomisiList] = useState<Komisi[]>([])
  const [filterKomisi, setFilterKomisi] = useState("")
  const [filterKondisi, setFilterKondisi] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, aktif: 0, nonaktif: 0, totalHarga: 0 })

  const fetchData = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "10" })
    if (filterKomisi) params.set("komisiId", filterKomisi)
    if (filterKondisi) params.set("kondisi", filterKondisi)
    if (filterStatus) params.set("status", filterStatus)
    const res = await fetch(`/api/barang?${params}`)
    const json = await res.json()
    const items = json.data || []
    setData(items)
    setTotalPages(json.pagination?.totalPages || 1)
    const sum = json.summary || {}
    setStats({
      total: sum.jumlahAset ?? items.length,
      aktif: sum.aktif ?? 0,
      nonaktif: sum.nonaktif ?? 0,
      totalHarga: sum.totalNilai ?? 0,
    })
    setLoading(false)
  }, [page, filterKomisi, filterKondisi, filterStatus])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => {
    fetch("/api/komisi").then(r => r.json()).then(j => setKomisiList(j.data || []))
  }, [])

  const handleExport = async () => {
    const params = new URLSearchParams({ page: "1", limit: "10000" })
    if (filterKomisi) params.set("komisiId", filterKomisi)
    if (filterKondisi) params.set("kondisi", filterKondisi)
    if (filterStatus) params.set("status", filterStatus)
    try {
      const res = await fetch(`/api/barang?${params}`)
      const json = await res.json()
      const items: Aset[] = json.data || []
      if (items.length === 0) return
      exportCsv(
        "laporan-aset",
        [
          "Kode", "Nama Barang", "Komisi", "Kondisi", "Status", "Lokasi",
          "Jumlah", "Tanggal Perolehan", "Harga Perolehan", "Total Nilai",
        ],
        items.map((a) => [
          a.kodeBarang, a.namaBarang, a.komisi?.namaKomisi || "-", a.kondisi, a.status, a.lokasi,
          a.jumlah, formatTanggal(a.tanggalPerolehan), a.hargaPerolehan, (a.hargaPerolehan || 0) * (a.jumlah || 1),
        ])
      )
    } catch {
      // abaikan error export
    }
  }

  const formatRp = formatRupiah

  return (
    <div>
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <BackLink href="/reports" />
        <span className="text-[0.7rem] sm:text-sm font-bold text-muted uppercase tracking-wider">Laporan</span>
      </div>

      <PageHeader
        index="07"
        title="Laporan Aset"
        desc="Data seluruh aset dan inventaris"
      >
        <Button onClick={handleExport} variant="good" className="w-full sm:w-auto">
          <FileDown className="w-4 h-4" strokeWidth={3} /> Export CSV
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
        <StatCard icon={Package} title="Total Aset" value={stats.total} face="primary" />
        <StatCard icon={Package} title="Aktif" value={stats.aktif} face="good" />
        <StatCard icon={Package} title="Nonaktif" value={stats.nonaktif} face="warn" />
        <StatCard icon={Package} title="Total Nilai" value={formatRp(stats.totalHarga)} face="vibe" />
      </div>

      <Card noPad>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 border-b-[3px] border-ink bg-paper2">
          <Select value={filterKomisi} onChange={e => { setFilterKomisi(e.target.value); setPage(1) }}>
            <option value="">Semua Komisi</option>
            {komisiList.map(k => <option key={k.id} value={k.id}>{k.namaKomisi}</option>)}
          </Select>
          <Select value={filterKondisi} onChange={e => { setFilterKondisi(e.target.value); setPage(1) }}>
            <option value="">Semua Kondisi</option>
            <option value="Baik">Baik</option><option value="Rusak">Rusak</option><option value="Hilang">Hilang</option>
          </Select>
          <Select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }}>
            <option value="">Semua Status</option>
            <option value="Aktif">Aktif</option><option value="Nonaktif">Nonaktif</option>
          </Select>
        </div>

        <DataList<Aset>
          rows={data}
          getKey={(a) => a.id}
          page={page}
          perPage={10}
          loading={loading}
          emptyIcon={Package}
          emptyText="Tidak ada data"
          columns={[
            {
              header: "No",
              render: (_a, i) => <ListIndex value={i + 1} />,
              className: "!w-12 font-bold text-muted",
              headClassName: "!w-12",
            },
            {
              header: "Nama",
              render: (a) => a.namaBarang,
              slot: "title",
            },
            {
              header: "Kode",
              render: (a) => <span className="font-mono text-xs font-bold">{a.kodeBarang}</span>,
              slot: "subtitle",
            },
            {
              header: "Kondisi",
              render: (a) => <Badge color={kondisiColor[a.kondisi] || "default"}>{a.kondisi}</Badge>,
              slot: "chip",
            },
            {
              header: "Status",
              render: (a) => <Badge color={statusColor[a.status] || "default"}>{a.status}</Badge>,
              slot: "chip",
            },
            {
              header: "Komisi",
              render: (a) => <span className="text-muted font-semibold">{a.komisi?.namaKomisi || "-"}</span>,
            },
            {
              header: "Lokasi",
              render: (a) => <span className="text-muted font-semibold">{a.lokasi}</span>,
            },
            {
              header: "Harga",
              render: (a) => <span className="brut-num break-words">{formatRp(a.hargaPerolehan)}</span>,
              className: "!text-right",
              headClassName: "!text-right",
            },
            {
              header: "Jumlah",
              render: (a) => <span className="brut-num">{a.jumlah}</span>,
              className: "!text-center",
              headClassName: "!text-center",
            },
          ]}
        />

        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </Card>
    </div>
  )
}
