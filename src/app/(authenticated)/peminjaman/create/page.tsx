"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Barang { id: string; kodeBarang: string; namaBarang: string; jumlah: number }

export default function PeminjamanCreate() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [barangList, setBarangList] = useState<Barang[]>([])
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    barangId: "", peminjam: "", jumlahDipinjam: "1",
    tanggalPinjam: new Date().toISOString().split("T")[0], tanggalKembali: "", keterangan: "",
  })

  useEffect(() => {
    fetch("/api/barang?limit=100").then(r => r.json()).then(j => setBarangList(j.data || []))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/peminjaman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barangId: form.barangId,
          peminjam: form.peminjam,
          jumlahDipinjam: parseInt(form.jumlahDipinjam) || 1,
          tanggalPinjam: form.tanggalPinjam,
          tanggalKembali: form.tanggalKembali || null,
          keterangan: form.keterangan || null,
        }),
      })
      if (!res.ok) { const j = await res.json(); throw new Error(j.error || "Gagal menyimpan") }
      router.push("/peminjaman")
    } catch (e: any) { setError(e.message) } finally { setLoading(false) }
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  return (
    <div>
      <Link href="/peminjaman" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-4">
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Link>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Tambah Peminjaman</h1>

      {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Barang *</label>
              <select required value={form.barangId} onChange={set("barangId")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                <option value="">Pilih Barang</option>
                {barangList.map(b => (
                  <option key={b.id} value={b.id}>{b.namaBarang} ({b.kodeBarang}) - Sisa: {b.jumlah}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Peminjam *</label>
              <input type="text" required value={form.peminjam} onChange={set("peminjam")} placeholder="Nama peminjam"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jumlah Dipinjam *</label>
              <input type="number" min="1" required value={form.jumlahDipinjam} onChange={set("jumlahDipinjam")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal Pinjam *</label>
              <input type="date" required value={form.tanggalPinjam} onChange={set("tanggalPinjam")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal Kembali</label>
              <input type="date" value={form.tanggalKembali} onChange={set("tanggalKembali")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Keterangan</label>
              <textarea rows={3} value={form.keterangan} onChange={set("keterangan")} placeholder="Keterangan tambahan..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Link href="/peminjaman" className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Batal</Link>
          <button type="submit" disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">{loading ? "Menyimpan..." : "Simpan"}</button>
        </div>
      </form>
    </div>
  )
}
