"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Eye, Pencil, Trash2, Wrench } from "lucide-react"
import {
  PageHeader, AddButton, Card, Table, TH, TD, Tr, Pagination,
  ConfirmModal, Input, EmptyState, Label,
} from "@/components/ui"

interface Pemeliharaan {
  id: string; tanggal: string; biaya: number; keterangan: string
  barang?: { id: string; namaBarang: string; kodeBarang: string } | null
  user?: { namaLengkap: string } | null
}

export default function PemeliharaanList() {
  const [data, setData] = useState<Pemeliharaan[]>([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "10" })
    if (search) params.set("search", search)
    const res = await fetch(`/api/pemeliharaan?${params}`)
    const json = await res.json()
    setData(json.data || [])
    setTotalPages(json.pagination?.totalPages || 1)
    setLoading(false)
  }, [page, search])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDelete = async () => {
    if (!deleteId) return
    await fetch(`/api/pemeliharaan/${deleteId}`, { method: "DELETE" })
    setDeleteId(null)
    fetchData()
  }

  const formatRupiah = (v: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(v)

  return (
    <div>
      <PageHeader
        index="06"
        title="Pemeliharaan"
        desc="Tracking biaya perawatan aset"
        extra={<Label color="good">06 · Manajemen Lainnya</Label>}
      >
        <AddButton href="/pemeliharaan/create">Tambah Pemeliharaan</AddButton>
      </PageHeader>

      <Card noPad>
        <div className="p-4 border-b-[3px] border-ink bg-paper2">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" strokeWidth={3} />
            <Input type="text" placeholder="Cari pemeliharaan..." value={search} className="!pl-10" onChange={e => { setSearch(e.target.value); setPage(1) }} />
          </div>
        </div>

        <Table
          head={
            <tr>
              <TH className="!w-12">No</TH>
              <TH>Barang</TH>
              <TH>Tanggal</TH>
              <TH>Biaya</TH>
              <TH>Petugas</TH>
              <TH>Keterangan</TH>
              <TH className="!text-right">Aksi</TH>
            </tr>
          }
        >
          {loading ? (
            <Tr><TD colSpan={7} className="!py-10 text-center text-muted font-bold">Memuat data...</TD></Tr>
          ) : data.length === 0 ? (
            <Tr><TD colSpan={7} className="!p-0"><EmptyState icon={Wrench} text="Tidak ada data pemeliharaan" /></TD></Tr>
          ) : data.map((p, i) => (
            <Tr key={p.id}>
              <TD className="font-bold text-muted">{(page - 1) * 10 + i + 1}</TD>
              <TD>
                <div className="font-bold">{p.barang?.namaBarang || "-"}</div>
                <div className="font-mono text-xs text-muted">{p.barang?.kodeBarang || ""}</div>
              </TD>
              <TD className="text-muted font-semibold">{new Date(p.tanggal).toLocaleDateString("id-ID")}</TD>
              <TD className="font-bold">{formatRupiah(Number(p.biaya))}</TD>
              <TD className="text-muted font-semibold">{p.user?.namaLengkap || "-"}</TD>
              <TD className="text-muted font-semibold truncate max-w-[200px]">{p.keterangan || "-"}</TD>
              <TD>
                <div className="flex items-center justify-end gap-1.5">
                  <Link href={`/pemeliharaan/${p.id}`} className="brut-iconbtn brut-iconbtn-primary" title="Detail"><Eye className="w-4 h-4" strokeWidth={2.75} /></Link>
                  <Link href={`/pemeliharaan/${p.id}/edit`} className="brut-iconbtn brut-iconbtn-warn" title="Edit"><Pencil className="w-4 h-4" strokeWidth={2.75} /></Link>
                  <button onClick={() => setDeleteId(p.id)} className="brut-iconbtn brut-iconbtn-danger" title="Hapus"><Trash2 className="w-4 h-4" strokeWidth={2.75} /></button>
                </div>
              </TD>
            </Tr>
          ))}
        </Table>

        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </Card>

      <ConfirmModal
        open={!!deleteId}
        title="Hapus Pemeliharaan?"
        message="Data yang dihapus tidak dapat dikembalikan."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}