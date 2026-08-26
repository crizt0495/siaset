"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Pencil, Wrench } from "lucide-react"

export default function PemeliharaanDetail() {
  const params = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/pemeliharaan/${params.id}`).then(r => r.json()).then(j => { setData(j); setLoading(false) })
  }, [params.id])

  if (loading) return <div className="text-center py-8 text-gray-500">Memuat data...</div>
  if (!data) return <div className="text-center py-8 text-gray-500">Data tidak ditemukan</div>

  const formatRupiah = (v: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(v)

  return (
    <div>
      <Link href="/pemeliharaan" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-4">
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Detail Pemeliharaan</h1>
        <Link href={`/pemeliharaan/${data.id}/edit`} className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
          <Pencil className="w-4 h-4" /> Edit
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2"><Wrench className="w-5 h-5" /> Informasi Pemeliharaan</h2>
        <div className="space-y-3">
          {[
            ["Barang", data.barang ? `${data.barang.kodeBarang} - ${data.barang.namaBarang}` : "-"],
            ["Komisi", data.barang?.komisi?.namaKomisi || "-"],
            ["Tanggal", new Date(data.tanggal).toLocaleDateString("id-ID")],
            ["Biaya", formatRupiah(Number(data.biaya))],
            ["Keterangan", data.keterangan || "-"],
            ["Dicatat Oleh", data.user?.namaLengkap || "-"],
            ["Tanggal Input", new Date(data.createdAt).toLocaleDateString("id-ID")],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
