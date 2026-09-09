"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Package } from "lucide-react"
import {
  PageHeader, BackLink, ErrorBanner, FormCard, Field,
  Input, Select, Textarea, Button, ButtonLink,
} from "@/components/ui"

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
      <div className="flex items-center gap-3 mb-6">
        <BackLink href="/barang" />
        <span className="text-sm font-bold text-muted uppercase tracking-wider">Barang & Aset</span>
      </div>

      <PageHeader
        index="02"
        title="Tambah Barang"
        desc="Catat aset baru ke inventaris GKJW"
      />

      {error && <ErrorBanner message={error} />}

      <form onSubmit={handleSubmit}>
        <FormCard
          title="Form Barang"
          icon={Package}
          footer={
            <>
              <ButtonLink href="/barang" variant="dark">Batal</ButtonLink>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-5">
              <Field label="Nama Barang" required>
                <Input type="text" required value={form.namaBarang} onChange={set("namaBarang")} placeholder="Nama barang / aset" />
              </Field>
              <Field label="Komisi" hint="Komisi pemilik / pengelola aset">
                <Select value={form.komisiId} onChange={set("komisiId")}>
                  <option value="">Pilih Komisi</option>
                  {komisiList.map(k => <option key={k.id} value={k.id}>{k.namaKomisi}</option>)}
                </Select>
              </Field>
              <Field label="Jumlah">
                <Input type="number" min="0" value={form.jumlah} onChange={set("jumlah")} />
              </Field>
              <Field label="Tanggal Perolehan">
                <Input type="date" value={form.tanggalPerolehan} onChange={set("tanggalPerolehan")} />
              </Field>
              <Field label="Sumber Perolehan">
                <Input type="text" value={form.sumberPerolehan} onChange={set("sumberPerolehan")} placeholder="Misal: sumbangan, pembelian" />
              </Field>
            </div>
            <div className="space-y-5">
              <Field label="Spesifikasi">
                <Textarea rows={3} value={form.spesifikasi} onChange={set("spesifikasi")} placeholder="Merk, model, ukuran, dll." />
              </Field>
              <Field label="Kondisi">
                <Select value={form.kondisi} onChange={set("kondisi")}>
                  <option value="Baik">Baik</option><option value="Rusak">Rusak</option><option value="Hilang">Hilang</option>
                </Select>
              </Field>
              <Field label="Lokasi" required>
                <Input type="text" required value={form.lokasi} onChange={set("lokasi")} placeholder="Lokasi penyimpanan saat ini" />
              </Field>
              <Field label="Harga Perolehan (Rp)">
                <Input type="number" min="0" step="1000" value={form.hargaPerolehan} onChange={set("hargaPerolehan")} />
              </Field>
              <Field label="Status">
                <Select value={form.status} onChange={set("status")}>
                  <option value="Aktif">Aktif</option><option value="Nonaktif">Nonaktif</option>
                </Select>
              </Field>
            </div>
          </div>
        </FormCard>
      </form>
    </div>
  )
}