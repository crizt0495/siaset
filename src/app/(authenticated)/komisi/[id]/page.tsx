"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Users, Package } from "lucide-react"
import {
  PageHeader, BackLink, LoadingState, EmptyState, Card, Label,
  Badge, ButtonLink, DetailRow as Row,
} from "@/components/ui"

export default function KomisiDetail() {
  const params = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/komisi/${params.id}`).then(r => r.json()).then(j => { setData(j); setLoading(false) })
  }, [params.id])

  if (loading) return <LoadingState text="Memuat data komisi..." />
  if (!data) return <EmptyState text="Data tidak ditemukan" />

  return (
    <div>
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <BackLink href="/komisi" />
        <span className="text-[0.7rem] sm:text-sm font-bold text-muted uppercase tracking-wider">Komisi</span>
      </div>

      <PageHeader
        index="08"
        title={data.namaKomisi || "Detail Komisi"}
        desc="Informasi komisi"
        extra={<Label color="purple">08 · Komisi</Label>}
      >
        <ButtonLink href={`/komisi/${data.id}/edit`} variant="warn">Edit</ButtonLink>
      </PageHeader>

      <Card
        title="Informasi Komisi"
        sub="Ringkasan komisi"
        icon={Users}
        className="mb-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
          <div>
            <Row label="Nama Komisi" value={data.namaKomisi} />
            <Row label="Keterangan" value={data.keterangan || "-"} />
          </div>
          <div>
            <Row label="Jumlah Anggota" value={<span className="brut-num text-lg">{data.users?.length ?? 0}</span>} />
            <Row label="Jumlah Barang" value={<span className="brut-num text-lg">{data.barang?.length ?? 0}</span>} />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        <Card
          title="Anggota"
          sub={data.users?.length > 0 ? `${data.users.length} orang` : "Belum ada"}
          icon={Users}
        >
          {data.users?.length > 0 ? (
            <div>
              {data.users.map((u: any) => (
                <div key={u.id} className="flex justify-between items-center gap-3 py-2.5 border-b-2 border-ink/10 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{u.namaLengkap}</p>
                    <p className="text-xs text-muted font-semibold">{u.username}</p>
                  </div>
                  <Badge color="blue">{u.role}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Users} text="Tidak ada anggota" />
          )}
        </Card>

        <Card
          title="Barang"
          sub={data.barang?.length > 0 ? `${data.barang.length} barang` : "Belum ada"}
          icon={Package}
        >
          {data.barang?.length > 0 ? (
            <div>
              {data.barang.map((b: any) => (
                <div key={b.id} className="flex justify-between items-center gap-3 py-2.5 border-b-2 border-ink/10 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{b.namaBarang}</p>
                    <p className="text-xs font-mono text-muted font-semibold">{b.kodeBarang}</p>
                  </div>
                  <span className="text-sm font-bold brut-num">{b.jumlah} unit</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Package} text="Tidak ada barang" />
          )}
        </Card>
      </div>
    </div>
  )
}