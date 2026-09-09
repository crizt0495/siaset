"use client"

import { useState, useEffect, useCallback } from "react"
import { Trash2 } from "lucide-react"
import {
  PageHeader, BackLink, Card, Table, TH, TD, Tr,
  Pagination, EmptyState, LoadingState,
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
      <div className="flex items-center gap-3 mb-6">
        <BackLink href="/reports" />
        <span className="text-sm font-bold text-muted uppercase tracking-wider">Laporan</span>
      </div>

      <PageHeader
        index="07"
        title="Laporan Penghapusan"
        desc="Aset yang telah dihapus"
      />

      <Card noPad>
        <Table
          head={
            <tr>
              <TH className="!w-12">No</TH>
              <TH>Barang</TH>
              <TH>Tanggal</TH>
              <TH>Alasan</TH>
              <TH>Keterangan</TH>
            </tr>
          }
        >
          {loading ? (
            <Tr><TD colSpan={5} className="!py-10 text-center text-muted font-bold">Memuat data...</TD></Tr>
          ) : data.length === 0 ? (
            <Tr><TD colSpan={5} className="!p-0"><EmptyState icon={Trash2} text="Tidak ada data" /></TD></Tr>
          ) : data.map((p, i) => (
            <Tr key={p.id}>
              <TD className="font-bold text-muted">{(page - 1) * 10 + i + 1}</TD>
              <TD className="font-bold">{p.barang?.namaBarang || "-"}</TD>
              <TD className="text-muted font-semibold">{formatDate(p.tanggalPenghapusan)}</TD>
              <TD className="text-muted font-semibold">{p.alasan}</TD>
              <TD className="text-muted font-semibold">{p.keterangan || "-"}</TD>
            </Tr>
          ))}
        </Table>

        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </Card>
    </div>
  )
}