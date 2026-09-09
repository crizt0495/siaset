"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Eye, Pencil, Trash2, Shield } from "lucide-react"
import {
  PageHeader, AddButton, Card, Table, TH, TD, Tr, Pagination,
  ConfirmModal, Input, Select, EmptyState, Badge, Label,
} from "@/components/ui"

interface Pengguna {
  id: string; namaLengkap: string; username: string; roles: { id: string; name: string }[]; active: boolean
  komisi?: { namaKomisi: string } | null
}

const roleColor: Record<string, "purple" | "blue" | "green" | "default"> = {
  Superadmin: "purple",
  Admin: "blue",
  Komisi: "green",
}

const statusColor: Record<string, "green" | "gray" | "default"> = {
  Active: "green",
  Inactive: "gray",
}

export default function PenggunaList() {
  const [data, setData] = useState<Pengguna[]>([])
  const [search, setSearch] = useState("")
  const [filterRole, setFilterRole] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "10" })
    if (search) params.set("search", search)
    if (filterRole) params.set("role", filterRole)
    const res = await fetch(`/api/pengguna?${params}`)
    const json = await res.json()
    setData(json.data || [])
    setTotalPages(json.pagination?.totalPages || 1)
    setLoading(false)
  }, [page, search, filterRole])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDelete = async () => {
    if (!deleteId) return
    await fetch(`/api/pengguna/${deleteId}`, { method: "DELETE" })
    setDeleteId(null)
    fetchData()
  }

  return (
    <div>
      <PageHeader
        index="09"
        title="Pengguna"
        desc="Manajemen user dengan RBAC"
        extra={<Label color="purple">09 · Administrasi</Label>}
      >
        <AddButton href="/pengguna/create">Tambah Pengguna</AddButton>
      </PageHeader>

      <Card noPad>
        <div className="p-4 border-b-[3px] border-ink bg-paper2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" strokeWidth={3} />
              <Input type="text" placeholder="Cari pengguna..." value={search} className="!pl-10" onChange={e => { setSearch(e.target.value); setPage(1) }} />
            </div>
            <Select value={filterRole} onChange={e => { setFilterRole(e.target.value); setPage(1) }}>
              <option value="">Semua Role</option>
              <option value="Superadmin">Superadmin</option>
              <option value="Admin">Admin</option>
              <option value="Komisi">Komisi</option>
            </Select>
          </div>
        </div>

        <Table
          head={
            <tr>
              <TH className="!w-12">No</TH>
              <TH>Nama Lengkap</TH>
              <TH>Username</TH>
              <TH>Komisi</TH>
              <TH>Role</TH>
              <TH>Status</TH>
              <TH className="!text-right">Aksi</TH>
            </tr>
          }
        >
          {loading ? (
            <Tr><TD colSpan={7} className="!py-10 text-center text-muted font-bold">Memuat data...</TD></Tr>
          ) : data.length === 0 ? (
            <Tr><TD colSpan={7} className="!p-0"><EmptyState icon={Shield} text="Tidak ada data pengguna" /></TD></Tr>
          ) : data.map((u, i) => (
            <Tr key={u.id}>
              <TD className="font-bold text-muted">{(page - 1) * 10 + i + 1}</TD>
              <TD>
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 shrink-0 grid place-items-center bg-warn border-2 border-ink font-display text-sm">
                    {u.namaLengkap?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                  <span className="font-bold">{u.namaLengkap}</span>
                </div>
              </TD>
              <TD className="font-mono text-xs font-bold">{u.username}</TD>
              <TD className="text-muted font-semibold">{u.komisi?.namaKomisi || "-"}</TD>
              <TD><Badge color={roleColor[u.roles?.[0]?.name] || "default"}>{u.roles?.[0]?.name || "-"}</Badge></TD>
              <TD><Badge color={u.active ? statusColor.Active : statusColor.Inactive}>{u.active ? "Active" : "Inactive"}</Badge></TD>
              <TD>
                <div className="flex items-center justify-end gap-1.5">
                  <Link href={`/pengguna/${u.id}`} className="brut-iconbtn brut-iconbtn-primary" title="Detail"><Eye className="w-4 h-4" strokeWidth={2.75} /></Link>
                  <Link href={`/pengguna/${u.id}/edit`} className="brut-iconbtn brut-iconbtn-warn" title="Edit"><Pencil className="w-4 h-4" strokeWidth={2.75} /></Link>
                  <button onClick={() => setDeleteId(u.id)} className="brut-iconbtn brut-iconbtn-danger" title="Hapus"><Trash2 className="w-4 h-4" strokeWidth={2.75} /></button>
                </div>
              </TD>
            </Tr>
          ))}
        </Table>

        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </Card>

      <ConfirmModal
        open={!!deleteId}
        title="Hapus Pengguna?"
        message="Data yang dihapus tidak dapat dikembalikan."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}