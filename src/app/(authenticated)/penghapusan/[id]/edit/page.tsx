"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface Barang { id: string; namaBarang: string; kodeBarang: string }

export default function PenghapusanEdit() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [barangList, setBarangList] = useState<Barang[]>([])
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    barangId: "", tanggalPenghapusan: "", alasan: "", keterangan: "",
  })

  useEffect(() => {
    Promise.all([
      fetch(`/api/penghapusan/${params.id}`).then(r => r.json()),
      fetch("/api/barang?limit=100").then(r => r.json()),
    ]).then(([penghapusan, barang]) => {
      setForm({
        barangId: penghapusan.barangId || "",
        tanggalPenghapusan: penghapusan.tanggalPenghapusan ? new Date(penghapusan.tanggalPenghapusan).toISOString().split("T")[0] : "",
        alasan: penghapusan.alasan || "",
        keterangan: penghapusan.keterangan || "",
      })
      setBarangList(barang.data || [])
      setFetching(false)
    })
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/penghapusan/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barangId: form.barangId,
          tanggalPenghapusan: form.tanggalPenghapusan || new Date().toISOString(),
          alasan: form.alasan,
          keterangan: form.keterangan || null,
        }),
      })
      if (!res.ok) { const j = await res.json(); throw new Error(j.error || "Gagal update") }
      router.push(`/penghapusan/${params.id}`)
    } catch (e: any) { setError(e.message) } finally { setLoading(false) }
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  if (fetching) return <div className="text-center py-8 text-gray-500">Memuat data...</div>

  return (
    <div>
      <Link href={`/penghapusan/${params.id}`} className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-4">
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Link>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Edit Penghapusan</h1>

      {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Barang *</label>
            <select required value={form.barangId} onChange={set("barangId")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
              <option value="">Pilih Barang</option>
              {barangList.map(b => <option key={b.id} value={b.id}>{b.kodeBarang} - {b.namaBarang}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal Penghapusan *</label>
            <input type="date" required value={form.tanggalPenghapusan} onChange={set("tanggalPenghapusan")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alasan Penghapusan *</label>
            <textarea required rows={3} value={form.alasan} onChange={set("alasan")} placeholder="Jelaskan alasan penghapusan..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Keterangan</label>
            <textarea rows={3} value={form.keterangan} onChange={set("keterangan")} placeholder="Keterangan tambahan (opsional)..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Link href={`/penghapusan/${params.id}`} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Batal</Link>
          <button type="submit" disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">{loading ? "Menyimpan..." : "Simpan"}</button>
        </div>
      </form>
    </div>
  )
}
