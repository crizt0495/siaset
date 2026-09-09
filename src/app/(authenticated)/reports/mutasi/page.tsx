"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowRightLeft, Repeat } from "lucide-react"
import {
  PageHeader, BackLink, Card, Table, TH, TD, Tr,
  Pagination, EmptyState,
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
      <div className="flex items-center gap-3 mb-6">
        <BackLink href="/reports" />
        <span className="text-sm font-bold text-muted uppercase tracking-wider">Laporan</span>
      </div>

      <PageHeader
        index="07"
        title="Laporan Mutasi"
        desc="Perpindahan lokasi aset"
      />

      <Card noPad>
        <Table
          head={
            <tr>
              <TH className="!w-12">No</TH>
              <TH>Barang</TH>
              <TH>Lokasi Asal</TH>
              <TH className="!w-10"></TH>
              <TH>Lokasi Tujuan</TH>
              <TH>Tanggal</TH>
              <TH>Keterangan</TH>
            </tr>
          }
        >
          {loading ? (
            <Tr><TD colSpan={7} className="!py-10 text-center text-muted font-bold">Memuat data...</TD></Tr>
          ) : data.length === 0 ? (
            <Tr><TD colSpan={7} className="!p-0"><EmptyState icon={Repeat} text="Tidak ada data" /></TD></Tr>
          ) : data.map((m, i) => (
            <Tr key={m.id}>
              <TD className="font-bold text-muted">{(page - 1) * 10 + i + 1}</TD>
              <TD className="font-bold">{m.barang?.namaBarang || "-"}</TD>
              <TD className="text-muted font-semibold">{m.lokasiAsal}</TD>
              <TD><ArrowRightLeft className="w-4 h-4 text-primary" strokeWidth={3} /></TD>
              <TD className="font-bold">{m.lokasiTujuan}</TD>
              <TD className="text-muted font-semibold">{formatDate(m.tanggalMutasi)}</TD>
              <TD className="text-muted font-semibold">{m.keterangan || "-"}</TD>
            </Tr>
          ))}
        </Table>

        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </Card>
    </div>
  )
}