"use client"

import { useState, useEffect, useCallback } from "react"
import { Wrench } from "lucide-react"
import {
  PageHeader, BackLink, Card, StatCard, Table, TH, TD, Tr,
  Pagination, EmptyState,
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
      <div className="flex items-center gap-3 mb-6">
        <BackLink href="/reports" />
        <span className="text-sm font-bold text-muted uppercase tracking-wider">Laporan</span>
      </div>

      <PageHeader
        index="07"
        title="Laporan Pemeliharaan"
        desc="Riwayat perawatan aset"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard icon={Wrench} title="Total Biaya Pemeliharaan" value={formatRp(totalBiaya)} face="good" />
      </div>

      <Card noPad>
        <Table
          head={
            <tr>
              <TH className="!w-12">No</TH>
              <TH>Barang</TH>
              <TH>Tanggal</TH>
              <TH className="!text-right">Biaya</TH>
              <TH>Keterangan</TH>
            </tr>
          }
        >
          {loading ? (
            <Tr><TD colSpan={5} className="!py-10 text-center text-muted font-bold">Memuat data...</TD></Tr>
          ) : data.length === 0 ? (
            <Tr><TD colSpan={5} className="!p-0"><EmptyState icon={Wrench} text="Tidak ada data" /></TD></Tr>
          ) : data.map((p, i) => (
            <Tr key={p.id}>
              <TD className="font-bold text-muted">{(page - 1) * 10 + i + 1}</TD>
              <TD className="font-bold">{p.barang?.namaBarang || "-"}</TD>
              <TD className="text-muted font-semibold">{formatDate(p.tanggal)}</TD>
              <TD className="!text-right brut-num">{formatRp(p.biaya)}</TD>
              <TD className="text-muted font-semibold">{p.keterangan || "-"}</TD>
            </Tr>
          ))}
        </Table>

        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </Card>
    </div>
  )
}