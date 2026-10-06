"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { MapPin, ArrowDown, Package, Calendar } from "lucide-react"
import {
  PageHeader, BackLink, LoadingState, EmptyState, Card, Label,
  ButtonLink, Button, ConfirmModal, DetailRow as Row,
} from "@/components/ui"

interface MutasiDetail {
  id: string
  lokasiAsal: string
  lokasiTujuan: string
  tanggalMutasi: string
  keterangan: string | null
  createdAt: string
  barang: {
    id: string
    namaBarang: string
    kodeBarang: string
    lokasi: string
    kondisi: string
    komisi?: { namaKomisi: string } | null
  }
  user: {
    id: string
    namaLengkap: string
  } | null
}

export default function MutasiDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [data, setData] = useState<MutasiDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showDelete, setShowDelete] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/mutasi/${params.id}`)
        if (!res.ok) throw new Error("Mutasi tidak ditemukan")
        const json = await res.json()
        setData(json)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.id])

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/mutasi/${params.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Gagal menghapus")
      router.push("/mutasi")
    } catch (e: any) {
      alert(e.message)
      setDeleteLoading(false)
    }
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })

  if (loading) return <LoadingState text="Memuat data mutasi..." />

  if (error) return <EmptyState text={error} />

  if (!data) return null

  return (
    <div>
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <BackLink href="/mutasi" />
        <span className="text-[0.7rem] sm:text-sm font-bold text-muted uppercase tracking-wider">Mutasi</span>
      </div>

      <PageHeader
        index="04"
        title="Detail Mutasi"
        desc="Perpindahan lokasi aset"
        extra={<Label color="blue">04 · Mutasi</Label>}
      >
        <ButtonLink href={`/mutasi/${data.id}/edit`} variant="warn">Edit</ButtonLink>
        <Button variant="danger" onClick={() => setShowDelete(true)}>
          {deleteLoading ? "Menghapus..." : "Hapus"}
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <Card title="Informasi Mutasi" sub="Data mutasi" icon={Calendar} className="mb-0">
          <Row label="Barang" value={`${data.barang.namaBarang} (${data.barang.kodeBarang})`} />
          <Row label="Tanggal Mutasi" value={formatDate(data.tanggalMutasi)} />
          <Row label="Dilakukan Oleh" value={data.user?.namaLengkap || "-"} />
          <Row label="Terakhir Diperbarui" value={formatDateTime(data.createdAt)} />
        </Card>

        <div className="brut-card p-6 bg-warn flex flex-col items-center justify-center text-center">
          <p className="text-[0.65rem] font-bold uppercase tracking-widest mb-5">Pergerakan Lokasi</p>
          <div className="brut-card bg-card px-6 py-4 -rotate-1">
            <MapPin className="w-5 h-5 mx-auto mb-1" strokeWidth={3} />
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Asal</p>
            <p className="brut-title brut-h3 mt-0.5">{data.lokasiAsal}</p>
          </div>
          <ArrowDown className="w-6 h-6 my-3 rotate-0" strokeWidth={3} />
          <div className="brut-card bg-primary text-white px-6 py-4 rotate-1">
            <MapPin className="w-5 h-5 mx-auto mb-1" strokeWidth={3} />
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">Tujuan</p>
            <p className="brut-title brut-h3 mt-0.5">{data.lokasiTujuan}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card title="Keterangan" sub="Catatan mutasi" icon={Package}>
          <p className="text-sm font-semibold whitespace-pre-wrap text-ink">{data.keterangan || "Tidak ada keterangan."}</p>
        </Card>

        <Card title="Informasi Barang" sub="Data terkait" icon={Package}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
            <Row label="Nama Barang" value={data.barang.namaBarang} />
            <Row label="Kode Barang" value={<span className="font-mono">{data.barang.kodeBarang}</span>} />
            <Row label="Lokasi Saat Ini" value={data.barang.lokasi} />
            <Row label="Kondisi" value={data.barang.kondisi} />
          </div>
          <div className="mt-5">
            <ButtonLink href={`/barang/${data.barang.id}`} variant="primary">Lihat Detail Barang</ButtonLink>
          </div>
        </Card>
      </div>

      <ConfirmModal
        open={showDelete}
        title="Hapus Mutasi?"
        message="Lokasi barang tidak akan dikembalikan otomatis."
        onCancel={() => setShowDelete(false)}
        onConfirm={handleDelete}
        label={deleteLoading ? "Menghapus..." : "Hapus"}
      />
    </div>
  )
}