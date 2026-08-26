"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Barang {
  id: string
  kodeBarang: string
  namaBarang: string
  lokasi: string
}

export default function MutasiCreate() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [barangList, setBarangList] = useState<Barang[]>([])
  const [error, setError] = useState("")
  
  const [form, setForm] = useState({
    barangId: "",
    lokasiTujuan: "",
    tanggalMutasi: new Date().toISOString().split('T')[0],
    keterangan: "",
  })

  useEffect(() => {
    // Fetch all active barang for the dropdown
    // Note: In a real app with thousands of items, this should be a searchable select/combobox
    fetch("/api/barang?limit=1000&status=Aktif")
      .then(r => r.json())
      .then(j => setBarangList(j.data || []))
      .catch(e => console.error("Failed to fetch barang:", e))
  }, [])

  const selectedBarang = barangList.find(b => b.id === form.barangId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      const res = await fetch("/api/mutasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tanggalMutasi: new Date(form.tanggalMutasi).toISOString()
        }),
      })
      
      if (!res.ok) { 
        const j = await res.json()
        throw new Error(j.error || "Gagal menyimpan mutasi") 
      }
      
      router.push("/mutasi")
    } catch (e: any) { 
      setError(e.message) 
    } finally { 
      setLoading(false) 
    }
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  return (
    <div>
      <Link href="/mutasi" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-4">
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Link>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Tambah Mutasi Barang</h1>

      {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pilih Barang *</label>
              <select required value={form.barangId} onChange={set("barangId")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                <option value="">-- Pilih Barang --</option>
                {barangList.map(b => (
                  <option key={b.id} value={b.id}>{b.kodeBarang} - {b.namaBarang}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lokasi Asal (Otomatis)</label>
              <input type="text" readOnly value={selectedBarang?.lokasi || "-"} 
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm cursor-not-allowed" />
              <p className="text-xs text-gray-500 mt-1">Lokasi asal diambil otomatis dari data barang saat ini.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lokasi Tujuan *</label>
              <input type="text" required value={form.lokasiTujuan} onChange={set("lokasiTujuan")} placeholder="Masukkan lokasi tujuan baru"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal Mutasi *</label>
              <input type="date" required value={form.tanggalMutasi} onChange={set("tanggalMutasi")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Keterangan / Alasan Mutasi</label>
            <textarea rows={3} value={form.keterangan} onChange={set("keterangan")} placeholder="Tambahkan catatan jika diperlukan..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link href="/mutasi" className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Batal</Link>
          <button type="submit" disabled={loading || !form.barangId}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
            {loading ? "Menyimpan..." : "Simpan Mutasi"}
          </button>
        </div>
      </form>
    </div>
  )
}
