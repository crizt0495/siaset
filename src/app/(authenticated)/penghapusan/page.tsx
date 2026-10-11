"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Eye, Pencil, Trash2, Trash } from "lucide-react"
import {
  PageHeader, AddButton, Card, DataList, ListActions, ListIndex,
  Pagination, ConfirmModal, Input, Label,
} from "@/components/ui"

import { useAuthz } from "@/hooks/useAuthz"

interface Penghapusan {
  id: string; tanggalPenghapusan: string; alasan: string; keterangan: string
  barang?: { id: string; namaBarang: string; kodeBarang: string } | null
}

export default function PenghapusanList() {
  const { can } = useAuthz()
  const [data, setData] = useState<Penghapusan[]>([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "10" })
    if (search) params.set("search", search)
    const res = await fetch(`/api/penghapusan?${params}`)
    const json = await res.json()
    setData(json.data || [])
    setTotalPages(json.totalPages || 1)
    setLoading(false)
  }, [page, search])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDelete = async () => {
    if (!deleteId) return
    await fetch(`/api/penghapusan/${deleteId}`, { method: "DELETE" })
    setDeleteId(null)
    fetchData()
  }

  return (
    <div>
      <PageHeader
        index="05"
        title="Penghapusan"
        desc="Pencatatan aset hilang / rusak / dihapus"
        extra={<Label color="red">05 · Manajemen Lainnya</Label>}
      >
        {can("create_penghapusan") && <AddButton href="/penghapusan/create">Tambah Penghapusan</AddButton>}
      </PageHeader>

      <Card noPad>
        <div className="p-3 border-b-[3px] border-ink bg-paper2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" strokeWidth={3} />
            <Input type="text" placeholder="Cari barang..." value={search} className="!pl-10" onChange={e => { setSearch(e.target.value); setPage(1) }} />
          </div>
        </div>

        <DataList<Penghapusan>
          rows={data}
          getKey={(p) => p.id}
          page={page}
          perPage={10}
          loading={loading}
          emptyIcon={Trash}
          emptyText="Tidak ada data penghapusan"
          columns={[
            {
              header: "No",
              render: (_p, i) => <ListIndex value={i + 1} />,
              className: "!w-12 font-bold text-muted",
              headClassName: "!w-12",
            },
            {
              header: "Barang",
              render: (p) => (
                <>
                  <div className="font-bold">{p.barang?.namaBarang || "-"}</div>
                  <div className="font-mono text-xs text-muted">{p.barang?.kodeBarang || ""}</div>
                </>
              ),
              slot: "title",
            },
            {
              header: "Tgl Penghapusan",
              render: (p) => (
                <span className="text-muted font-semibold">
                  {new Date(p.tanggalPenghapusan).toLocaleDateString("id-ID")}
                </span>
              ),
            },
            {
              header: "Alasan",
              render: (p) => <span className="text-muted font-semibold break-words">{p.alasan}</span>,
              className: "text-muted font-semibold max-w-[200px] truncate",
            },
            {
              header: "Keterangan",
              render: (p) => <span className="text-muted font-semibold break-words">{p.keterangan || "-"}</span>,
              className: "text-muted font-semibold max-w-[200px] truncate",
            },
            {
              header: "Aksi",
              render: (p) => (
                <ListActions>
                  <Link href={`/penghapusan/${p.id}`} className="brut-iconbtn brut-iconbtn-primary" title="Detail" aria-label="Detail"><Eye className="w-4 h-4" strokeWidth={2.75} /></Link>
                  {can("edit_penghapusan") && (
                  <Link href={`/penghapusan/${p.id}/edit`} className="brut-iconbtn brut-iconbtn-warn" title="Edit" aria-label="Edit"><Pencil className="w-4 h-4" strokeWidth={2.75} /></Link>
                  )}
                  {can("delete_penghapusan") && (
                    <button onClick={() => setDeleteId(p.id)} className="brut-iconbtn brut-iconbtn-danger" title="Hapus" aria-label="Hapus"><Trash2 className="w-4 h-4" strokeWidth={2.75} /></button>
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
        title="Hapus Data Penghapusan?"
        message="Data yang dihapus tidak dapat dikembalikan."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
