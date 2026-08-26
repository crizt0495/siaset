"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Komisi { id: string; namaKomisi: string }

export default function BarangCreate() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [komisiList, setKomisiList] = useState<Komisi[]>([])
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    namaBarang: "", komisiId: "", jumlah: "1", tanggalPerolehan: "", sumberPerolehan: "",
    spesifikasi: "", kondisi: "Baik", lokasi: "", hargaPerolehan: "", status: "Aktif",
  })

  useEffect(() => {
    fetch("/api/komisi").then(r => r.json()).then(j => setKomisiList(j.data || []))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/barang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          komisiId: form.komisiId || null,
          jumlah: parseInt(form.jumlah) || 0,
          hargaPerolehan: parseFloat(form.hargaPerolehan) || 0,
          tanggalPerolehan: form.tanggalPerolehan || new Date().toISOString(),
        }),
      })
      if (!res.ok) { const j = await res.json(); throw new Error(j.error || "Gagal menyimpan") }
      router.push("/barang")
    } catch (e: any) { setError(e.message) } finally { setLoading(false) }
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  return (
    <div>
      <Link href="/barang" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-4">
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Link>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Tambah Barang</h1>

      {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Barang *</label>
              <input type="text" required value={form.namaBarang} onChange={set("namaBarang")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Komisi</label>
              <select value={form.komisiId} onChange={set("komisiId")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                <option value="">Pilih Komisi</option>
                {komisiList.map(k => <option key={k.id} value={k.id}>{k.namaKomisi}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jumlah</label>
              <input type="number" min="0" value={form.jumlah} onChange={set("jumlah")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal Perolehan</label>
              <input type="date" value={form.tanggalPerolehan} onChange={set("tanggalPerolehan")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sumber Perolehan</label>
              <input type="text" value={form.sumberPerolehan} onChange={set("sumberPerolehan")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Spesifikasi</label>
              <textarea rows={3} value={form.spesifikasi} onChange={set("spesifikasi")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kondisi</label>
              <select value={form.kondisi} onChange={set("kondisi")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                <option value="Baik">Baik</option><option value="Rusak">Rusak</option><option value="Hilang">Hilang</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lokasi *</label>
              <input type="text" required value={form.lokasi} onChange={set("lokasi")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Harga Perolehan (Rp)</label>
              <input type="number" min="0" step="1000" value={form.hargaPerolehan} onChange={set("hargaPerolehan")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select value={form.status} onChange={set("status")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                <option value="Aktif">Aktif</option><option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Link href="/barang" className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Batal</Link>
          <button type="submit" disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">{loading ? "Menyimpan..." : "Simpan"}</button>
        </div>
      </form>
    </div>
  )
}
