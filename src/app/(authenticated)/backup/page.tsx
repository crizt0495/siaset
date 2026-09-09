"use client"

import { useState } from "react"
import { Database, Download, Trash2, RefreshCw, CheckCircle, AlertCircle, HardDrive } from "lucide-react"
import {
  PageHeader, Label, Card, StatCard, Table, TH, TD, Tr,
  Button, IconButton, ConfirmModal, EmptyState,
} from "@/components/ui"

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
    await new Promise(resolve => setTimeout(resolve, 2000))
    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10)
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

  const statusBadge = (status: string) => {
    const color: Record<string, string> = {
      success: "brut-badge-green", pending: "brut-badge-yellow", failed: "brut-badge-red",
    }
    const labels: Record<string, string> = { success: "Berhasil", pending: "Menunggu", failed: "Gagal" }
    return <span className={`brut-badge ${color[status] || "brut-badge-gray"}`}>{labels[status] || status}</span>
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="brut-sticker w-12 h-12 text-lg -rotate-3"><Database className="w-6 h-6" strokeWidth={3} /></span>
        <span className="text-sm font-bold text-muted uppercase tracking-wider">Sistem</span>
      </div>

      <PageHeader
        index="10"
        title="Backup Database"
        desc="Kelola backup data aplikasi"
        extra={<Label color="purple">10 · Backup</Label>}
      >
        <Button onClick={handleCreateBackup} disabled={creating} variant="primary">
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard icon={Database} title="Backup Tersimpan" value={backups.length} face="primary" />
        <StatCard icon={CheckCircle} title="Sukses" value={backups.filter(b => b.status === "success").length} face="good" />
        <StatCard icon={HardDrive} title="Rata-rata Ukuran" value="±2.3 MB" face="warn" />
      </div>

      {message && (
        <div className={`brut-card p-4 mb-6 flex items-center gap-3 ${message.type === "success" ? "bg-good" : "bg-danger text-white"}`}>
          {message.type === "success" ? <CheckCircle className="w-5 h-5 text-ink" strokeWidth={3} /> : <AlertCircle className="w-5 h-5" strokeWidth={3} />}
          <p className="text-sm font-bold">{message.text}</p>
        </div>
      )}

      <Card
        noPad
        title="Daftar Backup"
        sub="Riwayat file backup"
        icon={Database}
        actions={<Label color="blue">{backups.length} file</Label>}
      >
        {backups.length === 0 ? (
          <EmptyState icon={Database} text="Belum ada backup" />
        ) : (
          <Table
            head={
              <tr>
                <TH className="!w-12">No</TH>
                <TH>Nama File</TH>
                <TH>Ukuran</TH>
                <TH>Tanggal</TH>
                <TH>Status</TH>
                <TH className="!text-right">Aksi</TH>
              </tr>
            }
          >
            {backups.map((backup, i) => (
              <Tr key={backup.id}>
                <TD className="font-bold text-muted">{i + 1}</TD>
                <TD className="font-mono text-xs font-bold">{backup.filename}</TD>
                <TD className="text-muted font-semibold">{backup.size}</TD>
                <TD className="text-muted font-semibold">{backup.createdAt}</TD>
                <TD>{statusBadge(backup.status)}</TD>
                <TD>
                  <div className="flex items-center justify-end gap-1.5">
                    <IconButton title="Download" variant="good" onClick={() => handleDownload(backup)}>
                      <Download className="w-4 h-4" strokeWidth={2.75} />
                    </IconButton>
                    <IconButton title="Hapus" variant="danger" onClick={() => setDeleteId(backup.id)}>
                      <Trash2 className="w-4 h-4" strokeWidth={2.75} />
                    </IconButton>
                  </div>
                </TD>
              </Tr>
            ))}
          </Table>
        )}
      </Card>

      <ConfirmModal
        open={!!deleteId}
        title="Hapus Backup?"
        message="Backup yang dihapus tidak dapat dikembalikan."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDeleteBackup(deleteId)}
      />
    </div>
  )
}