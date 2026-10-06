"use client"

import { useState, useEffect, useCallback } from "react"
import { Users, BookOpen, RotateCcw } from "lucide-react"
import {
  PageHeader, BackLink, Badge, Card, StatCard, DataList,
  ListIndex, Pagination,
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
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <BackLink href="/reports" />
        <span className="text-[0.7rem] sm:text-sm font-bold text-muted uppercase tracking-wider">Laporan</span>
      </div>

      <PageHeader
        index="07"
        title="Laporan Peminjaman"
        desc="Riwayat peminjaman aset"
      />

      <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-5 mb-6 sm:mb-8">
        <StatCard icon={Users} title="Total Peminjaman" value={stats.total} face="primary" />
        <StatCard icon={BookOpen} title="Dipinjam" value={stats.dipinjam} face="warn" />
        <StatCard icon={RotateCcw} title="Dikembalikan" value={stats.dikembalikan} face="good" />
      </div>

      <Card noPad>
        <DataList<Peminjaman>
          rows={data}
          getKey={(p) => p.id}
          page={page}
          perPage={10}
          loading={loading}
          emptyIcon={Users}
          emptyText="Tidak ada data"
          columns={[
            {
              header: "No",
              render: (_p, i) => <ListIndex value={i + 1} />,
              className: "!w-12 font-bold text-muted",
              headClassName: "!w-12",
            },
            {
              header: "Barang",
              render: (p) => p.barang?.namaBarang || "-",
              slot: "title",
            },
            {
              header: "Peminjam",
              render: (p) => <span className="text-muted font-semibold">{p.peminjam || "-"}</span>,
            },
            {
              header: "Status",
              render: (p) => <Badge color={p.status === "Dipinjam" ? "yellow" : "green"}>{p.status}</Badge>,
              slot: "chip",
            },
            {
              header: "Jumlah",
              render: (p) => <span className="brut-num">{p.jumlahDipinjam}</span>,
              className: "!text-center",
              headClassName: "!text-center",
            },
            {
              header: "Tgl Pinjam",
              render: (p) => <span className="text-muted font-semibold">{formatDate(p.tanggalPinjam)}</span>,
            },
            {
              header: "Tgl Kembali",
              render: (p) => <span className="text-muted font-semibold">{formatDate(p.tanggalKembali)}</span>,
            },
          ]}
        />

        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </Card>
    </div>
  )
}
