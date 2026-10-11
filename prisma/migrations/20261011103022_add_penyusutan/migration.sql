-- CreateEnum
CREATE TYPE "KondisiBarang" AS ENUM ('Baik', 'Rusak', 'Hilang');

-- CreateEnum
CREATE TYPE "StatusBarang" AS ENUM ('Aktif', 'Nonaktif');

-- CreateEnum
CREATE TYPE "StatusPeminjaman" AS ENUM ('Dipinjam', 'Dikembalikan');

-- CreateEnum
CREATE TYPE "MetodePenyusutan" AS ENUM ('GarisLurus', 'SaldoMenurunGanda');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nama_lengkap" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "komisi_id" TEXT,
    "foto_profil" TEXT,
    "password" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "komisi" (
    "id" TEXT NOT NULL,
    "nama_komisi" TEXT NOT NULL,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "komisi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "barang" (
    "id" TEXT NOT NULL,
    "kode_barang" TEXT NOT NULL,
    "nama_barang" TEXT NOT NULL,
    "komisi_id" TEXT,
    "user_id" TEXT,
    "spesifikasi" TEXT,
    "kondisi" "KondisiBarang" NOT NULL DEFAULT 'Baik',
    "lokasi" TEXT NOT NULL,
    "tanggal_perolehan" TIMESTAMP(3) NOT NULL,
    "sumber_perolehan" TEXT NOT NULL,
    "harga_perolehan" DECIMAL(15,2) NOT NULL,
    "foto_barang" TEXT,
    "qr_code" TEXT,
    "status" "StatusBarang" NOT NULL DEFAULT 'Aktif',
    "jumlah" INTEGER NOT NULL DEFAULT 0,
    "masa_manfaat" INTEGER NOT NULL DEFAULT 60,
    "nilai_residu" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "metode_penyusutan" "MetodePenyusutan" NOT NULL DEFAULT 'GarisLurus',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "barang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "peminjaman" (
    "id" TEXT NOT NULL,
    "barang_id" TEXT NOT NULL,
    "jumlah_dipinjam" INTEGER NOT NULL DEFAULT 1,
    "peminjam" TEXT NOT NULL,
    "tanggal_pinjam" TIMESTAMP(3) NOT NULL,
    "tanggal_kembali" TIMESTAMP(3),
    "keterangan" TEXT,
    "status" "StatusPeminjaman" NOT NULL DEFAULT 'Dipinjam',
    "created_by" TEXT,
    "qr_code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "peminjaman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mutasi" (
    "id" TEXT NOT NULL,
    "barang_id" TEXT NOT NULL,
    "lokasi_asal" TEXT NOT NULL,
    "lokasi_tujuan" TEXT NOT NULL,
    "tanggal_mutasi" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT,
    "user_id" TEXT,
    "qr_code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mutasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penghapusan" (
    "id" TEXT NOT NULL,
    "barang_id" TEXT NOT NULL,
    "tanggal_penghapusan" TIMESTAMP(3) NOT NULL,
    "alasan" TEXT NOT NULL,
    "keterangan" TEXT,
    "user_id" TEXT,
    "qr_code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "penghapusan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pemeliharaan" (
    "id" TEXT NOT NULL,
    "barang_id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "biaya" DECIMAL(15,2) NOT NULL,
    "keterangan" TEXT,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pemeliharaan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aktivitas" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "aktivitas" TEXT NOT NULL,
    "waktu" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "meta" JSONB,

    CONSTRAINT "aktivitas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_has_permissions" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "role_has_permissions_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "model_has_roles" (
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "model_has_roles_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "model_has_permissions" (
    "userId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "model_has_permissions_pkey" PRIMARY KEY ("userId","permissionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "komisi_nama_komisi_key" ON "komisi"("nama_komisi");

-- CreateIndex
CREATE UNIQUE INDEX "barang_kode_barang_key" ON "barang"("kode_barang");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_komisi_id_fkey" FOREIGN KEY ("komisi_id") REFERENCES "komisi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barang" ADD CONSTRAINT "barang_komisi_id_fkey" FOREIGN KEY ("komisi_id") REFERENCES "komisi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barang" ADD CONSTRAINT "barang_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peminjaman" ADD CONSTRAINT "peminjaman_barang_id_fkey" FOREIGN KEY ("barang_id") REFERENCES "barang"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peminjaman" ADD CONSTRAINT "peminjaman_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mutasi" ADD CONSTRAINT "mutasi_barang_id_fkey" FOREIGN KEY ("barang_id") REFERENCES "barang"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mutasi" ADD CONSTRAINT "mutasi_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penghapusan" ADD CONSTRAINT "penghapusan_barang_id_fkey" FOREIGN KEY ("barang_id") REFERENCES "barang"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penghapusan" ADD CONSTRAINT "penghapusan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pemeliharaan" ADD CONSTRAINT "pemeliharaan_barang_id_fkey" FOREIGN KEY ("barang_id") REFERENCES "barang"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pemeliharaan" ADD CONSTRAINT "pemeliharaan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aktivitas" ADD CONSTRAINT "aktivitas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_has_permissions" ADD CONSTRAINT "role_has_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_has_permissions" ADD CONSTRAINT "role_has_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_has_roles" ADD CONSTRAINT "model_has_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_has_roles" ADD CONSTRAINT "model_has_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_has_permissions" ADD CONSTRAINT "model_has_permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_has_permissions" ADD CONSTRAINT "model_has_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
