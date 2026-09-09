"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Eye, Pencil, Trash2, Users } from "lucide-react"
import {
  PageHeader, AddButton, Card, Table, TH, TD, Tr, Pagination,
  ConfirmModal, Input, EmptyState, Label,
} from "@/components/ui"

interface Komisi {
  id: string; namaKomisi: string; keterangan: string; _count?: { users: number; barang: number }
}

export default function KomisiList() {
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
        <AddButton href="/komisi/create">Tambah Komisi</AddButton>
      </PageHeader>

      <Card noPad>
        <div className="p-4 border-b-[3px] border-ink bg-paper2">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" strokeWidth={3} />
            <Input type="text" placeholder="Cari komisi..." value={search} className="!pl-10" onChange={e => { setSearch(e.target.value); setPage(1) }} />
          </div>
        </div>

        <Table
          head={
            <tr>
              <TH className="!w-12">No</TH>
              <TH>Nama Komisi</TH>
              <TH>Keterangan</TH>
              <TH>Anggota</TH>
              <TH>Barang</TH>
              <TH className="!text-right">Aksi</TH>
            </tr>
          }
        >
          {loading ? (
            <Tr><TD colSpan={6} className="!py-10 text-center text-muted font-bold">Memuat data...</TD></Tr>
          ) : data.length === 0 ? (
            <Tr><TD colSpan={6} className="!p-0"><EmptyState icon={Users} text="Tidak ada data komisi" /></TD></Tr>
          ) : data.map((k, i) => (
            <Tr key={k.id}>
              <TD className="font-bold text-muted">{(page - 1) * 10 + i + 1}</TD>
              <TD className="font-bold">{k.namaKomisi}</TD>
              <TD className="text-muted font-semibold max-w-xs truncate">{k.keterangan || "-"}</TD>
              <TD className="brut-num">{k._count?.users ?? 0}</TD>
              <TD className="brut-num">{k._count?.barang ?? 0}</TD>
              <TD>
                <div className="flex items-center justify-end gap-1.5">
                  <Link href={`/komisi/${k.id}`} className="brut-iconbtn brut-iconbtn-primary" title="Detail"><Eye className="w-4 h-4" strokeWidth={2.75} /></Link>
                  <Link href={`/komisi/${k.id}/edit`} className="brut-iconbtn brut-iconbtn-warn" title="Edit"><Pencil className="w-4 h-4" strokeWidth={2.75} /></Link>
                  <button onClick={() => setDeleteId(k.id)} className="brut-iconbtn brut-iconbtn-danger" title="Hapus"><Trash2 className="w-4 h-4" strokeWidth={2.75} /></button>
                </div>
              </TD>
            </Tr>
          ))}
        </Table>

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