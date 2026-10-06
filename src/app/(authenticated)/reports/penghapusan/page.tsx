"use client"

import { useState, useEffect, useCallback } from "react"
import { Trash2 } from "lucide-react"
import {
  PageHeader, BackLink, Card, DataList, ListIndex, Pagination, LoadingState,
} from "@/components/ui"

interface Penghapusan {
  id: string; tanggalPenghapusan: string; alasan: string; keterangan: string
  barang?: { namaBarang: string; kodeBarang: string } | null
}

export default function LaporanPenghapusan() {
  const [data, setData] = useState<Penghapusan[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "10" })
    const res = await fetch(`/api/penghapusan?${params}`)
    const json = await res.json()
    setData(json.data || [])
    setTotalPages(json.pagination?.totalPages || 1)
    setLoading(false)
  }, [page])

  useEffect(() => { fetchData() }, [fetchData])

  const formatDate = (d: string) => new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })

  if (loading && data.length === 0) return <LoadingState text="Memuat data penghapusan..." />

  return (
    <div>
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <BackLink href="/reports" />
        <span className="text-[0.7rem] sm:text-sm font-bold text-muted uppercase tracking-wider">Laporan</span>
      </div>

      <PageHeader
        index="07"
        title="Laporan Penghapusan"
        desc="Aset yang telah dihapus"
      />

      <Card noPad>
        <DataList<Penghapusan>
          rows={data}
          getKey={(p) => p.id}
          page={page}
          perPage={10}
          loading={loading}
          emptyIcon={Trash2}
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
              header: "Tanggal",
              render: (p) => <span className="text-muted font-semibold">{formatDate(p.tanggalPenghapusan)}</span>,
            },
            {
              header: "Alasan",
              render: (p) => <span className="text-muted font-semibold break-words">{p.alasan}</span>,
            },
            {
              header: "Keterangan",
              render: (p) => <span className="text-muted font-semibold break-words">{p.keterangan || "-"}</span>,
            },
          ]}
        />

        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </Card>
    </div>
  )
}
