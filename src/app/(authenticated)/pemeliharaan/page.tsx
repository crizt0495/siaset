"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Eye, Pencil, Trash2, Wrench } from "lucide-react"
import {
  PageHeader, AddButton, Card, DataList, ListActions, ListIndex,
  Pagination, ConfirmModal, Input, Label,
} from "@/components/ui"

import { useAuthz } from "@/hooks/useAuthz"

interface Pemeliharaan {
  id: string; tanggal: string; biaya: number; keterangan: string
  barang?: { id: string; namaBarang: string; kodeBarang: string } | null
  user?: { namaLengkap: string } | null
}

export default function PemeliharaanList() {
  const { can } = useAuthz()
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
        {can("create_pemeliharaan") && <AddButton href="/pemeliharaan/create">Tambah Pemeliharaan</AddButton>}
      </PageHeader>

      <Card noPad>
        <div className="p-3 border-b-[3px] border-ink bg-paper2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" strokeWidth={3} />
            <Input type="text" placeholder="Cari pemeliharaan..." value={search} className="!pl-10" onChange={e => { setSearch(e.target.value); setPage(1) }} />
          </div>
        </div>

        <DataList<Pemeliharaan>
          rows={data}
          getKey={(p) => p.id}
          page={page}
          perPage={10}
          loading={loading}
          emptyIcon={Wrench}
          emptyText="Tidak ada data pemeliharaan"
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
              header: "Biaya",
              render: (p) => <span className="font-bold break-words">{formatRupiah(Number(p.biaya))}</span>,
              slot: "subtitle",
            },
            {
              header: "Tanggal",
              render: (p) => (
                <span className="text-muted font-semibold">{new Date(p.tanggal).toLocaleDateString("id-ID")}</span>
              ),
            },
            {
              header: "Petugas",
              render: (p) => <span className="text-muted font-semibold">{p.user?.namaLengkap || "-"}</span>,
            },
            {
              header: "Keterangan",
              render: (p) => <span className="text-muted font-semibold break-words">{p.keterangan || "-"}</span>,
              className: "text-muted font-semibold truncate max-w-[200px]",
            },
            {
              header: "Aksi",
              render: (p) => (
                <ListActions>
                  <Link href={`/pemeliharaan/${p.id}`} className="brut-iconbtn brut-iconbtn-primary" title="Detail" aria-label="Detail"><Eye className="w-4 h-4" strokeWidth={2.75} /></Link>
                  {can("edit_pemeliharaan") && (
                  <Link href={`/pemeliharaan/${p.id}/edit`} className="brut-iconbtn brut-iconbtn-warn" title="Edit" aria-label="Edit"><Pencil className="w-4 h-4" strokeWidth={2.75} /></Link>
                  )}
                  {can("delete_pemeliharaan") && (
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
        title="Hapus Pemeliharaan?"
        message="Data yang dihapus tidak dapat dikembalikan."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
