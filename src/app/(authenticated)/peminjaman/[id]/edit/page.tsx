"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowRightLeft } from "lucide-react"
import {
  PageHeader, BackLink, ErrorBanner, FormCard, Field,
  Input, Select, Textarea, Button, ButtonLink, LoadingState,
} from "@/components/ui"

export default function PeminjamanEdit() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    peminjam: "", jumlahDipinjam: "1",
    tanggalPinjam: "", tanggalKembali: "", keterangan: "", status: "",
  })

  useEffect(() => {
    fetch(`/api/peminjaman/${id}`).then(r => r.json()).then(j => {
      setForm({
        peminjam: j.peminjam || "",
        jumlahDipinjam: String(j.jumlahDipinjam || 1),
        tanggalPinjam: j.tanggalPinjam ? new Date(j.tanggalPinjam).toISOString().split("T")[0] : "",
        tanggalKembali: j.tanggalKembali ? new Date(j.tanggalKembali).toISOString().split("T")[0] : "",
        keterangan: j.keterangan || "",
        status: j.status || "Dipinjam",
      })
      setLoading(false)
    })
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      const res = await fetch(`/api/peminjaman/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          peminjam: form.peminjam,
          tanggalPinjam: form.tanggalPinjam,
          tanggalKembali: form.tanggalKembali || null,
          keterangan: form.keterangan || null,
          status: form.status,
        }),
      })
      if (!res.ok) { const j = await res.json(); throw new Error(j.error || "Gagal menyimpan") }
      router.push(`/peminjaman/${id}`)
    } catch (e: any) { setError(e.message) } finally { setSubmitting(false) }
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  if (loading) return <LoadingState text="Memuat data peminjaman..." />

  return (
    <div>
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <BackLink href={`/peminjaman/${id}`} />
        <span className="text-[0.7rem] sm:text-sm font-bold text-muted uppercase tracking-wider">Peminjaman</span>
      </div>

      <PageHeader
        index="03"
        title="Edit Peminjaman"
        desc="Perbarui data peminjaman aset"
      />

      {error && <ErrorBanner message={error} />}

      <form onSubmit={handleSubmit}>
        <FormCard
          title="Form Peminjaman"
          icon={ArrowRightLeft}
          footer={
            <>
              <ButtonLink href={`/peminjaman/${id}`} variant="dark">Batal</ButtonLink>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            <div className="space-y-4 sm:space-y-5">
              <Field label="Peminjam" required>
                <Input type="text" required value={form.peminjam} onChange={set("peminjam")} />
              </Field>
              <Field label="Tanggal Pinjam" required>
                <Input type="date" required value={form.tanggalPinjam} onChange={set("tanggalPinjam")} />
              </Field>
              <Field label="Status">
                <Select value={form.status} onChange={set("status")}>
                  <option value="Dipinjam">Dipinjam</option>
                  <option value="Dikembalikan">Dikembalikan</option>
                </Select>
              </Field>
            </div>
            <div className="space-y-4 sm:space-y-5">
              <Field label="Tanggal Kembali">
                <Input type="date" value={form.tanggalKembali} onChange={set("tanggalKembali")} />
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