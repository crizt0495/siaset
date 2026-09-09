"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Package } from "lucide-react"
import {
  PageHeader, BackLink, ErrorBanner, FormCard, Field,
  Input, Select, Textarea, Button, ButtonLink, LoadingState,
} from "@/components/ui"

interface Komisi { id: string; namaKomisi: string }

export default function BarangEdit() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [komisiList, setKomisiList] = useState<Komisi[]>([])
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    namaBarang: "", komisiId: "", jumlah: "1", tanggalPerolehan: "", sumberPerolehan: "",
    spesifikasi: "", kondisi: "Baik", lokasi: "", hargaPerolehan: "", status: "Aktif",
  })

  useEffect(() => {
    Promise.all([
      fetch(`/api/barang/${params.id}`).then(r => r.json()),
      fetch("/api/komisi").then(r => r.json()),
    ]).then(([barang, komisi]) => {
      setForm({
        namaBarang: barang.namaBarang || "",
        komisiId: barang.komisiId || "",
        jumlah: String(barang.jumlah || 0),
        tanggalPerolehan: barang.tanggalPerolehan ? new Date(barang.tanggalPerolehan).toISOString().split("T")[0] : "",
        sumberPerolehan: barang.sumberPerolehan || "",
        spesifikasi: barang.spesifikasi || "",
        kondisi: barang.kondisi || "Baik",
        lokasi: barang.lokasi || "",
        hargaPerolehan: String(Number(barang.hargaPerolehan) || 0),
        status: barang.status || "Aktif",
      })
      setKomisiList(komisi.data || [])
      setFetching(false)
    })
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/barang/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          komisiId: form.komisiId || null,
          jumlah: parseInt(form.jumlah) || 0,
          hargaPerolehan: parseFloat(form.hargaPerolehan) || 0,
          tanggalPerolehan: form.tanggalPerolehan || new Date().toISOString(),
        }),
      })
      if (!res.ok) { const j = await res.json(); throw new Error(j.error || "Gagal update") }
      router.push(`/barang/${params.id}`)
    } catch (e: any) { setError(e.message) } finally { setLoading(false) }
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  if (fetching) return <LoadingState text="Memuat data barang..." />

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <BackLink href={`/barang/${params.id}`} />
        <span className="text-sm font-bold text-muted uppercase tracking-wider">Barang & Aset</span>
      </div>

      <PageHeader
        index="02"
        title="Edit Barang"
        desc="Perbarui data aset"
      />

      {error && <ErrorBanner message={error} />}

      <form onSubmit={handleSubmit}>
        <FormCard
          title="Form Barang"
          icon={Package}
          footer={
            <>
              <ButtonLink href={`/barang/${params.id}`} variant="dark">Batal</ButtonLink>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-5">
              <Field label="Nama Barang" required>
                <Input type="text" required value={form.namaBarang} onChange={set("namaBarang")} />
              </Field>
              <Field label="Komisi">
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
                <Input type="text" value={form.sumberPerolehan} onChange={set("sumberPerolehan")} />
              </Field>
            </div>
            <div className="space-y-5">
              <Field label="Spesifikasi">
                <Textarea rows={3} value={form.spesifikasi} onChange={set("spesifikasi")} />
              </Field>
              <Field label="Kondisi">
                <Select value={form.kondisi} onChange={set("kondisi")}>
                  <option value="Baik">Baik</option><option value="Rusak">Rusak</option><option value="Hilang">Hilang</option>
                </Select>
              </Field>
              <Field label="Lokasi" required>
                <Input type="text" required value={form.lokasi} onChange={set("lokasi")} />
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