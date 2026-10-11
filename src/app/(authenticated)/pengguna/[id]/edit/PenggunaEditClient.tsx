"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Shield } from "lucide-react"
import {
  PageHeader, BackLink, ErrorBanner, FormCard, Field,
  Input, Select, Button, ButtonLink, LoadingState,
} from "@/components/ui"

import SuperadminOnly from "@/components/SuperadminOnly"

interface Komisi { id: string; namaKomisi: string }
interface Role { id: string; name: string }

export default function PenggunaEdit() {
  return (
    <SuperadminOnly>
      <PenggunaEditContent />
    </SuperadminOnly>
  )
}

function PenggunaEditContent() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [komisiList, setKomisiList] = useState<Komisi[]>([])
  const [roleList, setRoleList] = useState<Role[]>([])
  const [form, setForm] = useState({
    namaLengkap: "", username: "", password: "", komisiId: "", roleId: "", active: true,
  })

  useEffect(() => {
    Promise.all([
      fetch(`/api/pengguna/${params.id}`).then(r => r.json()),
      fetch("/api/komisi").then(r => r.json()),
      fetch("/api/roles").then(r => r.json()),
    ]).then(([user, komisi, roles]) => {
      setForm({
        namaLengkap: user.namaLengkap || "",
        username: user.username || "",
        password: "",
        komisiId: user.komisiId || "",
        roleId: user.roles?.[0]?.id || "",
        active: user.active ?? true,
      })
      setKomisiList(komisi.data || [])
      setRoleList(roles.data || [])
      setFetching(false)
    })
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const body: Record<string, unknown> = {
        namaLengkap: form.namaLengkap,
        username: form.username,
        komisiId: form.komisiId || null,
        roleIds: form.roleId ? [form.roleId] : [],
        active: form.active,
      }
      if (form.password) body.password = form.password
      const res = await fetch(`/api/pengguna/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) { const j = await res.json(); throw new Error(j.error || "Gagal menyimpan") }
      router.push(`/pengguna/${params.id}`)
    } catch (e: any) { setError(e.message) } finally { setLoading(false) }
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  if (fetching) return <LoadingState text="Memuat data pengguna..." />

  return (
    <div>
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <BackLink href={`/pengguna/${params.id}`} />
        <span className="text-[0.7rem] sm:text-sm font-bold text-muted uppercase tracking-wider">Pengguna</span>
      </div>

      <PageHeader
        index="09"
        title="Edit Pengguna"
        desc="Perbarui data akun"
      />

      {error && <ErrorBanner message={error} />}

      <form onSubmit={handleSubmit}>
        <FormCard
          title="Form Pengguna"
          icon={Shield}
          className="max-w-2xl"
          footer={
            <>
              <ButtonLink href={`/pengguna/${params.id}`} variant="dark">Batal</ButtonLink>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </>
          }
        >
          <div className="space-y-4 sm:space-y-5">
            <Field label="Nama Lengkap" required>
              <Input type="text" required value={form.namaLengkap} onChange={set("namaLengkap")} />
            </Field>
            <Field label="Username" required>
              <Input type="text" required value={form.username} onChange={set("username")} />
            </Field>
            <Field label="Password" hint="Kosongkan jika tidak diubah">
              <Input type="password" value={form.password} onChange={set("password")} placeholder="Kosongkan jika tidak diubah" />
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
            <Field label="Status" required>
              <Select value={form.active ? "true" : "false"} onChange={e => setForm(prev => ({ ...prev, active: e.target.value === "true" }))}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Select>
            </Field>
          </div>
        </FormCard>
      </form>
    </div>
  )
}