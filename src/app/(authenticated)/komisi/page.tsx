"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Eye, Pencil, Trash2, Users } from "lucide-react"
import {
  PageHeader, AddButton, Card, DataList, ListActions, ListIndex,
  Pagination, ConfirmModal, Input, Label,
} from "@/components/ui"

import { useAuthz } from "@/hooks/useAuthz"

interface Komisi {
  id: string; namaKomisi: string; keterangan: string; _count?: { users: number; barang: number }
}

export default function KomisiList() {
  const { can } = useAuthz()
  const [data, setData] = useState<Komisi[]>([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "10" })
    if (search) params.set("search", search)
    const res = await fetch(`/api/komisi?${params}`)
    const json = await res.json()
    setData(json.data || [])
    setTotalPages(json.totalPages || 1)
    setLoading(false)
  }, [page, search])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDelete = async () => {
    if (!deleteId) return
    await fetch(`/api/komisi/${deleteId}`, { method: "DELETE" })
    setDeleteId(null)
    fetchData()
  }

  return (
    <div>
      <PageHeader
        index="08"
        title="Komisi"
        desc="Kelola komisi & departemen jemaat"
        extra={<Label color="purple">08 · Administrasi</Label>}
      >
        {can("create_komisi") && <AddButton href="/komisi/create">Tambah Komisi</AddButton>}
      </PageHeader>

      <Card noPad>
        <div className="p-3 border-b-[3px] border-ink bg-paper2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" strokeWidth={3} />
            <Input type="text" placeholder="Cari komisi..." value={search} className="!pl-10" onChange={e => { setSearch(e.target.value); setPage(1) }} />
          </div>
        </div>

        <DataList<Komisi>
          rows={data}
          getKey={(k) => k.id}
          page={page}
          perPage={10}
          loading={loading}
          emptyIcon={Users}
          emptyText="Tidak ada data komisi"
          columns={[
            {
              header: "No",
              render: (_k, i) => <ListIndex value={i + 1} />,
              className: "!w-12 font-bold text-muted",
              headClassName: "!w-12",
            },
            {
              header: "Nama Komisi",
              render: (k) => k.namaKomisi,
              slot: "title",
            },
            {
              header: "Keterangan",
              render: (k) => <span className="text-muted font-semibold break-words">{k.keterangan || "-"}</span>,
              className: "text-muted font-semibold max-w-xs truncate",
            },
            {
              header: "Anggota",
              render: (k) => <span className="brut-num">{k._count?.users ?? 0}</span>,
            },
            {
              header: "Barang",
              render: (k) => <span className="brut-num">{k._count?.barang ?? 0}</span>,
            },
            {
              header: "Aksi",
              render: (k) => (
                <ListActions>
                  <Link href={`/komisi/${k.id}`} className="brut-iconbtn brut-iconbtn-primary" title="Detail" aria-label="Detail"><Eye className="w-4 h-4" strokeWidth={2.75} /></Link>
                  {can("edit_komisi") && (
                  <Link href={`/komisi/${k.id}/edit`} className="brut-iconbtn brut-iconbtn-warn" title="Edit" aria-label="Edit"><Pencil className="w-4 h-4" strokeWidth={2.75} /></Link>
                  )}
                  {can("delete_komisi") && (
                    <button onClick={() => setDeleteId(k.id)} className="brut-iconbtn brut-iconbtn-danger" title="Hapus" aria-label="Hapus"><Trash2 className="w-4 h-4" strokeWidth={2.75} /></button>
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
        title="Hapus Komisi?"
        message="Data yang dihapus tidak dapat dikembalikan."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
