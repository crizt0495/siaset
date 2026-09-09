"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Eye, Pencil, Trash2, ArrowRight, Repeat } from "lucide-react"
import {
  PageHeader, AddButton, Card, Table, TH, TD, Tr, Pagination,
  ConfirmModal, Input, EmptyState, Label,
} from "@/components/ui"

interface Mutasi {
  id: string
  barangId: string
  lokasiAsal: string
  lokasiTujuan: string
  tanggalMutasi: string
  keterangan: string | null
  barang: { namaBarang: string; kodeBarang: string }
}

export default function MutasiList() {
  const [data, setData] = useState<Mutasi[]>([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "10" })
    if (search) params.set("search", search)
    try {
      const res = await fetch(`/api/mutasi?${params}`)
      const json = await res.json()
      setData(json.data || [])
      setTotalPages(json.pagination?.totalPages || 1)
    } catch (error) {
      console.error("Failed to fetch mutasi:", error)
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await fetch(`/api/mutasi/${deleteId}`, { method: "DELETE" })
      setDeleteId(null)
      fetchData()
    } catch (error) {
      console.error("Failed to delete mutasi:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric", month: "long", day: "numeric",
    })
  }

  return (
    <div>
      <PageHeader
        index="04"
        title="Mutasi Barang"
        desc="Perpindahan lokasi aset antar komisi"
        extra={<Label color="blue">04 · Manajemen Aset</Label>}
      >
        <AddButton href="/mutasi/create">Tambah Mutasi</AddButton>
      </PageHeader>

      <Card noPad>
        <div className="p-4 border-b-[3px] border-ink bg-paper2">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" strokeWidth={3} />
            <Input type="text" placeholder="Cari barang atau lokasi..." value={search} className="!pl-10" onChange={e => { setSearch(e.target.value); setPage(1) }} />
          </div>
        </div>

        <Table
          head={
            <tr>
              <TH className="!w-12">No</TH>
              <TH>Barang</TH>
              <TH>Pergerakan Lokasi</TH>
              <TH>Tanggal Mutasi</TH>
              <TH>Keterangan</TH>
              <TH className="!text-right">Aksi</TH>
            </tr>
          }
        >
          {loading ? (
            <Tr><TD colSpan={6} className="!py-10 text-center text-muted font-bold">Memuat data...</TD></Tr>
          ) : data.length === 0 ? (
            <Tr><TD colSpan={6} className="!p-0"><EmptyState icon={Repeat} text="Tidak ada data mutasi" /></TD></Tr>
          ) : data.map((m, i) => (
            <Tr key={m.id}>
              <TD className="font-bold text-muted">{(page - 1) * 10 + i + 1}</TD>
              <TD>
                <div className="font-bold">{m.barang?.namaBarang}</div>
                <div className="font-mono text-xs text-muted">{m.barang?.kodeBarang}</div>
              </TD>
              <TD>
                <div className="flex items-center gap-2">
                  <span className="text-muted font-semibold truncate max-w-[110px]" title={m.lokasiAsal}>{m.lokasiAsal}</span>
                  <span className="w-6 h-6 shrink-0 grid place-items-center bg-warn border-2 border-ink text-ink">
                    <ArrowRight className="w-3 h-3" strokeWidth={3.5} />
                  </span>
                  <span className="font-bold truncate max-w-[110px]" title={m.lokasiTujuan}>{m.lokasiTujuan}</span>
                </div>
              </TD>
              <TD className="text-muted font-semibold">{formatDate(m.tanggalMutasi)}</TD>
              <TD className="text-muted font-semibold truncate max-w-xs">{m.keterangan || "-"}</TD>
              <TD>
                <div className="flex items-center justify-end gap-1.5">
                  <Link href={`/mutasi/${m.id}`} className="brut-iconbtn brut-iconbtn-primary" title="Detail"><Eye className="w-4 h-4" strokeWidth={2.75} /></Link>
                  <Link href={`/mutasi/${m.id}/edit`} className="brut-iconbtn brut-iconbtn-warn" title="Edit"><Pencil className="w-4 h-4" strokeWidth={2.75} /></Link>
                  <button onClick={() => setDeleteId(m.id)} className="brut-iconbtn brut-iconbtn-danger" title="Hapus"><Trash2 className="w-4 h-4" strokeWidth={2.75} /></button>
                </div>
              </TD>
            </Tr>
          ))}
        </Table>

        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </Card>

      <ConfirmModal
        open={!!deleteId}
        title="Hapus Mutasi?"
        message="Data yang dihapus tidak dapat dikembalikan. Lokasi barang tidak akan dikembalikan ke lokasi asal secara otomatis."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}