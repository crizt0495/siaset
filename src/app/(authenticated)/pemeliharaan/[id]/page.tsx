"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Wrench } from "lucide-react"
import {
  PageHeader, BackLink, LoadingState, EmptyState, Card, Label,
  ButtonLink,
} from "@/components/ui"

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b-2 border-ink/10 last:border-0">
      <span className="text-xs font-bold text-muted uppercase tracking-wider shrink-0">{label}</span>
      <span className="text-sm font-bold text-right break-words">{value}</span>
    </div>
  )
}

export default function PemeliharaanDetail() {
  const params = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/pemeliharaan/${params.id}`).then(r => r.json()).then(j => { setData(j); setLoading(false) })
  }, [params.id])

  if (loading) return <LoadingState text="Memuat data pemeliharaan..." />
  if (!data) return <EmptyState text="Data tidak ditemukan" />

  const formatRupiah = (v: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(v)

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <BackLink href="/pemeliharaan" />
        <span className="text-sm font-bold text-muted uppercase tracking-wider">Pemeliharaan</span>
      </div>

      <PageHeader
        index="06"
        title="Detail Pemeliharaan"
        desc="Riwayat perawatan aset"
        extra={<Label color="green">06 · Pemeliharaan</Label>}
      >
        <ButtonLink href={`/pemeliharaan/${data.id}/edit`} variant="warn">Edit</ButtonLink>
      </PageHeader>

      <Card
        title="Informasi Pemeliharaan"
        sub="Data perawatan aset"
        icon={Wrench}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div>
            <Row label="Barang" value={data.barang ? `${data.barang.kodeBarang} - ${data.barang.namaBarang}` : "-"} />
            <Row label="Komisi" value={data.barang?.komisi?.namaKomisi || "-"} />
            <Row label="Tanggal" value={new Date(data.tanggal).toLocaleDateString("id-ID")} />
          </div>
          <div>
            <Row label="Biaya" value={<span className="brut-num text-lg">{formatRupiah(Number(data.biaya))}</span>} />
            <Row label="Keterangan" value={data.keterangan || "-"} />
            <Row label="Dicatat Oleh" value={data.user?.namaLengkap || "-"} />
            <Row label="Tanggal Input" value={new Date(data.createdAt).toLocaleDateString("id-ID")} />
          </div>
        </div>
      </Card>
    </div>
  )
}