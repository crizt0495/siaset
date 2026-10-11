import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.aktivitas.deleteMany();
  await prisma.pemeliharaan.deleteMany();
  await prisma.penghapusan.deleteMany();
  await prisma.mutasi.deleteMany();
  await prisma.peminjaman.deleteMany();
  await prisma.barang.deleteMany();
  await prisma.userPermission.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.user.deleteMany();
  await prisma.komisi.deleteMany();
  await prisma.session.deleteMany();

  // Create Roles
  const superadminRole = await prisma.role.create({ data: { name: "Superadmin" } });
  const adminRole = await prisma.role.create({ data: { name: "Admin" } });
  const komisiRole = await prisma.role.create({ data: { name: "Komisi" } });

  // Create Permissions
  const permissionNames = [
    "view_dashboard",
    "view_barang", "create_barang", "edit_barang", "delete_barang",
    "view_peminjaman", "create_peminjaman", "edit_peminjaman", "delete_peminjaman",
    "view_mutasi", "create_mutasi", "edit_mutasi", "delete_mutasi",
    "view_penghapusan", "create_penghapusan", "edit_penghapusan", "delete_penghapusan",
    "view_pemeliharaan", "create_pemeliharaan", "edit_pemeliharaan", "delete_pemeliharaan",
    "view_komisi", "create_komisi", "edit_komisi", "delete_komisi",
    "view_pengguna", "create_pengguna", "edit_pengguna", "delete_pengguna",
    "view_backup", "create_backup",
    "print-asset-cards",
  ];

  const permissions = await Promise.all(
    permissionNames.map((name) => prisma.permission.create({ data: { name } }))
  );

  // Superadmin gets all permissions
  for (const perm of permissions) {
    await prisma.rolePermission.create({
      data: { roleId: superadminRole.id, permissionId: perm.id },
    });
  }

  // Admin gets most permissions except user management
  const adminExclude = ["create_pengguna", "edit_pengguna", "delete_pengguna"];
  for (const perm of permissions) {
    if (!adminExclude.includes(perm.name)) {
      await prisma.rolePermission.create({
        data: { roleId: adminRole.id, permissionId: perm.id },
      });
    }
  }

  // Komisi gets limited permissions
  const komisiPerms = [
    "view_dashboard", "view_barang", "create_barang", "edit_barang",
    "view_peminjaman", "create_peminjaman", "view_mutasi", "create_mutasi",
    "view_penghapusan", "view_pemeliharaan", "create_pemeliharaan", "view_komisi",
  ];
  for (const perm of permissions) {
    if (komisiPerms.includes(perm.name)) {
      await prisma.rolePermission.create({
        data: { roleId: komisiRole.id, permissionId: perm.id },
      });
    }
  }

  // Create Komisi
  const komisi1 = await prisma.komisi.create({
    data: { namaKomisi: "Komisi Pemuda", keterangan: "Komisi untuk pemuda-pemudi" },
  });
  const komisi2 = await prisma.komisi.create({
    data: { namaKomisi: "Komisi Wanita", keterangan: "Komisi untuk ibu-ibu" },
  });
  const komisi3 = await prisma.komisi.create({
    data: { namaKomisi: "Majelis", keterangan: "Majelis Jemaat" },
  });
  const komisi4 = await prisma.komisi.create({
    data: { namaKomisi: "Komisi Musik", keterangan: "Komisi musik dan pujian" },
  });

  // Create Users
  const hashedPassword = await bcrypt.hash("password123", 10);

  const superadmin = await prisma.user.create({
    data: {
      namaLengkap: "Super Administrator",
      username: "admin",
      password: hashedPassword,
      active: true,
    },
  });

  const admin1 = await prisma.user.create({
    data: {
      namaLengkap: "Budi Santoso",
      username: "budi",
      komisiId: komisi1.id,
      password: hashedPassword,
      active: true,
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      namaLengkap: "Siti Rahayu",
      username: "siti",
      komisiId: komisi2.id,
      password: hashedPassword,
      active: true,
    },
  });

  // Assign roles
  await prisma.userRole.create({ data: { userId: superadmin.id, roleId: superadminRole.id } });
  await prisma.userRole.create({ data: { userId: admin1.id, roleId: adminRole.id } });
  await prisma.userRole.create({ data: { userId: admin2.id, roleId: komisiRole.id } });

  // Create Barang
  // (hargaPerolehan = harga pasar riil Indonesia; masaManfaat mengikuti kelas aset)
  const barangData = [
    { namaBarang: "Kursi Lipat", komisiId: komisi1.id, spesifikasi: "Kursi lipat plastik warna biru", kondisi: "Baik" as const, lokasi: "Gedung Serbaguna", sumberPerolehan: "Donasi Jemaat", hargaPerolehan: 185000, jumlah: 50, masaManfaat: 60, nilaiResidu: 0, metodePenyusutan: "GarisLurus" as const },
    { namaBarang: "Meja Bulat", komisiId: komisi3.id, spesifikasi: "Meja bulat kayu diameter 120cm", kondisi: "Baik" as const, lokasi: "Ruang Pertemuan", sumberPerolehan: "Pembelian", hargaPerolehan: 750000, jumlah: 10, masaManfaat: 120, nilaiResidu: 0, metodePenyusutan: "GarisLurus" as const },
    { namaBarang: "Proyektor Epson", komisiId: komisi1.id, spesifikasi: "Epson EB-X51 3800 lumens", kondisi: "Baik" as const, lokasi: "Gereja Utama", sumberPerolehan: "Donasi", hargaPerolehan: 8500000, jumlah: 2, masaManfaat: 36, nilaiResidu: 500000, metodePenyusutan: "SaldoMenurunGanda" as const },
    { namaBarang: "Sound System", komisiId: komisi4.id, spesifikasi: "TOA ZS-1030 100W", kondisi: "Baik" as const, lokasi: "Gereja Utama", sumberPerolehan: "Pembelian", hargaPerolehan: 15000000, jumlah: 1, masaManfaat: 120, nilaiResidu: 0, metodePenyusutan: "GarisLurus" as const },
    { namaBarang: "Piano Digital", komisiId: komisi4.id, spesifikasi: "Yamaha P-45 88 keys", kondisi: "Baik" as const, lokasi: "Ruang Paduan Suara", sumberPerolehan: "Donasi", hargaPerolehan: 5200000, jumlah: 1, masaManfaat: 120, nilaiResidu: 1000000, metodePenyusutan: "GarisLurus" as const },
    { namaBarang: "Mikrofon Wireless", komisiId: komisi4.id, spesifikasi: "Shure BLX24/SM58", kondisi: "Rusak" as const, lokasi: "Gereja Utama", sumberPerolehan: "Pembelian", hargaPerolehan: 4200000, jumlah: 4, masaManfaat: 60, nilaiResidu: 0, metodePenyusutan: "GarisLurus" as const },
    { namaBarang: "Whiteboard", komisiId: komisi1.id, spesifikasi: "Papan tulis 120x240cm", kondisi: "Baik" as const, lokasi: "Ruang Kelas", sumberPerolehan: "Pembelian", hargaPerolehan: 400000, jumlah: 3, masaManfaat: 60, nilaiResidu: 0, metodePenyusutan: "GarisLurus" as const },
    { namaBarang: "Komputer Desktop", komisiId: komisi3.id, spesifikasi: "Intel i5, 8GB RAM, 256GB SSD", kondisi: "Baik" as const, lokasi: "Kantor Sekretariat", sumberPerolehan: "Pembelian", hargaPerolehan: 7800000, jumlah: 2, masaManfaat: 48, nilaiResidu: 500000, metodePenyusutan: "GarisLurus" as const },
    { namaBarang: "AC Split", komisiId: komisi3.id, spesifikasi: "Daikin 1.5PK", kondisi: "Baik" as const, lokasi: "Kantor Sekretariat", sumberPerolehan: "Donasi", hargaPerolehan: 4600000, jumlah: 1, masaManfaat: 84, nilaiResidu: 0, metodePenyusutan: "GarisLurus" as const },
    { namaBarang: "Kipas Angin", komisiId: komisi2.id, spesifikasi: "Kipas angin dinding 16 inch", kondisi: "Hilang" as const, lokasi: "Ruang IWIST", sumberPerolehan: "Pembelian", hargaPerolehan: 280000, jumlah: 0, masaManfaat: 48, nilaiResidu: 0, metodePenyusutan: "GarisLurus" as const },
  ];

  const createdBarang = [];
  for (let i = 0; i < barangData.length; i++) {
    const b = barangData[i];
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const kode = `BRG-${dateStr}-${String(i + 1).padStart(3, "0")}`;
    const created = await prisma.barang.create({
      data: {
        kodeBarang: kode,
        namaBarang: b.namaBarang,
        komisiId: b.komisiId,
        userId: superadmin.id,
        spesifikasi: b.spesifikasi,
        kondisi: b.kondisi,
        lokasi: b.lokasi,
        tanggalPerolehan: new Date("2025-01-15"),
        sumberPerolehan: b.sumberPerolehan,
        hargaPerolehan: b.hargaPerolehan,
        status: "Aktif",
        jumlah: b.jumlah,
        masaManfaat: b.masaManfaat,
        nilaiResidu: b.nilaiResidu,
        metodePenyusutan: b.metodePenyusutan,
      },
    });
    createdBarang.push(created);
  }

  // Create Peminjaman
  await prisma.peminjaman.create({
    data: {
      barangId: createdBarang[0].id,
      jumlahDipinjam: 10,
      peminjam: "Pemuda GKJW",
      tanggalPinjam: new Date("2025-11-01"),
      status: "Dipinjam",
      keterangan: "Untuk acara Natal",
      createdBy: superadmin.id,
    },
  });

  await prisma.peminjaman.create({
    data: {
      barangId: createdBarang[2].id,
      jumlahDipinjam: 1,
      peminjam: "Siti Rahayu",
      tanggalPinjam: new Date("2025-10-15"),
      tanggalKembali: new Date("2025-10-20"),
      status: "Dikembalikan",
      keterangan: "Untuk presentasi",
      createdBy: admin1.id,
    },
  });

  // Create Mutasi
  await prisma.mutasi.create({
    data: {
      barangId: createdBarang[3].id,
      lokasiAsal: "Gudang",
      lokasiTujuan: "Gereja Utama",
      tanggalMutasi: new Date("2025-09-01"),
      keterangan: "Pemasangan di gereja utama",
      userId: superadmin.id,
    },
  });

  // Create Penghapusan
  await prisma.penghapusan.create({
    data: {
      barangId: createdBarang[9].id,
      tanggalPenghapusan: new Date("2025-10-01"),
      alasan: "Hilang sejak tanggal 15 September",
      keterangan: "Sudah dilaporkan ke polisi",
      userId: superadmin.id,
    },
  });

  // Create Pemeliharaan
  await prisma.pemeliharaan.create({
    data: {
      barangId: createdBarang[5].id,
      tanggal: new Date("2025-11-01"),
      biaya: 200000,
      keterangan: "Ganti baterai microphone",
      userId: superadmin.id,
    },
  });

  // Create Aktivitas
  await prisma.aktivitas.createMany({
    data: [
      { userId: superadmin.id, aktivitas: "Menambah barang baru: Kursi Lipat", waktu: new Date() },
      { userId: admin1.id, aktivitas: "Login ke sistem", waktu: new Date(Date.now() - 3600000) },
      { userId: superadmin.id, aktivitas: "Memproses peminjaman: Pemuda GKJW", waktu: new Date(Date.now() - 7200000) },
      { userId: superadmin.id, aktivitas: "Mutasi barang: Sound System ke Gereja Utama", waktu: new Date(Date.now() - 86400000) },
      { userId: admin2.id, aktivitas: "Melihat laporan aset", waktu: new Date(Date.now() - 172800000) },
    ],
  });

  console.log("Seed completed successfully!");
  console.log("Login credentials:");
  console.log("  Superadmin: admin / password123");
  console.log("  Admin: budi / password123");
  console.log("  Komisi: siti / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
