"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Users } from "lucide-react"
import {
  PageHeader, BackLink, ErrorBanner, FormCard, Field,
  Input, Textarea, Button, ButtonLink, LoadingState,
} from "@/components/ui"

export default function KomisiEdit() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ namaKomisi: "", keterangan: "" })

  useEffect(() => {
    fetch(`/api/komisi/${params.id}`).then(r => r.json()).then(j => {
      setForm({ namaKomisi: j.namaKomisi || "", keterangan: j.keterangan || "" })
      setFetching(false)
    })
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/komisi/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) { const j = await res.json(); throw new Error(j.error || "Gagal menyimpan") }
      router.push(`/komisi/${params.id}`)
    } catch (e: any) { setError(e.message) } finally { setLoading(false) }
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  if (fetching) return <LoadingState text="Memuat data komisi..." />

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <BackLink href={`/komisi/${params.id}`} />
        <span className="text-sm font-bold text-muted uppercase tracking-wider">Komisi</span>
      </div>

      <PageHeader
        index="08"
        title="Edit Komisi"
        desc="Perbarui data komisi"
      />

      {error && <ErrorBanner message={error} />}

      <form onSubmit={handleSubmit}>
        <FormCard
          title="Form Komisi"
          icon={Users}
          footer={
            <>
              <ButtonLink href={`/komisi/${params.id}`} variant="dark">Batal</ButtonLink>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </>
          }
        >
          <div className="space-y-5">
            <Field label="Nama Komisi" required>
              <Input type="text" required value={form.namaKomisi} onChange={set("namaKomisi")} />
            </Field>
            <Field label="Keterangan">
              <Textarea rows={4} value={form.keterangan} onChange={set("keterangan")} />
            </Field>
          </div>
        </FormCard>
      </form>
    </div>
  )
}