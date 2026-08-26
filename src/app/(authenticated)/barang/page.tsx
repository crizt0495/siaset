"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Plus, Search, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

interface Barang {
  id: string; kodeBarang: string; namaBarang: string; kondisi: string; lokasi: string; status: string; jumlah: number
  komisi?: { namaKomisi: string } | null
}
interface Komisi { id: string; namaKomisi: string }

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

  const kondisiBadge = (k: string) => {
    const colors: Record<string, string> = { Baik: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", Rusak: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", Hilang: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300" }
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[k] || ""}`}>{k}</span>
  }
  const statusBadge = (s: string) => {
    const colors: Record<string, string> = { Aktif: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", Nonaktif: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" }
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[s] || ""}`}>{s}</span>
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Barang & Aset</h1>
        <Link href="/barang/create" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Tambah Barang
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Cari barang..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            </div>
            <select value={filterKomisi} onChange={e => { setFilterKomisi(e.target.value); setPage(1) }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
              <option value="">Semua Komisi</option>
              {komisiList.map(k => <option key={k.id} value={k.id}>{k.namaKomisi}</option>)}
            </select>
            <select value={filterKondisi} onChange={e => { setFilterKondisi(e.target.value); setPage(1) }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
              <option value="">Semua Kondisi</option>
              <option value="Baik">Baik</option><option value="Rusak">Rusak</option><option value="Hilang">Hilang</option>
            </select>
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
              <option value="">Semua Status</option>
              <option value="Aktif">Aktif</option><option value="Nonaktif">Nonaktif</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Kode</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Komisi</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Kondisi</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Lokasi</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Jumlah</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-500">Memuat data...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-500">Tidak ada data</td></tr>
              ) : data.map((b, i) => (
                <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{(page - 1) * 10 + i + 1}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-800 dark:text-gray-200">{b.kodeBarang}</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-medium">{b.namaBarang}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{b.komisi?.namaKomisi || "-"}</td>
                  <td className="px-4 py-3">{kondisiBadge(b.kondisi)}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{b.lokasi}</td>
                  <td className="px-4 py-3">{statusBadge(b.status)}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-center">{b.jumlah}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/barang/${b.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"><Eye className="w-4 h-4" /></Link>
                      <Link href={`/barang/${b.id}/edit`} className="p-1.5 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded"><Pencil className="w-4 h-4" /></Link>
                      <button onClick={() => setDeleteId(b.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Halaman {page} dari {totalPages}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Hapus Barang?</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Data yang dihapus tidak dapat dikembalikan.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Batal</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
