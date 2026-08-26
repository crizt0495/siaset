"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Pencil, Users, Package } from "lucide-react"

export default function KomisiDetail() {
  const params = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/komisi/${params.id}`).then(r => r.json()).then(j => { setData(j); setLoading(false) })
  }, [params.id])

  if (loading) return <div className="text-center py-8 text-gray-500">Memuat data...</div>
  if (!data) return <div className="text-center py-8 text-gray-500">Data tidak ditemukan</div>

  return (
    <div>
      <Link href="/komisi" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-4">
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Detail Komisi</h1>
        <Link href={`/komisi/${data.id}/edit`} className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
          <Pencil className="w-4 h-4" /> Edit
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Informasi Komisi</h2>
        <div className="space-y-3">
          {[
            ["Nama Komisi", data.namaKomisi],
            ["Keterangan", data.keterangan || "-"],
            ["Jumlah Anggota", data.users?.length ?? 0],
            ["Jumlah Barang", data.barang?.length ?? 0],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2"><Users className="w-5 h-5" /> Anggota</h2>
          {data.users?.length > 0 ? (
            <div className="space-y-2">
              {data.users.map((u: any) => (
                <div key={u.id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{u.namaLengkap}</p>
                    <p className="text-xs text-gray-500">{u.username}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{u.role}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Tidak ada anggota</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2"><Package className="w-5 h-5" /> Barang</h2>
          {data.barang?.length > 0 ? (
            <div className="space-y-2">
              {data.barang.map((b: any) => (
                <div key={b.id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{b.namaBarang}</p>
                    <p className="text-xs text-gray-500">{b.kodeBarang}</p>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{b.jumlah} unit</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Tidak ada barang</p>
          )}
        </div>
      </div>
    </div>
  )
}
