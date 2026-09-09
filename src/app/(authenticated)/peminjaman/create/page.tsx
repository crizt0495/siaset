"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRightLeft } from "lucide-react"
import {
  PageHeader, BackLink, ErrorBanner, FormCard, Field,
  Input, Select, Textarea, Button, ButtonLink,
} from "@/components/ui"

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
      <div className="flex items-center gap-3 mb-6">
        <BackLink href="/peminjaman" />
        <span className="text-sm font-bold text-muted uppercase tracking-wider">Peminjaman</span>
      </div>

      <PageHeader
        index="03"
        title="Tambah Peminjaman"
        desc="Catat peminjaman aset"
      />

      {error && <ErrorBanner message={error} />}

      <form onSubmit={handleSubmit}>
        <FormCard
          title="Form Peminjaman"
          icon={ArrowRightLeft}
          footer={
            <>
              <ButtonLink href="/peminjaman" variant="dark">Batal</ButtonLink>
              <Button type="submit" variant="primary" disabled={loading || !form.barangId}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-5">
              <Field label="Barang" required>
                <Select required value={form.barangId} onChange={set("barangId")}>
                  <option value="">Pilih Barang</option>
                  {barangList.map(b => (
                    <option key={b.id} value={b.id}>{b.namaBarang} ({b.kodeBarang}) - Sisa: {b.jumlah}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Peminjam" required>
                <Input type="text" required value={form.peminjam} onChange={set("peminjam")} placeholder="Nama peminjam" />
              </Field>
              <Field label="Jumlah Dipinjam" required>
                <Input type="number" min="1" required value={form.jumlahDipinjam} onChange={set("jumlahDipinjam")} />
              </Field>
            </div>
            <div className="space-y-5">
              <Field label="Tanggal Pinjam" required>
                <Input type="date" required value={form.tanggalPinjam} onChange={set("tanggalPinjam")} />
              </Field>
              <Field label="Tanggal Kembali">
                <Input type="date" value={form.tanggalKembali} onChange={set("tanggalKembali")} />
              </Field>
              <Field label="Keterangan">
                <Textarea rows={3} value={form.keterangan} onChange={set("keterangan")} placeholder="Keterangan tambahan..." />
              </Field>
            </div>
          </div>
        </FormCard>
      </form>
    </div>
  )
}