"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Repeat } from "lucide-react"
import {
  PageHeader, BackLink, ErrorBanner, FormCard, Field,
  Input, Select, Textarea, Button, ButtonLink,
} from "@/components/ui"

interface Barang {
  id: string
  kodeBarang: string
  namaBarang: string
  lokasi: string
}

export default function MutasiCreate() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [barangList, setBarangList] = useState<Barang[]>([])
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    barangId: "",
    lokasiTujuan: "",
    tanggalMutasi: new Date().toISOString().split('T')[0],
    keterangan: "",
  })

  useEffect(() => {
    fetch("/api/barang?limit=1000&status=Aktif")
      .then(r => r.json())
      .then(j => setBarangList(j.data || []))
      .catch(e => console.error("Failed to fetch barang:", e))
  }, [])

  const selectedBarang = barangList.find(b => b.id === form.barangId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/mutasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tanggalMutasi: new Date(form.tanggalMutasi).toISOString(),
        }),
      })

      if (!res.ok) {
        const j = await res.json()
        throw new Error(j.error || "Gagal menyimpan mutasi")
      }

      router.push("/mutasi")
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <BackLink href="/mutasi" />
        <span className="text-sm font-bold text-muted uppercase tracking-wider">Mutasi</span>
      </div>

      <PageHeader
        index="04"
        title="Tambah Mutasi Barang"
        desc="Pindahkan aset ke lokasi baru"
      />

      {error && <ErrorBanner message={error} />}

      <form onSubmit={handleSubmit}>
        <FormCard
          title="Form Mutasi"
          icon={Repeat}
          footer={
            <>
              <ButtonLink href="/mutasi" variant="dark">Batal</ButtonLink>
              <Button type="submit" variant="primary" disabled={loading || !form.barangId}>
                {loading ? "Menyimpan..." : "Simpan Mutasi"}
              </Button>
            </>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-5">
              <Field label="Pilih Barang" required>
                <Select required value={form.barangId} onChange={set("barangId")}>
                  <option value="">-- Pilih Barang --</option>
                  {barangList.map(b => (
                    <option key={b.id} value={b.id}>{b.kodeBarang} - {b.namaBarang}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Lokasi Asal (Otomatis)" hint="Lokasi asal diambil otomatis dari data barang saat ini.">
                <Input type="text" readOnly value={selectedBarang?.lokasi || "-"} className="opacity-60 cursor-not-allowed" />
              </Field>
            </div>

            <div className="space-y-5">
              <Field label="Lokasi Tujuan" required>
                <Input type="text" required value={form.lokasiTujuan} onChange={set("lokasiTujuan")} placeholder="Masukkan lokasi tujuan baru" />
              </Field>
              <Field label="Tanggal Mutasi" required>
                <Input type="date" required value={form.tanggalMutasi} onChange={set("tanggalMutasi")} />
              </Field>
            </div>

            <div className="lg:col-span-2">
              <Field label="Keterangan / Alasan Mutasi">
                <Textarea rows={3} value={form.keterangan} onChange={set("keterangan")} placeholder="Tambahkan catatan jika diperlukan..." />
              </Field>
            </div>
          </div>
        </FormCard>
      </form>
    </div>
  )
}