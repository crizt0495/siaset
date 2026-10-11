"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import {
  PageHeader, BackLink, LoadingState, EmptyState, Card, Label,
  ButtonLink, Button, ConfirmModal, DetailRow as Row,
} from "@/components/ui"

import { useAuthz } from "@/hooks/useAuthz"

export default function PenghapusanDetail() {
  const params = useParams()
  const { can } = useAuthz()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch(`/api/penghapusan/${params.id}`).then(r => r.json()).then(j => { setData(j); setLoading(false) })
  }, [params.id])

  const handleDelete = async () => {
    setDeleting(true)
    await fetch(`/api/penghapusan/${params.id}`, { method: "DELETE" })
    router.push("/penghapusan")
  }

  if (loading) return <LoadingState text="Memuat data penghapusan..." />
  if (!data) return <EmptyState text="Data tidak ditemukan" />

  return (
    <div>
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <BackLink href="/penghapusan" />
        <span className="text-[0.7rem] sm:text-sm font-bold text-muted uppercase tracking-wider">Penghapusan</span>
      </div>

      <PageHeader
        index="05"
        title="Detail Penghapusan"
        desc="Pengeluaran aset dari inventaris"
        extra={<Label color="red">05 · Penghapusan</Label>}
      >
        {can("edit_penghapusan") && (
          <ButtonLink href={`/penghapusan/${data.id}/edit`} variant="warn">Edit</ButtonLink>
        )}
        {can("delete_penghapusan") && (
          <Button variant="danger" onClick={() => setShowDelete(true)}>Hapus</Button>
        )}
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        <Card title="Informasi Penghapusan" sub="Data penghapusan" icon={Trash2}>
          <Row label="Tanggal Penghapusan" value={new Date(data.tanggalPenghapusan).toLocaleDateString("id-ID")} />
          <Row label="Alasan" value={data.alasan} />
          <Row label="Keterangan" value={data.keterangan || "-"} />
        </Card>

        <Card title="Informasi Barang" sub="Data aset terkait" icon={Trash2}>
          <Row label="Kode Barang" value={<span className="font-mono">{data.barang?.kodeBarang || "-"}</span>} />
          <Row label="Nama Barang" value={data.barang?.namaBarang || "-"} />
          <Row label="Komisi" value={data.barang?.komisi?.namaKomisi || "-"} />
          <Row label="Kondisi" value={data.barang?.kondisi || "-"} />
          <Row label="Lokasi" value={data.barang?.lokasi || "-"} />
          <Row label="Jumlah" value={data.barang?.jumlah ?? "-"} />
          <Row label="Status" value={data.barang?.status || "-"} />
        </Card>

        {data.user && (
          <Card title="Dicatat oleh" sub="Pencatat data" icon={Trash2} className="lg:col-span-2">
            <Row label="Nama" value={data.user.namaLengkap || "-"} />
          </Card>
        )}
      </div>

      <ConfirmModal
        open={showDelete}
        title="Hapus Penghapusan?"
        message="Data yang dihapus tidak dapat dikembalikan."
        onCancel={() => setShowDelete(false)}
        onConfirm={handleDelete}
        label={deleting ? "Menghapus..." : "Hapus"}
      />
    </div>
  )
}