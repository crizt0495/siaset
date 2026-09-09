"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Eye, Pencil, Trash2 } from "lucide-react"
import {
  PageHeader, AddButton, Card, Table, TH, TD, Tr, Pagination,
  Badge, ConfirmModal, Input, Select, EmptyState, Label,
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

      <Card
        noPad
        className="mb-6"
        title={undefined}
        bodyClassName=""
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 border-b-[3px] border-ink bg-paper2">
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

        <Table
          head={
            <tr>
              <TH className="!w-12">No</TH>
              <TH>Kode</TH>
              <TH>Nama</TH>
              <TH>Komisi</TH>
              <TH>Kondisi</TH>
              <TH>Lokasi</TH>
              <TH>Status</TH>
              <TH className="!text-center">Jumlah</TH>
              <TH className="!text-right">Aksi</TH>
            </tr>
          }
        >
          {loading ? (
            <Tr><TD colSpan={9} className="!py-10 text-center text-muted font-bold">Memuat data...</TD></Tr>
          ) : data.length === 0 ? (
            <Tr>
              <TD colSpan={9} className="!p-0">
                <EmptyState icon={Trash2} text="Tidak ada data barang" />
              </TD>
            </Tr>
          ) : data.map((b, i) => (
            <Tr key={b.id}>
              <TD className="font-bold text-muted">{(page - 1) * 10 + i + 1}</TD>
              <TD className="font-mono text-xs font-bold">{b.kodeBarang}</TD>
              <TD className="font-bold">{b.namaBarang}</TD>
              <TD className="text-muted font-semibold">{b.komisi?.namaKomisi || "-"}</TD>
              <TD><Badge color={kondisiColor[b.kondisi] || "default"}>{b.kondisi}</Badge></TD>
              <TD className="text-muted font-semibold">{b.lokasi}</TD>
              <TD><Badge color={statusColor[b.status] || "default"}>{b.status}</Badge></TD>
              <TD className="!text-center brut-num">{b.jumlah}</TD>
              <TD>
                <div className="flex items-center justify-end gap-1.5">
                  <Link href={`/barang/${b.id}`} className="brut-iconbtn brut-iconbtn-primary" title="Detail"><Eye className="w-4 h-4" strokeWidth={2.75} /></Link>
                  <Link href={`/barang/${b.id}/edit`} className="brut-iconbtn brut-iconbtn-warn" title="Edit"><Pencil className="w-4 h-4" strokeWidth={2.75} /></Link>
                  <button onClick={() => setDeleteId(b.id)} className="brut-iconbtn brut-iconbtn-danger" title="Hapus"><Trash2 className="w-4 h-4" strokeWidth={2.75} /></button>
                </div>
              </TD>
            </Tr>
          ))}
        </Table>

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