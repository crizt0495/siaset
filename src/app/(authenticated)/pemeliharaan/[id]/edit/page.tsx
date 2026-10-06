"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Wrench } from "lucide-react"
import {
  PageHeader, BackLink, ErrorBanner, FormCard, Field,
  Input, Select, Textarea, Button, ButtonLink, LoadingState,
} from "@/components/ui"

interface Barang { id: string; namaBarang: string; kodeBarang: string }

export default function PemeliharaanEdit() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [barangList, setBarangList] = useState<Barang[]>([])
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    barangId: "", tanggal: "", biaya: "", keterangan: "",
  })

  useEffect(() => {
    Promise.all([
      fetch(`/api/pemeliharaan/${params.id}`).then(r => r.json()),
      fetch("/api/barang?limit=100").then(r => r.json()),
    ]).then(([pemeliharaan, barang]) => {
      setForm({
        barangId: pemeliharaan.barangId || "",
        tanggal: pemeliharaan.tanggal ? new Date(pemeliharaan.tanggal).toISOString().split("T")[0] : "",
        biaya: String(Number(pemeliharaan.biaya) || 0),
        keterangan: pemeliharaan.keterangan || "",
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
      const res = await fetch(`/api/pemeliharaan/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tanggal: form.tanggal || new Date().toISOString(),
          biaya: parseFloat(form.biaya) || 0,
          keterangan: form.keterangan || null,
        }),
      })
      if (!res.ok) { const j = await res.json(); throw new Error(j.error || "Gagal update") }
      router.push(`/pemeliharaan/${params.id}`)
    } catch (e: any) { setError(e.message) } finally { setLoading(false) }
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  if (fetching) return <LoadingState text="Memuat data pemeliharaan..." />

  return (
    <div>
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <BackLink href={`/pemeliharaan/${params.id}`} />
        <span className="text-[0.7rem] sm:text-sm font-bold text-muted uppercase tracking-wider">Pemeliharaan</span>
      </div>

      <PageHeader
        index="06"
        title="Edit Pemeliharaan"
        desc="Perbarui data perawatan aset"
      />

      {error && <ErrorBanner message={error} />}

      <form onSubmit={handleSubmit}>
        <FormCard
          title="Form Pemeliharaan"
          icon={Wrench}
          footer={
            <>
              <ButtonLink href={`/pemeliharaan/${params.id}`} variant="dark">Batal</ButtonLink>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            <div className="space-y-4 sm:space-y-5">
              <Field label="Barang" hint="Barang tidak dapat diubah">
                <Select required value={form.barangId} disabled className="opacity-60 cursor-not-allowed">
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
                <Textarea rows={3} value={form.keterangan} onChange={set("keterangan")} />
              </Field>
            </div>
          </div>
        </FormCard>
      </form>
    </div>
  )
}