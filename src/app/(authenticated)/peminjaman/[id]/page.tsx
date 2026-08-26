"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Pencil, RotateCcw } from "lucide-react"

interface Peminjaman {
  id: string; barangId: string; jumlahDipinjam: number; peminjam: string
  tanggalPinjam: string; tanggalKembali: string | null; keterangan: string | null
  status: string; createdAt: string
  barang: { id: string; kodeBarang: string; namaBarang: string; jumlah: number; kondisi: string; lokasi: string; komisi?: { namaKomisi: string } | null }
  createdByUser?: { id: string; namaLengkap: string } | null
}

export default function PeminjamanDetail() {
  const params = useParams()
  const id = params.id as string
  const [data, setData] = useState<Peminjaman | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/peminjaman/${id}`).then(r => r.json()).then(j => { setData(j); setLoading(false) })
  }, [id])

  const handleKembalikan = async () => {
    await fetch(`/api/peminjaman/${id}/kembalikan`, { method: "POST" })
    const res = await fetch(`/api/peminjaman/${id}`)
    const j = await res.json()
    setData(j)
  }

  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"
  const formatDateTime = (d: string) => new Date(d).toLocaleString("id-ID")

  if (loading) return <div className="text-gray-500 dark:text-gray-400">Memuat data...</div>
  if (!data) return <div className="text-gray-500 dark:text-gray-400">Data tidak ditemukan</div>

  const statusColor = data.status === "Dipinjam"
    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
    : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"

  return (
    <div>
      <Link href="/peminjaman" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-4">
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Detail Peminjaman</h1>
        <div className="flex gap-2">
          {data.status === "Dipinjam" && (
            <button onClick={handleKembalikan}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm">
              <RotateCcw className="w-4 h-4" /> Kembalikan
            </button>
          )}
          <Link href={`/peminjaman/${id}/edit`}
            className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm">
            <Pencil className="w-4 h-4" /> Edit
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Informasi Peminjaman</h2>
          <dl className="space-y-3">
            <div className="flex justify-between"><dt className="text-sm text-gray-500 dark:text-gray-400">Peminjam</dt><dd className="text-sm font-medium text-gray-800 dark:text-gray-200">{data.peminjam}</dd></div>
            <div className="flex justify-between"><dt className="text-sm text-gray-500 dark:text-gray-400">Jumlah Dipinjam</dt><dd className="text-sm font-medium text-gray-800 dark:text-gray-200">{data.jumlahDipinjam} unit</dd></div>
            <div className="flex justify-between"><dt className="text-sm text-gray-500 dark:text-gray-400">Tanggal Pinjam</dt><dd className="text-sm font-medium text-gray-800 dark:text-gray-200">{formatDate(data.tanggalPinjam)}</dd></div>
            <div className="flex justify-between"><dt className="text-sm text-gray-500 dark:text-gray-400">Tanggal Kembali</dt><dd className="text-sm font-medium text-gray-800 dark:text-gray-200">{formatDate(data.tanggalKembali)}</dd></div>
            <div className="flex justify-between items-center"><dt className="text-sm text-gray-500 dark:text-gray-400">Status</dt><dd><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>{data.status}</span></dd></div>
            {data.keterangan && <div className="flex justify-between"><dt className="text-sm text-gray-500 dark:text-gray-400">Keterangan</dt><dd className="text-sm text-gray-800 dark:text-gray-200 text-right max-w-[60%]">{data.keterangan}</dd></div>}
          </dl>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Informasi Barang</h2>
          <dl className="space-y-3">
            <div className="flex justify-between"><dt className="text-sm text-gray-500 dark:text-gray-400">Nama Barang</dt><dd className="text-sm font-medium text-gray-800 dark:text-gray-200">{data.barang.namaBarang}</dd></div>
            <div className="flex justify-between"><dt className="text-sm text-gray-500 dark:text-gray-400">Kode Barang</dt><dd className="text-sm font-mono text-gray-800 dark:text-gray-200">{data.barang.kodeBarang}</dd></div>
            <div className="flex justify-between"><dt className="text-sm text-gray-500 dark:text-gray-400">Komisi</dt><dd className="text-sm text-gray-800 dark:text-gray-200">{data.barang.komisi?.namaKomisi || "-"}</dd></div>
            <div className="flex justify-between"><dt className="text-sm text-gray-500 dark:text-gray-400">Kondisi</dt><dd className="text-sm text-gray-800 dark:text-gray-200">{data.barang.kondisi}</dd></div>
            <div className="flex justify-between"><dt className="text-sm text-gray-500 dark:text-gray-400">Lokasi</dt><dd className="text-sm text-gray-800 dark:text-gray-200">{data.barang.lokasi}</dd></div>
            <div className="flex justify-between"><dt className="text-sm text-gray-500 dark:text-gray-400">Sisa Stok</dt><dd className="text-sm font-medium text-gray-800 dark:text-gray-200">{data.barang.jumlah} unit</dd></div>
          </dl>
        </div>
      </div>

      <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Informasi Lainnya</h2>
        <dl className="space-y-3">
          <div className="flex justify-between"><dt className="text-sm text-gray-500 dark:text-gray-400">Dibuat Oleh</dt><dd className="text-sm text-gray-800 dark:text-gray-200">{data.createdByUser?.namaLengkap || "-"}</dd></div>
          <div className="flex justify-between"><dt className="text-sm text-gray-500 dark:text-gray-400">Waktu Dibuat</dt><dd className="text-sm text-gray-800 dark:text-gray-200">{formatDateTime(data.createdAt)}</dd></div>
        </dl>
      </div>
    </div>
  )
}
