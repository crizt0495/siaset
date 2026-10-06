"use client"

import { useState, useEffect, useCallback } from "react"
import { Wrench } from "lucide-react"
import {
  PageHeader, BackLink, Card, StatCard, DataList, ListIndex, Pagination,
} from "@/components/ui"

interface Pemeliharaan {
  id: string; tanggal: string; biaya: number; keterangan: string
  barang?: { namaBarang: string; kodeBarang: string } | null
}

export default function LaporanPemeliharaan() {
  const [data, setData] = useState<Pemeliharaan[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [totalBiaya, setTotalBiaya] = useState(0)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "10" })
    const res = await fetch(`/api/pemeliharaan?${params}`)
    const json = await res.json()
    const items = json.data || []
    setData(items)
    setTotalPages(json.pagination?.totalPages || 1)
    setTotalBiaya(items.reduce((sum: number, p: Pemeliharaan) => sum + (p.biaya || 0), 0))
    setLoading(false)
  }, [page])

  useEffect(() => { fetchData() }, [fetchData])

  const formatDate = (d: string) => new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
  const formatRp = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)

  return (
    <div>
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <BackLink href="/reports" />
        <span className="text-[0.7rem] sm:text-sm font-bold text-muted uppercase tracking-wider">Laporan</span>
      </div>

      <PageHeader
        index="07"
        title="Laporan Pemeliharaan"
        desc="Riwayat perawatan aset"
      />

      <div className="grid grid-cols-1 gap-3 sm:gap-5 mb-6 sm:mb-8">
        <StatCard icon={Wrench} title="Total Biaya Pemeliharaan" value={formatRp(totalBiaya)} face="good" />
      </div>

      <Card noPad>
        <DataList<Pemeliharaan>
          rows={data}
          getKey={(p) => p.id}
          page={page}
          perPage={10}
          loading={loading}
          emptyIcon={Wrench}
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
              header: "Biaya",
              render: (p) => <span className="brut-num font-bold break-words">{formatRp(p.biaya)}</span>,
              slot: "subtitle",
            },
            {
              header: "Tanggal",
              render: (p) => <span className="text-muted font-semibold">{formatDate(p.tanggal)}</span>,
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
