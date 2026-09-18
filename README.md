# SiAset GKJW - Sistem Inventaris Aset

Sistem Informasi Inventaris Aset untuk GKJW Jemaat Probolinggo. Dibangun ulang dari Laravel ke **Next.js 15 + TypeScript + Prisma + Neon (PostgreSQL)**.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon) via Prisma ORM
- **Auth**: NextAuth.js v5 (Credentials provider - username-based)
- **Styling**: Tailwind CSS v4
- **Charts**: Chart.js + react-chartjs-2
- **Icons**: Lucide React
- **Forms**: Native + Zod validation
- **Deployment**: Vercel

## ✨ Features

### Core Modules
- **Dashboard** - Statistik, chart aset per komisi/kondisi, aktivitas terbaru
- **Barang & Aset** - CRUD lengkap, QR code, foto, print kartu aset
- **Peminjaman** - Pinjam/Kembalikan dengan manajemen stok otomatis
- **Mutasi** - Perpindahan lokasi aset dengan update otomatis
- **Penghapusan** - Pencatatan aset hilang/rusak
- **Pemeliharaan** - Tracking biaya perawatan
- **Komisi** - Manajemen komisi/departemen
- **Pengguna** - Manajemen user dengan RBAC (Superadmin only)
- **Laporan** - Filter, chart, export data
- **Backup & Restore** - Buat backup SQL, download file, dan restore database (Superadmin only)

### Roles & Permissions
- **Superadmin** - Akses penuh (user management, backup, dll)
- **Admin** - CRUD aset, laporan, tapi tidak bisa manage user
- **Komisi** - View & create peminjaman/mutasi/pemeliharaan

## 📋 Prerequisites

- Node.js 20+
- PostgreSQL database (Neon recommended)
- npm/pnpm/yarn

## ⚙️ Installation

```bash
# Clone & install
cd siaset-gkjw-next
npm install

# Setup environment
cp .env.example .env
# Edit .env with your DATABASE_URL and NEXTAUTH_SECRET

# Generate Prisma client & push schema
npx prisma generate
npx prisma db push

# Seed database (optional)
npx prisma db seed

# Run development
npm run dev
```

## 🌐 Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (Neon) |
| `NEXTAUTH_SECRET` | Random secret for JWT signing |
| `NEXTAUTH_URL` | App URL (e.g. `https://your-app.vercel.app`) |
| `BACKUP_DIR` (opsional) | Folder penyimpanan file backup SQL (default `./backups`). Di Vercel set ke `/tmp` karena filesystem read-only |

Generate secret: `openssl rand -base64 32`

## 💾 Backup & Restore

Menu **Backup** (khusus Superadmin) di `/backup`:

- **Buat Backup** - menghasilkan dump SQL (skema + data) seluruh tabel dari database aktif dan menyimpannya ke folder `BACKUP_DIR`
- **Download SQL** - mengunduh file `.sql` untuk disimpan secara manual / dipindahkan ke server lain
- **Restore** - memilih file `.sql` dan menjalankannya untuk memulihkan database. Seluruh proses dijalankan dalam satu transaksi (gagal di tengah akan di-rollback). **Perhatian: restore menggantikan seluruh data saat ini.**
- **Hapus** - menghapus file backup yang tidak dibutuhkan

Backup hanya dapat dibuat/diunduh/dihapus/direstore oleh pengguna dengan role **Superadmin**. Semua aktivitas backup tercatat di log Aktivitas.

> Catatan Vercel: filesystem bersifat ephemeral & read-only, jadi gunakan `BACKUP_DIR=/tmp`. Backup tersimpan selama fungsi server masih hangat — selalu unduh file SQL-nya setelah membuat backup.

## 🗄️ Database Schema

Key models:
- **User** - namaLengkap, username (auth), komisiId, password, active
- **Komisi** - namaKomisi, keterangan
- **Barang** - kodeBarang, namaBarang, komisiId, spesifikasi, kondisi, lokasi, tanggalPerolehan, sumberPerolehan, hargaPerolehan, fotoBarang, qrCode, status, jumlah
- **Peminjaman** - barangId, jumlahDipinjam, peminjam, tanggalPinjam, tanggalKembali, status (Dipinjam/Dikembalikan)
- **Mutasi** - barangId, lokasiAsal, lokasiTujuan, tanggalMutasi
- **Penghapusan** - barangId, tanggalPenghapusan, alasan
- **Pemeliharaan** - barangId, tanggal, biaya, keterangan
- **Aktivitas** - userId, aktivitas, waktu, ipAddress, userAgent, meta
- **Role/Permission** - Spatie-style RBAC

## 🚀 Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `DATABASE_URL` (Neon PostgreSQL)
   - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (your Vercel URL)
4. Deploy!

Vercel will auto-run `prisma generate` via `vercel.json` build command.

## 🔐 Default Login (after seed)

| Role | Username | Password |
|------|----------|----------|
| Superadmin | `admin` | `password123` |
| Admin | `budi` | `password123` |
| Komisi | `siti` | `password123` |

## 📁 Project Structure

```
src/
├── app/
│   ├── (authenticated)/       # Protected routes
│   │   ├── dashboard/         # Dashboard page
│   │   ├── barang/            # Assets CRUD
│   │   ├── peminjaman/        # Borrowings CRUD
│   │   ├── mutasi/            # Transfers CRUD
│   │   ├── penghapusan/       # Disposals CRUD
│   │   ├── pemeliharaan/      # Maintenance CRUD
│   │   ├── komisi/            # Commissions CRUD
│   │   ├── pengguna/          # Users CRUD (Superadmin)
│   │   ├── reports/           # Reports
│   │   ├── backup/            # Backup management
│   │   └── layout.tsx         # Auth layout with Sidebar
│   ├── api/                   # API routes
│   ├── login/                 # Login page
│   └── layout.tsx             # Root layout
├── components/
│   ├── Sidebar.tsx            # Navigation + header
│   └── Providers.tsx          # SessionProvider
└── lib/
    ├── auth.ts                # NextAuth config
    └── prisma.ts              # Prisma client
prisma/
├── schema.prisma              # Database schema
└── seed.ts                    # Seed data
```

## 📜 Scripts

```bash
npm run dev       # Development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint
```

## 📄 License

Internal project for GKJW Probolinggo.

---

**Dibuat dengan ❤️ untuk GKJW Jemaat Probolinggo**