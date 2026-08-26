"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, FileDown, ChevronLeft, ChevronRight, Package } from "lucide-react"

interface Aset {
  id: string; kodeBarang: string; namaBarang: string; kondisi: string; status: string; lokasi: string; jumlah: number; hargaPerolehan: number
  komisi?: { namaKomisi: string } | null
}
interface Komisi { id: string; namaKomisi: string }

export default function LaporanAset() {
  const [data, setData] = useState<Aset[]>([])
  const [komisiList, setKomisiList] = useState<Komisi[]>([])
  const [filterKomisi, setFilterKomisi] = useState("")
  const [filterKondisi, setFilterKondisi] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, aktif: 0, nonaktif: 0, totalHarga: 0 })

  const fetchData = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "10" })
    if (filterKomisi) params.set("komisiId", filterKomisi)
    if (filterKondisi) params.set("kondisi", filterKondisi)
    if (filterStatus) params.set("status", filterStatus)
    const res = await fetch(`/api/barang?${params}`)
    const json = await res.json()
    const items = json.data || []
    setData(items)
    setTotalPages(json.pagination?.totalPages || 1)
    setStats({
      total: json.pagination?.total || items.length,
      aktif: items.filter((a: Aset) => a.status === "Aktif").length,
      nonaktif: items.filter((a: Aset) => a.status === "Nonaktif").length,
      totalHarga: items.reduce((sum: number, a: Aset) => sum + (a.hargaPerolehan || 0) * (a.jumlah || 0), 0),
    })
    setLoading(false)
  }, [page, filterKomisi, filterKondisi, filterStatus])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => {
    fetch("/api/komisi").then(r => r.json()).then(j => setKomisiList(j.data || []))
  }, [])

  const formatRp = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)

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
        <div className="flex items-center gap-3">
          <Link href="/reports" className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Laporan Aset</h1>
        </div>
        <button onClick={() => alert("Coming soon")} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          <FileDown className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg"><Package className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div>
            <div><p className="text-xs text-gray-500 dark:text-gray-400">Total Aset</p><p className="text-lg font-bold text-gray-800 dark:text-white">{stats.total}</p></div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg"><Package className="w-5 h-5 text-green-600 dark:text-green-400" /></div>
            <div><p className="text-xs text-gray-500 dark:text-gray-400">Aktif</p><p className="text-lg font-bold text-gray-800 dark:text-white">{stats.aktif}</p></div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg"><Package className="w-5 h-5 text-yellow-600 dark:text-yellow-400" /></div>
            <div><p className="text-xs text-gray-500 dark:text-gray-400">Nonaktif</p><p className="text-lg font-bold text-gray-800 dark:text-white">{stats.nonaktif}</p></div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg"><Package className="w-5 h-5 text-purple-600 dark:text-purple-400" /></div>
            <div><p className="text-xs text-gray-500 dark:text-gray-400">Total Nilai</p><p className="text-lg font-bold text-gray-800 dark:text-white">{formatRp(stats.totalHarga)}</p></div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Lokasi</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Harga</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-500">Memuat data...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-500">Tidak ada data</td></tr>
              ) : data.map((a, i) => (
                <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{(page - 1) * 10 + i + 1}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-800 dark:text-gray-200">{a.kodeBarang}</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-medium">{a.namaBarang}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{a.komisi?.namaKomisi || "-"}</td>
                  <td className="px-4 py-3">{kondisiBadge(a.kondisi)}</td>
                  <td className="px-4 py-3">{statusBadge(a.status)}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{a.lokasi}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-right">{formatRp(a.hargaPerolehan)}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-center">{a.jumlah}</td>
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
    </div>
  )
}
