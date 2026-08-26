"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface MutasiDetail {
  id: string
  barangId: string
  lokasiAsal: string
  lokasiTujuan: string
  tanggalMutasi: string
  keterangan: string | null
  barang: {
    id: string
    namaBarang: string
    kodeBarang: string
    lokasi: string
  }
}

export default function MutasiEditPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [data, setData] = useState<MutasiDetail | null>(null)
  
  const [form, setForm] = useState({
    lokasiTujuan: "",
    tanggalMutasi: "",
    keterangan: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/mutasi/${params.id}`)
        if (!res.ok) throw new Error("Mutasi tidak ditemukan")
        const json: MutasiDetail = await res.json()
        setData(json)
        setForm({
          lokasiTujuan: json.lokasiTujuan,
          tanggalMutasi: new Date(json.tanggalMutasi).toISOString().split('T')[0],
          keterangan: json.keterangan || "",
        })
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    
    try {
      const res = await fetch(`/api/mutasi/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tanggalMutasi: new Date(form.tanggalMutasi).toISOString()
        }),
      })
      
      if (!res.ok) {
        const j = await res.json()
        throw new Error(j.error || "Gagal memperbarui mutasi")
      }
      
      router.push(`/mutasi/${params.id}`)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-gray-500 dark:text-gray-400">Memuat data...</p>
    </div>
  )

  if (error && !data) return (
    <div className="text-center py-20">
      <p className="text-red-500 mb-4">{error}</p>
      <Link href="/mutasi" className="text-blue-600 hover:underline">Kembali ke Daftar Mutasi</Link>
    </div>
  )

  if (!data) return null

  return (
    <div>
      <Link href={`/mutasi/${data.id}`} className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-4">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Detail
      </Link>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Edit Mutasi</h1>

      {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

      {/* Read-only info */}
      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Barang: </span>
            <span className="text-gray-800 dark:text-white font-medium">{data.barang.namaBarang}</span>
            <span className="text-gray-400 dark:text-gray-500 ml-1">({data.barang.kodeBarang})</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Lokasi Asal: </span>
            <span className="text-gray-800 dark:text-white">{data.lokasiAsal}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lokasi Tujuan *</label>
              <input type="text" required value={form.lokasiTujuan} onChange={set("lokasiTujuan")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
              <p className="text-xs text-gray-500 mt-1">Mengubah lokasi tujuan akan memperbarui lokasi barang secara otomatis.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal Mutasi *</label>
              <input type="date" required value={form.tanggalMutasi} onChange={set("tanggalMutasi")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Keterangan</label>
            <textarea rows={3} value={form.keterangan} onChange={set("keterangan")} placeholder="Tambahkan catatan..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link href={`/mutasi/${data.id}`} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Batal</Link>
          <button type="submit" disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  )
}
