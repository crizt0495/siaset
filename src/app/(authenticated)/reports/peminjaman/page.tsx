"use client"

import { useState, useEffect, useCallback } from "react"
import { Users, BookOpen, RotateCcw } from "lucide-react"
import {
  PageHeader, BackLink, Badge, Card, StatCard, Table,
  TH, TD, Tr, Pagination, EmptyState,
} from "@/components/ui"

interface Peminjaman {
  id: string; jumlahDipinjam: number; tanggalPinjam: string; tanggalKembali: string | null; status: string; keterangan: string; peminjam: string
  barang?: { namaBarang: string; kodeBarang: string } | null
}

export default function LaporanPeminjaman() {
  const [data, setData] = useState<Peminjaman[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, dipinjam: 0, dikembalikan: 0 })

  const fetchData = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "10" })
    const res = await fetch(`/api/peminjaman?${params}`)
    const json = await res.json()
    const items = json.data || []
    setData(items)
    setTotalPages(json.pagination?.totalPages || 1)
    setStats({
      total: json.total || items.length,
      dipinjam: items.filter((p: Peminjaman) => p.status === "Dipinjam").length,
      dikembalikan: items.filter((p: Peminjaman) => p.status === "Dikembalikan").length,
    })
    setLoading(false)
  }, [page])

  useEffect(() => { fetchData() }, [fetchData])

  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-"

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <BackLink href="/reports" />
        <span className="text-sm font-bold text-muted uppercase tracking-wider">Laporan</span>
      </div>

      <PageHeader
        index="07"
        title="Laporan Peminjaman"
        desc="Riwayat peminjaman aset"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard icon={Users} title="Total Peminjaman" value={stats.total} face="primary" />
        <StatCard icon={BookOpen} title="Dipinjam" value={stats.dipinjam} face="warn" />
        <StatCard icon={RotateCcw} title="Dikembalikan" value={stats.dikembalikan} face="good" />
      </div>

      <Card noPad>
        <Table
          head={
            <tr>
              <TH className="!w-12">No</TH>
              <TH>Barang</TH>
              <TH>Peminjam</TH>
              <TH className="!text-center">Jumlah</TH>
              <TH>Tgl Pinjam</TH>
              <TH>Tgl Kembali</TH>
              <TH>Status</TH>
            </tr>
          }
        >
          {loading ? (
            <Tr><TD colSpan={7} className="!py-10 text-center text-muted font-bold">Memuat data...</TD></Tr>
          ) : data.length === 0 ? (
            <Tr><TD colSpan={7} className="!p-0"><EmptyState icon={Users} text="Tidak ada data" /></TD></Tr>
          ) : data.map((p, i) => (
            <Tr key={p.id}>
              <TD className="font-bold text-muted">{(page - 1) * 10 + i + 1}</TD>
              <TD className="font-bold">{p.barang?.namaBarang || "-"}</TD>
              <TD className="text-muted font-semibold">{p.peminjam || "-"}</TD>
              <TD className="!text-center brut-num">{p.jumlahDipinjam}</TD>
              <TD className="text-muted font-semibold">{formatDate(p.tanggalPinjam)}</TD>
              <TD className="text-muted font-semibold">{formatDate(p.tanggalKembali)}</TD>
              <TD><Badge color={p.status === "Dipinjam" ? "yellow" : "green"}>{p.status}</Badge></TD>
            </Tr>
          ))}
        </Table>

        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </Card>
    </div>
  )
}