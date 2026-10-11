"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Eye, Pencil, Trash2, ArrowRight, Repeat } from "lucide-react"
import {
  PageHeader, AddButton, Card, DataList, ListActions, ListIndex,
  Pagination, ConfirmModal, Input, Label,
} from "@/components/ui"

import { useAuthz } from "@/hooks/useAuthz"

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
  const { can } = useAuthz()
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

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })

  return (
    <div>
      <PageHeader
        index="04"
        title="Mutasi Barang"
        desc="Perpindahan lokasi aset antar komisi"
        extra={<Label color="blue">04 · Manajemen Aset</Label>}
      >
        {can("create_mutasi") && <AddButton href="/mutasi/create">Tambah Mutasi</AddButton>}
      </PageHeader>

      <Card noPad>
        <div className="p-3 border-b-[3px] border-ink bg-paper2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" strokeWidth={3} />
            <Input type="text" placeholder="Cari barang atau lokasi..." value={search} className="!pl-10" onChange={e => { setSearch(e.target.value); setPage(1) }} />
          </div>
        </div>

        <DataList<Mutasi>
          rows={data}
          getKey={(m) => m.id}
          page={page}
          perPage={10}
          loading={loading}
          emptyIcon={Repeat}
          emptyText="Tidak ada data mutasi"
          columns={[
            {
              header: "No",
              render: (_m, i) => <ListIndex value={i + 1} />,
              className: "!w-12 font-bold text-muted",
              headClassName: "!w-12",
            },
            {
              header: "Barang",
              render: (m) => (
                <>
                  <div className="font-bold">{m.barang?.namaBarang}</div>
                  <div className="font-mono text-xs text-muted">{m.barang?.kodeBarang}</div>
                </>
              ),
              slot: "title",
            },
            {
              header: "Pergerakan Lokasi",
              render: (m) => (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-muted font-semibold truncate max-w-[40%]" title={m.lokasiAsal}>{m.lokasiAsal}</span>
                  <span className="w-6 h-6 shrink-0 grid place-items-center bg-warn border-2 border-ink text-ink">
                    <ArrowRight className="w-3 h-3" strokeWidth={3.5} />
                  </span>
                  <span className="font-bold truncate max-w-[40%]" title={m.lokasiTujuan}>{m.lokasiTujuan}</span>
                </div>
              ),
              slot: "meta",
            },
            {
              header: "Tanggal Mutasi",
              render: (m) => <span className="text-muted font-semibold">{formatDate(m.tanggalMutasi)}</span>,
            },
            {
              header: "Keterangan",
              render: (m) => <span className="text-muted font-semibold break-words">{m.keterangan || "-"}</span>,
              className: "text-muted font-semibold truncate max-w-xs",
            },
            {
              header: "Aksi",
              render: (m) => (
                <ListActions>
                  <Link href={`/mutasi/${m.id}`} className="brut-iconbtn brut-iconbtn-primary" title="Detail" aria-label="Detail"><Eye className="w-4 h-4" strokeWidth={2.75} /></Link>
                  {can("edit_mutasi") && (
                  <Link href={`/mutasi/${m.id}/edit`} className="brut-iconbtn brut-iconbtn-warn" title="Edit" aria-label="Edit"><Pencil className="w-4 h-4" strokeWidth={2.75} /></Link>
                  )}
                  {can("delete_mutasi") && (
                    <button onClick={() => setDeleteId(m.id)} className="brut-iconbtn brut-iconbtn-danger" title="Hapus" aria-label="Hapus"><Trash2 className="w-4 h-4" strokeWidth={2.75} /></button>
                  )}
                </ListActions>
              ),
              slot: "actions",
              className: "!text-right",
              headClassName: "!text-right",
            },
          ]}
        />

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
