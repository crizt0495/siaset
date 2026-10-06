"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Wrench } from "lucide-react"
import {
  PageHeader, BackLink, ErrorBanner, FormCard, Field,
  Input, Select, Textarea, Button, ButtonLink,
} from "@/components/ui"

interface Barang { id: string; namaBarang: string; kodeBarang: string }

export default function PemeliharaanCreate() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [barangList, setBarangList] = useState<Barang[]>([])
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    barangId: "", tanggal: "", biaya: "", keterangan: "",
  })

  useEffect(() => {
    fetch("/api/barang?limit=100").then(r => r.json()).then(j => setBarangList(j.data || []))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/pemeliharaan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barangId: form.barangId,
          tanggal: form.tanggal || new Date().toISOString(),
          biaya: parseFloat(form.biaya) || 0,
          keterangan: form.keterangan || null,
        }),
      })
      if (!res.ok) { const j = await res.json(); throw new Error(j.error || "Gagal menyimpan") }
      router.push("/pemeliharaan")
    } catch (e: any) { setError(e.message) } finally { setLoading(false) }
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  return (
    <div>
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <BackLink href="/pemeliharaan" />
        <span className="text-[0.7rem] sm:text-sm font-bold text-muted uppercase tracking-wider">Pemeliharaan</span>
      </div>

      <PageHeader
        index="06"
        title="Tambah Pemeliharaan"
        desc="Catat perawatan / perbaikan aset"
      />

      {error && <ErrorBanner message={error} />}

      <form onSubmit={handleSubmit}>
        <FormCard
          title="Form Pemeliharaan"
          icon={Wrench}
          footer={
            <>
              <ButtonLink href="/pemeliharaan" variant="dark">Batal</ButtonLink>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            <div className="space-y-4 sm:space-y-5">
              <Field label="Barang" required>
                <Select required value={form.barangId} onChange={set("barangId")}>
                  <option value="">Pilih Barang</option>
                  {barangList.map(b => <option key={b.id} value={b.id}>{b.kodeBarang} - {b.namaBarang}</option>)}
                </Select>
              </Field>
              <Field label="Tanggal" required>
                <Input type="date" required value={form.tanggal} onChange={set("tanggal")} />
              </Field>
            </div>
            <div className="space-y-4 sm:space-y-5">
              <Field label="Biaya (Rp)" required>
                <Input type="number" min="0" step="1000" required value={form.biaya} onChange={set("biaya")} />
              </Field>
              <Field label="Keterangan">
                <Textarea rows={3} value={form.keterangan} onChange={set("keterangan")} placeholder="Detail pekerjaan pemeliharaan" />
              </Field>
            </div>
          </div>
        </FormCard>
      </form>
    </div>
  )
}