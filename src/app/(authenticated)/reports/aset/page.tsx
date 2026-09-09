"use client"

import { useState, useEffect, useCallback } from "react"
import { FileDown, Package } from "lucide-react"
import {
  PageHeader, BackLink, Badge, Card, StatCard, Select, Table,
  TH, TD, Tr, Pagination, EmptyState, Button,
} from "@/components/ui"

interface Aset {
  id: string; kodeBarang: string; namaBarang: string; kondisi: string; status: string; lokasi: string; jumlah: number; hargaPerolehan: number
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
    setStats({
      total: json.pagination?.total || items.length,
      aktif: items.filter((a: Aset) => a.status === "Aktif").length,
      nonaktif: items.filter((a: Aset) => a.status === "Nonaktif").length,
      totalHarga: items.reduce((sum: number, a: Aset) => sum + (a.hargaPerolehan || 0) * (a.jumlah || 0), 0),
    })
    setLoading(false)
  }, [page, filterKomisi, filterKondisi, filterStatus])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => {
    fetch("/api/komisi").then(r => r.json()).then(j => setKomisiList(j.data || []))
  }, [])

  const formatRp = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <BackLink href="/reports" />
        <span className="text-sm font-bold text-muted uppercase tracking-wider">Laporan</span>
      </div>

      <PageHeader
        index="07"
        title="Laporan Aset"
        desc="Data seluruh aset dan inventaris"
      >
        <Button onClick={() => alert("Coming soon")} variant="good">
          <FileDown className="w-4 h-4" strokeWidth={3} /> Export
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon={Package} title="Total Aset" value={stats.total} face="primary" />
        <StatCard icon={Package} title="Aktif" value={stats.aktif} face="good" />
        <StatCard icon={Package} title="Nonaktif" value={stats.nonaktif} face="warn" />
        <StatCard icon={Package} title="Total Nilai" value={formatRp(stats.totalHarga)} face="vibe" />
      </div>

      <Card noPad>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 border-b-[3px] border-ink bg-paper2">
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

        <Table
          head={
            <tr>
              <TH className="!w-12">No</TH>
              <TH>Kode</TH>
              <TH>Nama</TH>
              <TH>Komisi</TH>
              <TH>Kondisi</TH>
              <TH>Status</TH>
              <TH>Lokasi</TH>
              <TH className="!text-right">Harga</TH>
              <TH className="!text-center">Jumlah</TH>
            </tr>
          }
        >
          {loading ? (
            <Tr><TD colSpan={9} className="!py-10 text-center text-muted font-bold">Memuat data...</TD></Tr>
          ) : data.length === 0 ? (
            <Tr><TD colSpan={9} className="!p-0"><EmptyState icon={Package} text="Tidak ada data" /></TD></Tr>
          ) : data.map((a, i) => (
            <Tr key={a.id}>
              <TD className="font-bold text-muted">{(page - 1) * 10 + i + 1}</TD>
              <TD className="font-mono text-xs font-bold">{a.kodeBarang}</TD>
              <TD className="font-bold">{a.namaBarang}</TD>
              <TD className="text-muted font-semibold">{a.komisi?.namaKomisi || "-"}</TD>
              <TD><Badge color={kondisiColor[a.kondisi] || "default"}>{a.kondisi}</Badge></TD>
              <TD><Badge color={statusColor[a.status] || "default"}>{a.status}</Badge></TD>
              <TD className="text-muted font-semibold">{a.lokasi}</TD>
              <TD className="!text-right brut-num">{formatRp(a.hargaPerolehan)}</TD>
              <TD className="!text-center brut-num">{a.jumlah}</TD>
            </Tr>
          ))}
        </Table>

        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </Card>
    </div>
  )
}