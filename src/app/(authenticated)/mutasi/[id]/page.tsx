"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Pencil, Trash2, Package, MapPin, Calendar, User, Clock, ArrowRight } from "lucide-react"

interface MutasiDetail {
  id: string
  lokasiAsal: string
  lokasiTujuan: string
  tanggalMutasi: string
  keterangan: string | null
  createdAt: string
  barang: {
    id: string
    namaBarang: string
    kodeBarang: string
    lokasi: string
    kondisi: string
    komisi?: { namaKomisi: string } | null
  }
  user: {
    id: string
    namaLengkap: string
  } | null
}

export default function MutasiDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [data, setData] = useState<MutasiDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/mutasi/${params.id}`)
        if (!res.ok) throw new Error("Mutasi tidak ditemukan")
        const json = await res.json()
        setData(json)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.id])

  const handleDelete = async () => {
    if (!confirm("Hapus mutasi ini? Lokasi barang tidak akan dikembalikan otomatis.")) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/mutasi/${params.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Gagal menghapus")
      router.push("/mutasi")
    } catch (e: any) {
      alert(e.message)
      setDeleteLoading(false)
    }
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric", month: "long", day: "numeric"
    })

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
    })

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-gray-500 dark:text-gray-400">Memuat data...</p>
    </div>
  )

  if (error) return (
    <div className="text-center py-20">
      <p className="text-red-500 mb-4">{error}</p>
      <Link href="/mutasi" className="text-blue-600 hover:underline">Kembali ke Daftar Mutasi</Link>
    </div>
  )

  if (!data) return null

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <Link href="/mutasi" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-2">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Detail Mutasi</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/mutasi/${data.id}/edit`} className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm">
            <Pencil className="w-4 h-4" /> Edit
          </Link>
          <button onClick={handleDelete} disabled={deleteLoading} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50">
            <Trash2 className="w-4 h-4" /> {deleteLoading ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informasi Mutasi */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Informasi Mutasi</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Barang</p>
                <p className="text-gray-800 dark:text-white font-medium">{data.barang.namaBarang}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{data.barang.kodeBarang}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tanggal Mutasi</p>
                <p className="text-gray-800 dark:text-white">{formatDate(data.tanggalMutasi)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Dilakukan Oleh</p>
                <p className="text-gray-800 dark:text-white">{data.user?.namaLengkap || "-"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Terakhir Diperbarui</p>
                <p className="text-gray-800 dark:text-white text-sm">{formatDateTime(data.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pergerakan Lokasi */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Pergerakan Lokasi</h2>
          <div className="flex flex-col items-center justify-center gap-4 py-6">
            <div className="w-full max-w-xs">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-600">
                <MapPin className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Asal</p>
                <p className="text-gray-800 dark:text-white font-medium mt-1">{data.lokasiAsal}</p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-blue-500 rotate-90" />
            <div className="w-full max-w-xs">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center border border-blue-200 dark:border-blue-800">
                <MapPin className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <p className="text-xs text-blue-500 uppercase tracking-wide">Tujuan</p>
                <p className="text-gray-800 dark:text-white font-medium mt-1">{data.lokasiTujuan}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Tambahan */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Keterangan</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-wrap">{data.keterangan || "Tidak ada keterangan."}</p>
        </div>

        {/* Info Barang Terkait */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Informasi Barang</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Nama Barang</p>
              <p className="text-gray-800 dark:text-white font-medium">{data.barang.namaBarang}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Kode Barang</p>
              <p className="text-gray-800 dark:text-white font-mono">{data.barang.kodeBarang}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Lokasi Saat Ini</p>
              <p className="text-gray-800 dark:text-white">{data.barang.lokasi}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Kondisi</p>
              <p className="text-gray-800 dark:text-white">{data.barang.kondisi}</p>
            </div>
          </div>
          <Link href={`/barang/${data.barang.id}`} className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm mt-4">
            Lihat Detail Barang →
          </Link>
        </div>
      </div>
    </div>
  )
}
