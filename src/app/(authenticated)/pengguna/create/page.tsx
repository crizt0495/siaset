"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Shield } from "lucide-react"
import {
  PageHeader, BackLink, ErrorBanner, FormCard, Field,
  Input, Select, Button, ButtonLink,
} from "@/components/ui"

interface Komisi { id: string; namaKomisi: string }
interface Role { id: string; name: string }

export default function PenggunaCreate() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [komisiList, setKomisiList] = useState<Komisi[]>([])
  const [roleList, setRoleList] = useState<Role[]>([])
  const [form, setForm] = useState({
    namaLengkap: "", username: "", password: "", komisiId: "", roleId: "",
  })

  useEffect(() => {
    Promise.all([
      fetch("/api/komisi").then(r => r.json()),
      fetch("/api/roles").then(r => r.json()),
    ]).then(([komisi, roles]) => {
      setKomisiList(komisi.data || [])
      setRoleList(roles.data || [])
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/pengguna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          namaLengkap: form.namaLengkap,
          username: form.username,
          password: form.password,
          komisiId: form.komisiId || null,
          roleIds: form.roleId ? [form.roleId] : [],
        }),
      })
      if (!res.ok) { const j = await res.json(); throw new Error(j.error || "Gagal menyimpan") }
      router.push("/pengguna")
    } catch (e: any) { setError(e.message) } finally { setLoading(false) }
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <BackLink href="/pengguna" />
        <span className="text-sm font-bold text-muted uppercase tracking-wider">Pengguna</span>
      </div>

      <PageHeader
        index="09"
        title="Tambah Pengguna"
        desc="Buat akun untuk pengelola aplikasi"
      />

      {error && <ErrorBanner message={error} />}

      <form onSubmit={handleSubmit}>
        <FormCard
          title="Form Pengguna"
          icon={Shield}
          className="max-w-2xl"
          footer={
            <>
              <ButtonLink href="/pengguna" variant="dark">Batal</ButtonLink>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </>
          }
        >
          <div className="space-y-5">
            <Field label="Nama Lengkap" required>
              <Input type="text" required value={form.namaLengkap} onChange={set("namaLengkap")} placeholder="Nama lengkap pengguna" />
            </Field>
            <Field label="Username" required>
              <Input type="text" required value={form.username} onChange={set("username")} />
            </Field>
            <Field label="Password" required>
              <Input type="password" required value={form.password} onChange={set("password")} />
            </Field>
            <Field label="Komisi">
              <Select value={form.komisiId} onChange={set("komisiId")}>
                <option value="">Pilih Komisi</option>
                {komisiList.map(k => <option key={k.id} value={k.id}>{k.namaKomisi}</option>)}
              </Select>
            </Field>
            <Field label="Role" required>
              <Select required value={form.roleId} onChange={set("roleId")}>
                <option value="">Pilih Role</option>
                {roleList.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </Select>
            </Field>
          </div>
        </FormCard>
      </form>
    </div>
  )
}