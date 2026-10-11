"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  Database, Download, Trash2, Upload, RefreshCw, CheckCircle, AlertCircle, HardDrive, FileUp, Server,
} from "lucide-react"
import {
  PageHeader, Label, Card, StatCard, DataList, ListActions, ListIndex,
  Button, IconButton, ConfirmModal, EmptyState, LoadingState,
} from "@/components/ui"

import SuperadminOnly from "@/components/SuperadminOnly"

interface BackupFile {
  id: string
  filename: string
  size: string
  sizeBytes: number
  createdAt: string
  status: "success"
}

function formatBytes(bytes: number): string {
  if (!bytes) return "0 B"
  const units = ["B", "KB", "MB", "GB"]
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  const val = bytes / Math.pow(1024, i)
  return `${val.toFixed(i === 0 || val >= 10 ? 0 : 1)} ${units[i]}`
}

export default function BackupPage() {
  return (
    <SuperadminOnly>
      <BackupPageContent />
    </SuperadminOnly>
  )
}

function BackupPageContent() {
  const [backups, setBackups] = useState<BackupFile[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [restoreFile, setRestoreFile] = useState<File | null>(null)
  const [confirmRestore, setConfirmRestore] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchBackups = useCallback(async () => {
    try {
      const res = await fetch("/api/backup")
      if (!res.ok) throw new Error("Gagal memuat daftar backup")
      const json = await res.json()
      setBackups(json.data || [])
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Gagal memuat daftar backup" })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBackups()
  }, [fetchBackups])

  const handleCreateBackup = async () => {
    setCreating(true)
    setMessage(null)
    try {
      const res = await fetch("/api/backup", { method: "POST" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Gagal membuat backup")
      setBackups(prev => [json, ...prev.filter(b => b.id !== json.id)])
      setMessage({ type: "success", text: `Backup berhasil dibuat: ${json.filename}` })
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Gagal membuat backup" })
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteBackup = async (id: string) => {
    setDeleteId(null)
    setMessage(null)
    try {
      const res = await fetch(`/api/backup/${encodeURIComponent(id)}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Gagal menghapus backup")
      setBackups(prev => prev.filter(b => b.id !== id))
      setMessage({ type: "success", text: "Backup berhasil dihapus" })
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Gagal menghapus backup" })
    }
  }

  const handleRestoreFile = async () => {
    setConfirmRestore(false)
    if (!restoreFile) return
    setMessage(null)
    try {
      const text = await restoreFile.text()
      const res = await fetch("/api/backup/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql: text }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Gagal melakukan restore")
      setMessage({ type: "success", text: "Restore berhasil. Data database telah dipulihkan." })
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Gagal melakukan restore" })
    } finally {
      setRestoreFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const totalSize = backups.reduce((sum, b) => sum + (b.sizeBytes || 0), 0)

  return (
    <div>
      <PageHeader
        index="10"
        title="Backup Database"
        desc="Buat backup, unduh file SQL, dan pulihkan data"
        extra={<Label color="purple">10 · Backup</Label>}
      >
        <Button onClick={handleCreateBackup} disabled={creating} variant="primary" className="w-full sm:w-auto">
          {creating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" strokeWidth={3} /> Membuat Backup...
            </>
          ) : (
            <>
              <Database className="w-4 h-4" strokeWidth={3} /> Buat Backup
            </>
          )}
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-5 mb-6 sm:mb-8">
        <StatCard icon={Database} title="Backup Tersimpan" value={backups.length} face="primary" />
        <StatCard icon={HardDrive} title="Total Ukuran" value={formatBytes(totalSize)} face="warn" />
        <StatCard
          icon={CheckCircle}
          title="Terakhir Dibuat"
          value={backups[0]?.createdAt || "-"}
          face="good"
        />
      </div>

      {message && (
        <div className={`brut-card p-3.5 sm:p-4 mb-6 flex items-start gap-3 ${message.type === "success" ? "bg-good" : "bg-danger text-white"}`}>
          {message.type === "success" ? <CheckCircle className="w-5 h-5 text-ink shrink-0" strokeWidth={3} /> : <AlertCircle className="w-5 h-5 shrink-0" strokeWidth={3} />}
          <p className="text-sm font-bold break-words">{message.text}</p>
        </div>
      )}

      {/* Restore */}
      <Card
        className="mb-6 sm:mb-8"
        title="Restore Database"
        sub="Pulihkan data dari file SQL backup"
        icon={Server}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".sql,text/sql,text/plain"
          className="hidden"
          onChange={(e) => setRestoreFile(e.target.files?.[0] || null)}
        />
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="brut-btn flex-1 justify-start !text-left !min-w-0"
            type="button"
          >
            <FileUp className="w-4 h-4 shrink-0" strokeWidth={3} />
            <span className="truncate font-semibold">
              {restoreFile ? restoreFile.name : "Pilih file SQL backup..."}
            </span>
          </button>
          <Button
            variant="danger"
            onClick={() => setConfirmRestore(true)}
            disabled={!restoreFile}
            className="w-full sm:w-auto"
          >
            <Upload className="w-4 h-4" strokeWidth={3} /> Restore Sekarang
          </Button>
        </div>
        <p className="text-xs text-muted font-medium mt-3">
          Peringatan: proses restore akan menggantikan seluruh data di database dengan isi file backup.
          Pastikan Anda memiliki backup terbaru sebelum melanjutkan.
        </p>
      </Card>

      <Card
        noPad
        title="Daftar Backup"
        sub="Riwayat file backup database"
        icon={Database}
        actions={<Label color="blue">{backups.length} file</Label>}
      >
        {loading ? (
          <LoadingState text="Memuat backup..." />
        ) : backups.length === 0 ? (
          <EmptyState icon={Database} text="Belum ada backup" />
        ) : (
          <DataList<BackupFile>
            rows={backups}
            getKey={(b) => b.id}
            emptyIcon={Database}
            emptyText="Belum ada backup"
            columns={[
              {
                header: "No",
                render: (_b, i) => <ListIndex value={i + 1} />,
                className: "!w-12 font-bold text-muted",
                headClassName: "!w-12",
              },
              {
                header: "Nama File",
                render: (b) => <span className="font-mono text-xs font-bold break-all">{b.filename}</span>,
                slot: "title",
              },
              {
                header: "Status",
                render: () => <span className="brut-badge brut-badge-green">Berhasil</span>,
                slot: "chip",
              },
              {
                header: "Ukuran",
                render: (b) => <span className="text-muted font-semibold">{b.size}</span>,
              },
              {
                header: "Tanggal",
                render: (b) => <span className="text-muted font-semibold">{b.createdAt}</span>,
              },
              {
                header: "Aksi",
                render: (b) => (
                  <ListActions>
                    <a
                      href={`/api/backup/${encodeURIComponent(b.id)}/download`}
                      className="brut-iconbtn brut-iconbtn-good"
                      title="Download SQL"
                      aria-label="Download SQL"
                    >
                      <Download className="w-4 h-4" strokeWidth={2.75} />
                    </a>
                    <IconButton title="Hapus" aria-label="Hapus" variant="danger" onClick={() => setDeleteId(b.id)}>
                      <Trash2 className="w-4 h-4" strokeWidth={2.75} />
                    </IconButton>
                  </ListActions>
                ),
                slot: "actions",
                className: "!text-right",
                headClassName: "!text-right",
              },
            ]}
          />
        )}
      </Card>

      <ConfirmModal
        open={!!deleteId}
        title="Hapus Backup?"
        message="File backup yang dihapus tidak dapat dikembalikan."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDeleteBackup(deleteId)}
      />

      <ConfirmModal
        open={confirmRestore}
        title="Restore Database?"
        message={restoreFile
          ? `Data dari "${restoreFile.name}" akan menggantikan seluruh data saat ini. Proses ini tidak dapat dibatalkan.`
          : ""}
        label="Restore"
        onCancel={() => setConfirmRestore(false)}
        onConfirm={handleRestoreFile}
      />
    </div>
  )
}
