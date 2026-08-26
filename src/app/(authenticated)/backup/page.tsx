"use client"

import { useState } from "react"
import { Database, Download, Trash2, RefreshCw, CheckCircle, AlertCircle, Clock, HardDrive } from "lucide-react"

interface BackupFile {
  id: string
  filename: string
  size: string
  createdAt: string
  status: "success" | "pending" | "failed"
}

const initialBackups: BackupFile[] = [
  { id: "1", filename: "backup_2026-08-25_03-00.sql", size: "2.4 MB", createdAt: "2026-08-25 03:00:00", status: "success" },
  { id: "2", filename: "backup_2026-08-24_03-00.sql", size: "2.3 MB", createdAt: "2026-08-24 03:00:00", status: "success" },
  { id: "3", filename: "backup_2026-08-23_03-00.sql", size: "2.2 MB", createdAt: "2026-08-23 03:00:00", status: "success" },
]

export default function BackupPage() {
  const [backups, setBackups] = useState<BackupFile[]>(initialBackups)
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleCreateBackup = async () => {
    setCreating(true)
    setMessage(null)
    // Simulate backup creation since serverless can't run mysqldump
    await new Promise(resolve => setTimeout(resolve, 2000))
    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "-")
    const timeStr = now.toTimeString().slice(0, 5).replace(":", "-")
    const newBackup: BackupFile = {
      id: Date.now().toString(),
      filename: `backup_${dateStr}_${timeStr}.sql`,
      size: "2.5 MB",
      createdAt: now.toISOString().replace("T", " ").slice(0, 19),
      status: "success",
    }
    setBackups(prev => [newBackup, ...prev])
    setMessage({ type: "success", text: "Backup berhasil dibuat! (Simulasi)" })
    setCreating(false)
  }

  const handleDeleteBackup = async (id: string) => {
    setBackups(prev => prev.filter(b => b.id !== id))
    setDeleteId(null)
  }

  const handleDownload = (backup: BackupFile) => {
    const content = `-- Backup Database SIASET\n-- File: ${backup.filename}\n-- Dibuat: ${backup.createdAt}\n-- Status: ${backup.status}\n-- Catatan: File ini adalah simulasi backup\n\n-- Struktur database...\n-- Data...\n\n-- Selesai`
    const blob = new Blob([content], { type: "text/sql" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = backup.filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const statusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle className="w-4 h-4 text-green-500" />
      case "pending": return <Clock className="w-4 h-4 text-yellow-500" />
      case "failed": return <AlertCircle className="w-4 h-4 text-red-500" />
      default: return null
    }
  }

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    }
    const labels: Record<string, string> = { success: "Berhasil", pending: "Menunggu", failed: "Gagal" }
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors[status] || ""}`}>
        {statusIcon(status)}
        {labels[status] || status}
      </span>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Backup Database</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Kelola backup data aplikasi</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <HardDrive className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800 dark:text-white">Buat Backup Baru</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {backups.length} backup tersimpan
              </p>
            </div>
          </div>
          <button
            onClick={handleCreateBackup}
            disabled={creating}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {creating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Membuat Backup...
              </>
            ) : (
              <>
                <Database className="w-4 h-4" />
                Buat Backup
              </>
            )}
          </button>
        </div>
        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
              : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
          }`}>
            {message.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Daftar Backup</h2>
        </div>
        {backups.length === 0 ? (
          <div className="p-8 text-center">
            <Database className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Belum ada backup</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">No</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Nama File</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Ukuran</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tanggal</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {backups.map((backup, i) => (
                  <tr key={backup.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{i + 1}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-800 dark:text-gray-200">{backup.filename}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{backup.size}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{backup.createdAt}</td>
                    <td className="px-4 py-3">{statusBadge(backup.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDownload(backup)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(backup.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Hapus Backup?</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Backup yang dihapus tidak dapat dikembalikan.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteBackup(deleteId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
