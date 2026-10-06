"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Eye, Pencil, Trash2, Package } from "lucide-react"
import {
  PageHeader, AddButton, Card, DataList, ListActions, ListIndex,
  Pagination, Badge, ConfirmModal, Input, Select, Label,
} from "@/components/ui"

interface Barang {
  id: string; kodeBarang: string; namaBarang: string; kondisi: string; lokasi: string; status: string; jumlah: number
  komisi?: { namaKomisi: string } | null
}
interface Komisi { id: string; namaKomisi: string }

const kondisiColor: Record<string, "green" | "red" | "yellow" | "default"> = {
  Baik: "green", Rusak: "red", Hilang: "yellow",
}
const statusColor: Record<string, "blue" | "yellow" | "default"> = {
  Aktif: "blue", Nonaktif: "yellow",
}

export default function BarangList() {
  const [data, setData] = useState<Barang[]>([])
  const [komisiList, setKomisiList] = useState<Komisi[]>([])
  const [search, setSearch] = useState("")
  const [filterKomisi, setFilterKomisi] = useState("")
  const [filterKondisi, setFilterKondisi] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "10" })
    if (search) params.set("search", search)
    if (filterKomisi) params.set("komisiId", filterKomisi)
    if (filterKondisi) params.set("kondisi", filterKondisi)
    if (filterStatus) params.set("status", filterStatus)
    const res = await fetch(`/api/barang?${params}`)
    const json = await res.json()
    setData(json.data || [])
    setTotalPages(json.pagination?.totalPages || 1)
    setLoading(false)
  }, [page, search, filterKomisi, filterKondisi, filterStatus])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => {
    fetch("/api/komisi").then(r => r.json()).then(j => setKomisiList(j.data || []))
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    await fetch(`/api/barang/${deleteId}`, { method: "DELETE" })
    setDeleteId(null)
    fetchData()
  }

  return (
    <div>
      <PageHeader
        index="02"
        title="Barang & Aset"
        desc="Kelola inventaris aset GKJW secara lengkap"
        extra={<Label color="blue">02 · Manajemen Aset</Label>}
      >
        <AddButton href="/barang/create">Tambah Barang</AddButton>
      </PageHeader>

      <Card noPad>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 p-3 border-b-[3px] border-ink bg-paper2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" strokeWidth={3} />
            <Input type="text" placeholder="Cari barang..." value={search} className="!pl-10" onChange={e => { setSearch(e.target.value); setPage(1) }} />
          </div>
          <Select value={filterKomisi} onChange={e => { setFilterKomisi(e.target.value); setPage(1) }}>
            <option value="">Semua Komisi</option>
            {komisiList.map(k => <option key={k.id} value={k.id}>{k.namaKomisi}</option>)}
          </Select>
          <Select value={filterKondisi} onChange={e => { setFilterKondisi(e.target.value); setPage(1) }}>
            <option value="">Semua Kondisi</option>
            <option value="Baik">Baik</option><option value="Rusak">Rusak</option><option value="Hilang">Hilang</option>
          </Select>
          <Select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }}>
            <option value="">Semua Status</option>
            <option value="Aktif">Aktif</option><option value="Nonaktif">Nonaktif</option>
          </Select>
        </div>

        <DataList<Barang>
          rows={data}
          getKey={(b) => b.id}
          page={page}
          perPage={10}
          loading={loading}
          emptyIcon={Package}
          emptyText="Tidak ada data barang"
          columns={[
            {
              header: "No",
              render: (_b, i) => <ListIndex value={i + 1} />,
              className: "!w-12 font-bold text-muted",
              headClassName: "!w-12",
            },
            {
              header: "Nama",
              render: (b) => b.namaBarang,
              slot: "title",
            },
            {
              header: "Kode",
              render: (b) => <span className="font-mono text-xs font-bold">{b.kodeBarang}</span>,
              slot: "subtitle",
            },
            {
              header: "Kondisi",
              render: (b) => <Badge color={kondisiColor[b.kondisi] || "default"}>{b.kondisi}</Badge>,
              slot: "chip",
            },
            {
              header: "Status",
              render: (b) => <Badge color={statusColor[b.status] || "default"}>{b.status}</Badge>,
              slot: "chip",
            },
            {
              header: "Komisi",
              render: (b) => <span className="text-muted font-semibold">{b.komisi?.namaKomisi || "-"}</span>,
            },
            {
              header: "Lokasi",
              render: (b) => <span className="text-muted font-semibold">{b.lokasi}</span>,
            },
            {
              header: "Jumlah",
              render: (b) => <span className="brut-num">{b.jumlah}</span>,
              className: "!text-center",
              headClassName: "!text-center",
            },
            {
              header: "Aksi",
              render: (b) => (
                <ListActions>
                  <Link href={`/barang/${b.id}`} className="brut-iconbtn brut-iconbtn-primary" title="Detail" aria-label="Detail"><Eye className="w-4 h-4" strokeWidth={2.75} /></Link>
                  <Link href={`/barang/${b.id}/edit`} className="brut-iconbtn brut-iconbtn-warn" title="Edit" aria-label="Edit"><Pencil className="w-4 h-4" strokeWidth={2.75} /></Link>
                  <button onClick={() => setDeleteId(b.id)} className="brut-iconbtn brut-iconbtn-danger" title="Hapus" aria-label="Hapus"><Trash2 className="w-4 h-4" strokeWidth={2.75} /></button>
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
        title="Hapus Barang?"
        message="Data yang dihapus tidak dapat dikembalikan."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
