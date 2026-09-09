"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import {
  PageHeader, BackLink, ErrorBanner, FormCard, Field,
  Input, Select, Textarea, Button, ButtonLink,
} from "@/components/ui"

interface Barang { id: string; namaBarang: string; kodeBarang: string }

export default function PenghapusanCreate() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [barangList, setBarangList] = useState<Barang[]>([])
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    barangId: "", tanggalPenghapusan: "", alasan: "", keterangan: "",
  })

  useEffect(() => {
    fetch("/api/barang?limit=100").then(r => r.json()).then(j => setBarangList(j.data || []))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/penghapusan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barangId: form.barangId,
          tanggalPenghapusan: form.tanggalPenghapusan || new Date().toISOString(),
          alasan: form.alasan,
          keterangan: form.keterangan || null,
        }),
      })
      if (!res.ok) { const j = await res.json(); throw new Error(j.error || "Gagal menyimpan") }
      router.push("/penghapusan")
    } catch (e: any) { setError(e.message) } finally { setLoading(false) }
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <BackLink href="/penghapusan" />
        <span className="text-sm font-bold text-muted uppercase tracking-wider">Penghapusan</span>
      </div>

      <PageHeader
        index="05"
        title="Tambah Penghapusan"
        desc="Catat pengeluaran barang dari inventaris"
      />

      {error && <ErrorBanner message={error} />}

      <form onSubmit={handleSubmit}>
        <FormCard
          title="Form Penghapusan"
          icon={Trash2}
          footer={
            <>
              <ButtonLink href="/penghapusan" variant="dark">Batal</ButtonLink>
              <Button type="submit" variant="danger" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </>
          }
        >
          <div className="space-y-5">
            <Field label="Barang" required>
              <Select required value={form.barangId} onChange={set("barangId")}>
                <option value="">Pilih Barang</option>
                {barangList.map(b => <option key={b.id} value={b.id}>{b.kodeBarang} - {b.namaBarang}</option>)}
              </Select>
            </Field>
            <Field label="Tanggal Penghapusan" required>
              <Input type="date" required value={form.tanggalPenghapusan} onChange={set("tanggalPenghapusan")} />
            </Field>
            <Field label="Alasan Penghapusan" required>
              <Textarea required rows={3} value={form.alasan} onChange={set("alasan")} placeholder="Jelaskan alasan penghapusan..." />
            </Field>
            <Field label="Keterangan">
              <Textarea rows={3} value={form.keterangan} onChange={set("keterangan")} placeholder="Keterangan tambahan (opsional)..." />
            </Field>
          </div>
        </FormCard>
      </form>
    </div>
  )
}