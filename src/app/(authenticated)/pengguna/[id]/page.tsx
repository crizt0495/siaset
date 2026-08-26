"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Pencil, User } from "lucide-react"

export default function PenggunaDetail() {
  const params = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/pengguna/${params.id}`).then(r => r.json()).then(j => { setData(j); setLoading(false) })
  }, [params.id])

  if (loading) return <div className="text-center py-8 text-gray-500">Memuat data...</div>
  if (!data) return <div className="text-center py-8 text-gray-500">Data tidak ditemukan</div>

  const roleBadge = (r: string) => {
    const colors: Record<string, string> = {
      Superadmin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      Admin: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      Komisi: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    }
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[r] || ""}`}>{r}</span>
  }

  const statusBadge = (s: string) => {
    const colors: Record<string, string> = {
      Active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      Inactive: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
    }
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[s] || ""}`}>{s}</span>
  }

  return (
    <div>
      <Link href="/pengguna" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-4">
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Detail Pengguna</h1>
        <Link href={`/pengguna/${data.id}/edit`} className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
          <Pencil className="w-4 h-4" /> Edit
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 max-w-2xl">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2"><User className="w-5 h-5" /> Informasi Pengguna</h2>
        <div className="space-y-3">
          {[
            ["Nama Lengkap", data.namaLengkap],
            ["Username", data.username],
            ["Role", roleBadge(data.roles?.[0]?.name || "")],
            ["Komisi", data.komisi?.namaKomisi || "-"],
            ["Status", statusBadge(data.active ? "Active" : "Inactive")],
            ["Dibuat", new Date(data.createdAt).toLocaleDateString("id-ID")],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
