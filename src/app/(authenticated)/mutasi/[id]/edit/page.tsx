"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Repeat } from "lucide-react"
import {
  PageHeader, BackLink, ErrorBanner, FormCard, Field,
  Input, Textarea, Button, ButtonLink, LoadingState,
} from "@/components/ui"

interface MutasiDetail {
  id: string
  lokasiTujuan: string
  lokasiAsal: string
  tanggalMutasi: string
  keterangan: string | null
  barang: { id: string; namaBarang: string; kodeBarang: string; lokasi: string }
}

export default function MutasiEditPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [data, setData] = useState<MutasiDetail | null>(null)

  const [form, setForm] = useState({
    lokasiTujuan: "",
    tanggalMutasi: "",
    keterangan: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/mutasi/${params.id}`)
        if (!res.ok) throw new Error("Mutasi tidak ditemukan")
        const json: MutasiDetail = await res.json()
        setData(json)
        setForm({
          lokasiTujuan: json.lokasiTujuan,
          tanggalMutasi: new Date(json.tanggalMutasi).toISOString().split('T')[0],
          keterangan: json.keterangan || "",
        })
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const res = await fetch(`/api/mutasi/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tanggalMutasi: new Date(form.tanggalMutasi).toISOString(),
        }),
      })

      if (!res.ok) {
        const j = await res.json()
        throw new Error(j.error || "Gagal memperbarui mutasi")
      }

      router.push(`/mutasi/${params.id}`)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  if (loading) return <LoadingState text="Memuat data mutasi..." />

  if (error && !data) return (
    <div className="text-center py-20">
      <p className="text-danger font-bold mb-4">{error}</p>
      <ButtonLink href="/mutasi" variant="primary">Kembali ke Daftar Mutasi</ButtonLink>
    </div>
  )

  if (!data) return null

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <BackLink href={`/mutasi/${data.id}`} />
        <span className="text-sm font-bold text-muted uppercase tracking-wider">Mutasi</span>
      </div>

      <PageHeader
        index="04"
        title="Edit Mutasi"
        desc="Perbarui data perpindahan aset"
      />

      {error && <ErrorBanner message={error} />}

      <form onSubmit={handleSubmit}>
        <FormCard
          title="Form Mutasi"
          icon={Repeat}
          footer={
            <>
              <ButtonLink href={`/mutasi/${data.id}`} variant="dark">Batal</ButtonLink>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <div className="brut-card bg-good p-4">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest opacity-80">Barang</p>
              <p className="brut-title brut-h3 mt-1">{data.barang.namaBarang}</p>
              <p className="text-xs font-mono font-bold opacity-80">{data.barang.kodeBarang}</p>
            </div>
            <div className="brut-card bg-warn p-4">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest opacity-80">Lokasi Asal</p>
              <p className="brut-title brut-h3 mt-1">{data.lokasiAsal}</p>
              <p className="text-xs font-bold opacity-80">Tidak dapat diubah</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Field label="Lokasi Tujuan" required hint="Mengubah lokasi tujuan akan memperbarui lokasi barang secara otomatis.">
              <Input type="text" required value={form.lokasiTujuan} onChange={set("lokasiTujuan")} />
            </Field>
            <Field label="Tanggal Mutasi" required>
              <Input type="date" required value={form.tanggalMutasi} onChange={set("tanggalMutasi")} />
            </Field>
            <div className="lg:col-span-2">
              <Field label="Keterangan">
                <Textarea rows={3} value={form.keterangan} onChange={set("keterangan")} placeholder="Tambahkan catatan..." />
              </Field>
            </div>
          </div>
        </FormCard>
      </form>
    </div>
  )
}