"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ArrowRightLeft, RotateCcw, Package } from "lucide-react"
import {
  PageHeader, BackLink, LoadingState, EmptyState, Card, Label,
  Badge, ButtonLink, Button, DetailRow as Row,
} from "@/components/ui"

interface Peminjaman {
  id: string; barangId: string; jumlahDipinjam: number; peminjam: string
  tanggalPinjam: string; tanggalKembali: string | null; keterangan: string | null
  status: string; createdAt: string
  barang: { id: string; kodeBarang: string; namaBarang: string; jumlah: number; kondisi: string; lokasi: string; komisi?: { namaKomisi: string } | null }
  createdByUser?: { id: string; namaLengkap: string } | null
}

export default function PeminjamanDetail() {
  const params = useParams()
  const id = params.id as string
  const [data, setData] = useState<Peminjaman | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/peminjaman/${id}`).then(r => r.json()).then(j => { setData(j); setLoading(false) })
  }, [id])

  const handleKembalikan = async () => {
    await fetch(`/api/peminjaman/${id}/kembalikan`, { method: "POST" })
    const res = await fetch(`/api/peminjaman/${id}`)
    const j = await res.json()
    setData(j)
  }

  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"
  const formatDateTime = (d: string) => new Date(d).toLocaleString("id-ID")

  if (loading) return <LoadingState text="Memuat data peminjaman..." />
  if (!data) return <EmptyState text="Data tidak ditemukan" />

  return (
    <div>
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <BackLink href="/peminjaman" />
        <span className="text-[0.7rem] sm:text-sm font-bold text-muted uppercase tracking-wider">Peminjaman</span>
      </div>

      <PageHeader
        index="03"
        title="Detail Peminjaman"
        desc="Riwayat peminjaman aset"
        extra={<Label color="yellow">03 · Peminjaman</Label>}
      >
        {data.status === "Dipinjam" && (
          <Button variant="good" onClick={handleKembalikan}>
            <RotateCcw className="w-4 h-4" strokeWidth={3} /> Kembalikan
          </Button>
        )}
        <ButtonLink href={`/peminjaman/${id}/edit`} variant="warn">Edit</ButtonLink>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        <Card title="Informasi Peminjaman" sub="Data peminjaman" icon={ArrowRightLeft}>
          <Row label="Peminjam" value={data.peminjam} />
          <Row label="Jumlah Dipinjam" value={<span className="brut-num text-lg">{data.jumlahDipinjam} unit</span>} />
          <Row label="Tanggal Pinjam" value={formatDate(data.tanggalPinjam)} />
          <Row label="Tanggal Kembali" value={formatDate(data.tanggalKembali)} />
          <Row label="Status" value={<Badge color={data.status === "Dipinjam" ? "yellow" : "green"}>{data.status}</Badge>} />
          {data.keterangan && <Row label="Keterangan" value={data.keterangan} />}
        </Card>

        <Card title="Informasi Barang" sub="Data aset yang dipinjam" icon={Package}>
          <Row label="Nama Barang" value={data.barang.namaBarang} />
          <Row label="Kode Barang" value={<span className="font-mono">{data.barang.kodeBarang}</span>} />
          <Row label="Komisi" value={data.barang.komisi?.namaKomisi || "-"} />
          <Row label="Kondisi" value={data.barang.kondisi} />
          <Row label="Lokasi" value={data.barang.lokasi} />
          <Row label="Sisa Stok" value={<span className="brut-num">{data.barang.jumlah} unit</span>} />
        </Card>

        <Card title="Informasi Lainnya" sub="Data pencatatan" icon={ArrowRightLeft} className="lg:col-span-2">
          <Row label="Dibuat Oleh" value={data.createdByUser?.namaLengkap || "-"} />
          <Row label="Waktu Dibuat" value={formatDateTime(data.createdAt)} />
        </Card>
      </div>
    </div>
  )
}