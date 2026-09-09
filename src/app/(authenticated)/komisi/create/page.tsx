"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Users } from "lucide-react"
import {
  PageHeader, BackLink, ErrorBanner, FormCard, Field,
  Input, Textarea, Button, ButtonLink,
} from "@/components/ui"

export default function KomisiCreate() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ namaKomisi: "", keterangan: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/komisi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) { const j = await res.json(); throw new Error(j.error || "Gagal menyimpan") }
      router.push("/komisi")
    } catch (e: any) { setError(e.message) } finally { setLoading(false) }
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <BackLink href="/komisi" />
        <span className="text-sm font-bold text-muted uppercase tracking-wider">Komisi</span>
      </div>

      <PageHeader
        index="08"
        title="Tambah Komisi"
        desc="Buat komisi pelayanan / pengelola baru"
      />

      {error && <ErrorBanner message={error} />}

      <form onSubmit={handleSubmit}>
        <FormCard
          title="Form Komisi"
          icon={Users}
          footer={
            <>
              <ButtonLink href="/komisi" variant="dark">Batal</ButtonLink>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </>
          }
        >
          <div className="space-y-5">
            <Field label="Nama Komisi" required>
              <Input type="text" required value={form.namaKomisi} onChange={set("namaKomisi")} placeholder="Nama komisi" />
            </Field>
            <Field label="Keterangan">
              <Textarea rows={4} value={form.keterangan} onChange={set("keterangan")} placeholder="Deskripsi singkat komisi" />
            </Field>
          </div>
        </FormCard>
      </form>
    </div>
  )
}