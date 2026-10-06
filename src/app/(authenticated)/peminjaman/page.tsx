"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Eye, Pencil, Trash2, RotateCcw, ArrowRightLeft } from "lucide-react"
import {
  PageHeader, AddButton, Card, DataList, ListActions, ListIndex,
  Pagination, ConfirmModal, Input, Select, Badge, Label,
} from "@/components/ui"

interface Peminjaman {
  id: string; barangId: string; jumlahDipinjam: number; peminjam: string
  tanggalPinjam: string; tanggalKembali: string | null; keterangan: string | null
  status: string; createdAt: string
  barang: { id: string; kodeBarang: string; namaBarang: string; komisi?: { namaKomisi: string } | null }
}

const statusColor: Record<string, "yellow" | "green" | "default"> = {
  Dipinjam: "yellow",
  Dikembalikan: "green",
}

export default function PeminjamanList() {
  const [data, setData] = useState<Peminjaman[]>([])
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "10" })
    if (search) params.set("search", search)
    if (filterStatus) params.set("status", filterStatus)
    const res = await fetch(`/api/peminjaman?${params}`)
    const json = await res.json()
    setData(json.data || [])
    setTotalPages(json.pagination?.totalPages || 1)
    setLoading(false)
  }, [page, search, filterStatus])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDelete = async () => {
    if (!deleteId) return
    await fetch(`/api/peminjaman/${deleteId}`, { method: "DELETE" })
    setDeleteId(null)
    fetchData()
  }

  const handleKembalikan = async (id: string) => {
    await fetch(`/api/peminjaman/${id}/kembalikan`, { method: "POST" })
    fetchData()
  }

  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("id-ID") : "-"

  return (
    <div>
      <PageHeader
        index="03"
        title="Peminjaman"
        desc="Pinjam / kembalikan aset dengan stok otomatis"
        extra={<Label color="warn">03 · Manajemen Aset</Label>}
      >
        <AddButton href="/peminjaman/create">Tambah Peminjaman</AddButton>
      </PageHeader>

      <Card noPad>
        <div className="p-3 border-b-[3px] border-ink bg-paper2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" strokeWidth={3} />
              <Input type="text" placeholder="Cari peminjam atau barang..." value={search} className="!pl-10" onChange={e => { setSearch(e.target.value); setPage(1) }} />
            </div>
            <Select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }}>
              <option value="">Semua Status</option>
              <option value="Dipinjam">Dipinjam</option>
              <option value="Dikembalikan">Dikembalikan</option>
            </Select>
          </div>
        </div>

        <DataList<Peminjaman>
          rows={data}
          getKey={(p) => p.id}
          page={page}
          perPage={10}
          loading={loading}
          emptyIcon={ArrowRightLeft}
          emptyText="Tidak ada data peminjaman"
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
                  <div className="font-bold">{p.barang?.namaBarang}</div>
                  <div className="font-mono text-xs text-muted">{p.barang?.kodeBarang}</div>
                </>
              ),
              slot: "title",
            },
            {
              header: "Peminjam",
              render: (p) => <span className="font-bold">{p.peminjam}</span>,
            },
            {
              header: "Status",
              render: (p) => <Badge color={statusColor[p.status] || "default"}>{p.status}</Badge>,
              slot: "chip",
            },
            {
              header: "Jumlah",
              render: (p) => <span className="brut-num">{p.jumlahDipinjam}</span>,
            },
            {
              header: "Tgl Pinjam",
              render: (p) => <span className="text-muted font-semibold">{formatDate(p.tanggalPinjam)}</span>,
            },
            {
              header: "Tgl Kembali",
              render: (p) => <span className="text-muted font-semibold">{formatDate(p.tanggalKembali)}</span>,
            },
            {
              header: "Aksi",
              render: (p) => (
                <ListActions>
                  <Link href={`/peminjaman/${p.id}`} className="brut-iconbtn brut-iconbtn-primary" title="Detail" aria-label="Detail"><Eye className="w-4 h-4" strokeWidth={2.75} /></Link>
                  <Link href={`/peminjaman/${p.id}/edit`} className="brut-iconbtn brut-iconbtn-warn" title="Edit" aria-label="Edit"><Pencil className="w-4 h-4" strokeWidth={2.75} /></Link>
                  {p.status === "Dipinjam" && (
                    <button onClick={() => handleKembalikan(p.id)} className="brut-iconbtn brut-iconbtn-good" title="Kembalikan" aria-label="Kembalikan">
                      <RotateCcw className="w-4 h-4" strokeWidth={2.75} />
                    </button>
                  )}
                  <button onClick={() => setDeleteId(p.id)} className="brut-iconbtn brut-iconbtn-danger" title="Hapus" aria-label="Hapus"><Trash2 className="w-4 h-4" strokeWidth={2.75} /></button>
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
        title="Hapus Peminjaman?"
        message="Data yang dihapus tidak dapat dikembalikan."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
