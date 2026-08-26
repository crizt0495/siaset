"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronLeft, ChevronRight, Users, BookOpen, RotateCcw } from "lucide-react"

interface Peminjaman {
  id: string; jumlahDipinjam: number; tanggalPinjam: string; tanggalKembali: string | null; status: string; keterangan: string; peminjam: string
  barang?: { namaBarang: string; kodeBarang: string } | null
}

export default function LaporanPeminjaman() {
  const [data, setData] = useState<Peminjaman[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, dipinjam: 0, dikembalikan: 0 })

  const fetchData = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "10" })
    const res = await fetch(`/api/peminjaman?${params}`)
    const json = await res.json()
    const items = json.data || []
    setData(items)
    setTotalPages(json.pagination?.totalPages || 1)
    setStats({
      total: json.total || items.length,
      dipinjam: items.filter((p: Peminjaman) => p.status === "Dipinjam").length,
      dikembalikan: items.filter((p: Peminjaman) => p.status === "Dikembalikan").length,
    })
    setLoading(false)
  }, [page])

  useEffect(() => { fetchData() }, [fetchData])

  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-"

  const statusBadge = (s: string) => {
    const colors: Record<string, string> = {
      Dipinjam: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      Dikembalikan: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    }
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[s] || "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}>{s}</span>
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/reports" className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Laporan Peminjaman</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg"><Users className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div>
            <div><p className="text-xs text-gray-500 dark:text-gray-400">Total Peminjaman</p><p className="text-lg font-bold text-gray-800 dark:text-white">{stats.total}</p></div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg"><BookOpen className="w-5 h-5 text-yellow-600 dark:text-yellow-400" /></div>
            <div><p className="text-xs text-gray-500 dark:text-gray-400">Dipinjam</p><p className="text-lg font-bold text-gray-800 dark:text-white">{stats.dipinjam}</p></div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg"><RotateCcw className="w-5 h-5 text-green-600 dark:text-green-400" /></div>
            <div><p className="text-xs text-gray-500 dark:text-gray-400">Dikembalikan</p><p className="text-lg font-bold text-gray-800 dark:text-white">{stats.dikembalikan}</p></div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Barang</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Peminjam</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Jumlah</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tgl Pinjam</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tgl Kembali</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">Memuat data...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">Tidak ada data</td></tr>
              ) : data.map((p, i) => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{(page - 1) * 10 + i + 1}</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-medium">{p.barang?.namaBarang || "-"}</td>
                   <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{p.peminjam || "-"}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-center">{p.jumlahDipinjam}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{formatDate(p.tanggalPinjam)}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{formatDate(p.tanggalKembali)}</td>
                  <td className="px-4 py-3">{statusBadge(p.status)}</td>
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
