"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { User } from "lucide-react"
import {
  PageHeader, BackLink, LoadingState, EmptyState, Card, Label,
  ButtonLink, DetailRow as Row,
} from "@/components/ui"

export default function PenggunaDetail() {
  const params = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/pengguna/${params.id}`).then(r => r.json()).then(j => { setData(j); setLoading(false) })
  }, [params.id])

  if (loading) return <LoadingState text="Memuat data pengguna..." />
  if (!data) return <EmptyState text="Data tidak ditemukan" />

  const roleColor: Record<string, string> = {
    Superadmin: "purple", Admin: "blue", Komisi: "green",
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <BackLink href="/pengguna" />
        <span className="text-[0.7rem] sm:text-sm font-bold text-muted uppercase tracking-wider">Pengguna</span>
      </div>

      <PageHeader
        index="09"
        title={data.namaLengkap || "Detail Pengguna"}
        desc={`@${data.username || ""}`}
        extra={<Label color="red">09 · Pengguna</Label>}
      >
        <ButtonLink href={`/pengguna/${data.id}/edit`} variant="warn">Edit</ButtonLink>
      </PageHeader>

      <Card
        title="Informasi Pengguna"
        sub="Data akun"
        icon={User}
        className="max-w-2xl"
      >
        <Row label="Nama Lengkap" value={data.namaLengkap} />
        <Row label="Username" value={<span className="font-mono">@{data.username}</span>} />
        <Row label="Role" value={
          <span className={`brut-badge ${roleColor[data.roles?.[0]?.name] ? `brut-badge-${roleColor[data.roles?.[0]?.name]}` : ""}`}>
            {data.roles?.[0]?.name || "-"}
          </span>
        } />
        <Row label="Komisi" value={data.komisi?.namaKomisi || "-"} />
        <Row label="Status" value={
          <span className={`brut-badge ${data.active ? "brut-badge-green" : ""}`}>
            {data.active ? "Active" : "Inactive"}
          </span>
        } />
        <Row label="Dibuat" value={new Date(data.createdAt).toLocaleDateString("id-ID")} />
      </Card>
    </div>
  )
}