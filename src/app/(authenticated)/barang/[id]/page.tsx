"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Pencil, Package } from "lucide-react"

export default function BarangDetail() {
  const params = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/barang/${params.id}`).then(r => r.json()).then(j => { setData(j); setLoading(false) })
  }, [params.id])

  if (loading) return <div className="text-center py-8 text-gray-500">Memuat data...</div>
  if (!data) return <div className="text-center py-8 text-gray-500">Data tidak ditemukan</div>

  const formatRupiah = (v: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(v)

  return (
    <div>
      <Link href="/barang" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-4">
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Detail Barang</h1>
        <Link href={`/barang/${data.id}/edit`} className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
          <Pencil className="w-4 h-4" /> Edit
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2"><Package className="w-5 h-5" /> Informasi Barang</h2>
          <div className="space-y-3">
            {[
              ["Kode Barang", data.kodeBarang],
              ["Nama Barang", data.namaBarang],
              ["Komisi", data.komisi?.namaKomisi || "-"],
              ["Kondisi", data.kondisi],
              ["Status", data.status],
              ["Lokasi", data.lokasi],
              ["Jumlah", data.jumlah],
              ["Tanggal Perolehan", new Date(data.tanggalPerolehan).toLocaleDateString("id-ID")],
              ["Sumber Perolehan", data.sumberPerolehan],
              ["Harga Perolehan", formatRupiah(Number(data.hargaPerolehan))],
              ["Spesifikasi", data.spesifikasi || "-"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {data.peminjaman?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Riwayat Peminjaman</h2>
              <div className="space-y-2">
                {data.peminjaman.map((p: any) => (
                  <div key={p.id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{p.peminjam}</p>
                      <p className="text-xs text-gray-500">{new Date(p.tanggalPinjam).toLocaleDateString("id-ID")} - {p.jumlahDipinjam} unit</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === "Dipinjam" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>{p.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.mutasi?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Riwayat Mutasi</h2>
              <div className="space-y-2">
                {data.mutasi.map((m: any) => (
                  <div key={m.id} className="py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-800 dark:text-gray-200">{m.lokasiAsal} → {m.lokasiTujuan}</p>
                    <p className="text-xs text-gray-500">{new Date(m.tanggalMutasi).toLocaleDateString("id-ID")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
