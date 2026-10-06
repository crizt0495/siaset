"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Eye, Pencil, Trash2, Shield } from "lucide-react"
import {
  PageHeader, AddButton, Card, DataList, ListActions, ListIndex,
  Pagination, ConfirmModal, Input, Select, Badge, Label,
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
        <div className="p-3 border-b-[3px] border-ink bg-paper2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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

        <DataList<Pengguna>
          rows={data}
          getKey={(u) => u.id}
          page={page}
          perPage={10}
          loading={loading}
          emptyIcon={Shield}
          emptyText="Tidak ada data pengguna"
          columns={[
            {
              header: "No",
              render: (_u, i) => <ListIndex value={i + 1} />,
              className: "!w-12 font-bold text-muted",
              headClassName: "!w-12",
            },
            {
              header: "Nama Lengkap",
              render: (u) => (
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-8 h-8 shrink-0 grid place-items-center bg-warn border-2 border-ink font-display text-sm">
                    {u.namaLengkap?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                  <span className="font-bold truncate">{u.namaLengkap}</span>
                </div>
              ),
              slot: "title",
            },
            {
              header: "Username",
              render: (u) => <span className="font-mono text-xs font-bold">@{u.username}</span>,
              slot: "subtitle",
            },
            {
              header: "Role",
              render: (u) => <Badge color={roleColor[u.roles?.[0]?.name] || "default"}>{u.roles?.[0]?.name || "-"}</Badge>,
              slot: "chip",
            },
            {
              header: "Status",
              render: (u) => <Badge color={u.active ? "green" : "gray"}>{u.active ? "Active" : "Inactive"}</Badge>,
              slot: "chip",
            },
            {
              header: "Komisi",
              render: (u) => <span className="text-muted font-semibold">{u.komisi?.namaKomisi || "-"}</span>,
            },
            {
              header: "Aksi",
              render: (u) => (
                <ListActions>
                  <Link href={`/pengguna/${u.id}`} className="brut-iconbtn brut-iconbtn-primary" title="Detail" aria-label="Detail"><Eye className="w-4 h-4" strokeWidth={2.75} /></Link>
                  <Link href={`/pengguna/${u.id}/edit`} className="brut-iconbtn brut-iconbtn-warn" title="Edit" aria-label="Edit"><Pencil className="w-4 h-4" strokeWidth={2.75} /></Link>
                  <button onClick={() => setDeleteId(u.id)} className="brut-iconbtn brut-iconbtn-danger" title="Hapus" aria-label="Hapus"><Trash2 className="w-4 h-4" strokeWidth={2.75} /></button>
                </ListActions>
              ),
              slot: "actions",
              className: "!text-right",
              headClassName: "!text-right",
            },
          ]}
        />

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
