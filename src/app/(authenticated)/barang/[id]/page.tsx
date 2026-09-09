"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Package, History } from "lucide-react"
import {
  PageHeader, BackLink, LoadingState, EmptyState, Card, Label,
  Badge, ButtonLink,
} from "@/components/ui"

const kondisiColor: Record<string, "green" | "red" | "yellow" | "default"> = {
  Baik: "green", Rusak: "red", Hilang: "yellow",
}
const statusColor: Record<string, "blue" | "yellow" | "default"> = {
  Aktif: "blue", Nonaktif: "yellow",
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b-2 border-ink/10 last:border-0">
      <span className="text-xs font-bold text-muted uppercase tracking-wider shrink-0">{label}</span>
      <span className="text-sm font-bold text-right break-words">{value}</span>
    </div>
  )
}

export default function BarangDetail() {
  const params = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/barang/${params.id}`).then(r => r.json()).then(j => { setData(j); setLoading(false) })
  }, [params.id])

  if (loading) return <LoadingState text="Memuat data barang..." />
  if (!data) return <EmptyState text="Data tidak ditemukan" />

  const formatRupiah = (v: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(v)

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <BackLink href="/barang" />
        <span className="text-sm font-bold text-muted uppercase tracking-wider">Barang & Aset</span>
      </div>

      <PageHeader
        index="02"
        title={data.namaBarang || "Detail Barang"}
        desc={`${data.kodeBarang || ""} · ${data.komisi?.namaKomisi || "-"}`}
        extra={<Label color="blue">02 · Manajemen Aset</Label>}
      >
        <ButtonLink href={`/barang/${data.id}/edit`} variant="warn">Edit</ButtonLink>
      </PageHeader>

      <Card
        title="Informasi Barang"
        sub="Data pokok aset"
        icon={Package}
        className="mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div>
            <Row label="Kode Barang" value={<span className="font-mono">{data.kodeBarang}</span>} />
            <Row label="Nama Barang" value={data.namaBarang} />
            <Row label="Komisi" value={data.komisi?.namaKomisi || "-"} />
            <Row label="Kondisi" value={<Badge color={kondisiColor[data.kondisi] || "default"}>{data.kondisi}</Badge>} />
            <Row label="Status" value={<Badge color={statusColor[data.status] || "default"}>{data.status}</Badge>} />
            <Row label="Jumlah" value={<span className="brut-num text-lg">{data.jumlah}</span>} />
          </div>
          <div>
            <Row label="Lokasi" value={data.lokasi} />
            <Row label="Tanggal Perolehan" value={new Date(data.tanggalPerolehan).toLocaleDateString("id-ID")} />
            <Row label="Sumber Perolehan" value={data.sumberPerolehan || "-"} />
            <Row label="Harga Perolehan" value={formatRupiah(Number(data.hargaPerolehan))} />
            <Row label="Spesifikasi" value={data.spesifikasi || "-"} />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Riwayat Peminjaman"
          sub={data.peminjaman?.length > 0 ? `${data.peminjaman.length} catatan` : "Belum ada"}
          icon={History}
        >
          {data.peminjaman?.length > 0 ? (
            <div>
              {data.peminjaman.map((p: any) => (
                <div key={p.id} className="flex justify-between items-center gap-3 py-2.5 border-b-2 border-ink/10 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{p.peminjam}</p>
                    <p className="text-xs text-muted font-semibold">{new Date(p.tanggalPinjam).toLocaleDateString("id-ID")} · {p.jumlahDipinjam} unit</p>
                  </div>
                  <Badge color={p.status === "Dipinjam" ? "yellow" : "green"}>{p.status}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={History} text="Belum ada peminjaman" />
          )}
        </Card>

        <Card
          title="Riwayat Mutasi"
          sub={data.mutasi?.length > 0 ? `${data.mutasi.length} catatan` : "Belum ada"}
          icon={Package}
        >
          {data.mutasi?.length > 0 ? (
            <div>
              {data.mutasi.map((m: any) => (
                <div key={m.id} className="py-2.5 border-b-2 border-ink/10 last:border-0">
                  <p className="text-sm font-bold">{m.lokasiAsal} <span className="text-primary">→</span> {m.lokasiTujuan}</p>
                  <p className="text-xs text-muted font-semibold">{new Date(m.tanggalMutasi).toLocaleDateString("id-ID")}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Package} text="Belum ada mutasi" />
          )}
        </Card>
      </div>
    </div>
  )
}