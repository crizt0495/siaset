"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Eye, Pencil, Trash2, RotateCcw, ArrowRightLeft } from "lucide-react"
import {
  PageHeader, AddButton, Card, Table, TH, TD, Tr, Pagination,
  ConfirmModal, Input, Select, EmptyState, Badge, Label,
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
        <div className="p-4 border-b-[3px] border-ink bg-paper2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

        <Table
          head={
            <tr>
              <TH className="!w-12">No</TH>
              <TH>Barang</TH>
              <TH>Peminjam</TH>
              <TH>Jumlah</TH>
              <TH>Tgl Pinjam</TH>
              <TH>Tgl Kembali</TH>
              <TH>Status</TH>
              <TH className="!text-right">Aksi</TH>
            </tr>
          }
        >
          {loading ? (
            <Tr><TD colSpan={8} className="!py-10 text-center text-muted font-bold">Memuat data...</TD></Tr>
          ) : data.length === 0 ? (
            <Tr><TD colSpan={8} className="!p-0"><EmptyState icon={ArrowRightLeft} text="Tidak ada data peminjaman" /></TD></Tr>
          ) : data.map((p, i) => (
            <Tr key={p.id}>
              <TD className="font-bold text-muted">{(page - 1) * 10 + i + 1}</TD>
              <TD>
                <div className="font-bold">{p.barang.namaBarang}</div>
                <div className="font-mono text-xs text-muted">{p.barang.kodeBarang}</div>
              </TD>
              <TD className="font-bold">{p.peminjam}</TD>
              <TD className="brut-num">{p.jumlahDipinjam}</TD>
              <TD className="text-muted font-semibold">{formatDate(p.tanggalPinjam)}</TD>
              <TD className="text-muted font-semibold">{formatDate(p.tanggalKembali)}</TD>
              <TD><Badge color={statusColor[p.status] || "default"}>{p.status}</Badge></TD>
              <TD>
                <div className="flex items-center justify-end gap-1.5">
                  <Link href={`/peminjaman/${p.id}`} className="brut-iconbtn brut-iconbtn-primary" title="Detail"><Eye className="w-4 h-4" strokeWidth={2.75} /></Link>
                  <Link href={`/peminjaman/${p.id}/edit`} className="brut-iconbtn brut-iconbtn-warn" title="Edit"><Pencil className="w-4 h-4" strokeWidth={2.75} /></Link>
                  {p.status === "Dipinjam" && (
                    <button onClick={() => handleKembalikan(p.id)} className="brut-iconbtn brut-iconbtn-good" title="Kembalikan">
                      <RotateCcw className="w-4 h-4" strokeWidth={2.75} />
                    </button>
                  )}
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
        title="Hapus Peminjaman?"
        message="Data yang dihapus tidak dapat dikembalikan."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}