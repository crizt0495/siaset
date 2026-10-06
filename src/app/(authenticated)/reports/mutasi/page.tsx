"use client"

import { useState, useEffect, useCallback } from "react"
import { Repeat } from "lucide-react"
import {
  PageHeader, BackLink, Card, DataList, ListIndex, Pagination,
} from "@/components/ui"

interface Mutasi {
  id: string; tanggalMutasi: string; keterangan: string; lokasiAsal: string; lokasiTujuan: string
  barang?: { namaBarang: string; kodeBarang: string } | null
}

export default function LaporanMutasi() {
  const [data, setData] = useState<Mutasi[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "10" })
    const res = await fetch(`/api/mutasi?${params}`)
    const json = await res.json()
    setData(json.data || [])
    setTotalPages(json.pagination?.totalPages || 1)
    setLoading(false)
  }, [page])

  useEffect(() => { fetchData() }, [fetchData])

  const formatDate = (d: string) => new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })

  return (
    <div>
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <BackLink href="/reports" />
        <span className="text-[0.7rem] sm:text-sm font-bold text-muted uppercase tracking-wider">Laporan</span>
      </div>

      <PageHeader
        index="07"
        title="Laporan Mutasi"
        desc="Perpindahan lokasi aset"
      />

      <Card noPad>
        <DataList<Mutasi>
          rows={data}
          getKey={(m) => m.id}
          page={page}
          perPage={10}
          loading={loading}
          emptyIcon={Repeat}
          emptyText="Tidak ada data"
          columns={[
            {
              header: "No",
              render: (_m, i) => <ListIndex value={i + 1} />,
              className: "!w-12 font-bold text-muted",
              headClassName: "!w-12",
            },
            {
              header: "Barang",
              render: (m) => m.barang?.namaBarang || "-",
              slot: "title",
            },
            {
              header: "Lokasi Asal",
              render: (m) => <span className="text-muted font-semibold">{m.lokasiAsal}</span>,
            },
            {
              header: "Lokasi Tujuan",
              render: (m) => <span className="font-bold">{m.lokasiTujuan}</span>,
            },
            {
              header: "Tanggal",
              render: (m) => <span className="text-muted font-semibold">{formatDate(m.tanggalMutasi)}</span>,
            },
            {
              header: "Keterangan",
              render: (m) => <span className="text-muted font-semibold break-words">{m.keterangan || "-"}</span>,
            },
          ]}
        />

        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </Card>
    </div>
  )
}
