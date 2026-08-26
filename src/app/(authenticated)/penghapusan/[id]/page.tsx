"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Pencil, Trash2 } from "lucide-react"

export default function PenghapusanDetail() {
  const params = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch(`/api/penghapusan/${params.id}`).then(r => r.json()).then(j => { setData(j); setLoading(false) })
  }, [params.id])

  const handleDelete = async () => {
    setDeleting(true)
    await fetch(`/api/penghapusan/${params.id}`, { method: "DELETE" })
    window.location.href = "/penghapusan"
  }

  if (loading) return <div className="text-center py-8 text-gray-500">Memuat data...</div>
  if (!data) return <div className="text-center py-8 text-gray-500">Data tidak ditemukan</div>

  return (
    <div>
      <Link href="/penghapusan" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-4">
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Detail Penghapusan</h1>
        <div className="flex gap-2">
          <Link href={`/penghapusan/${data.id}/edit`} className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
            <Pencil className="w-4 h-4" /> Edit
          </Link>
          <button onClick={() => setShowDelete(true)} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
            <Trash2 className="w-4 h-4" /> Hapus
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Informasi Penghapusan</h2>
          <div className="space-y-3">
            {[
              ["Tanggal Penghapusan", new Date(data.tanggalPenghapusan).toLocaleDateString("id-ID")],
              ["Alasan", data.alasan],
              ["Keterangan", data.keterangan || "-"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 text-right max-w-[60%]">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Informasi Barang</h2>
          <div className="space-y-3">
            {[
              ["Kode Barang", data.barang?.kodeBarang || "-"],
              ["Nama Barang", data.barang?.namaBarang || "-"],
              ["Komisi", data.barang?.komisi?.namaKomisi || "-"],
              ["Kondisi", data.barang?.kondisi || "-"],
              ["Lokasi", data.barang?.lokasi || "-"],
              ["Jumlah", data.barang?.jumlah],
              ["Status", data.barang?.status || "-"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {data.user && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Dicatat oleh</h2>
            <div className="space-y-3">
              {[
                ["Nama", data.user.namaLengkap || "-"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Hapus Penghapusan?</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Data yang dihapus tidak dapat dikembalikan.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDelete(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Batal</button>
              <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50">{deleting ? "Menghapus..." : "Hapus"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
