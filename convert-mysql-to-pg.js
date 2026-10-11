/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

function generateCuid() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'c';
  for (let i = 0; i < 24; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

function pgVal(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (typeof v === 'number') return String(v);
  if (v instanceof Date) return `'${v.toISOString()}'`;
  const s = String(v);
  if (s === 'NULL') return 'NULL';
  if (s === 'true') return 'true';
  if (s === 'false') return 'false';
  if (s.startsWith('{') || s.startsWith('[')) {
    // Unescape any pre-escaped backslashes/quotes from MySQL
    let cleaned = s;
    try {
      // First try direct parse
      const parsed = JSON.parse(cleaned);
      const jsonStr = JSON.stringify(parsed);
      return `'${jsonStr.replace(/'/g, "''")}'::jsonb`;
    } catch {
      // Try un-escape
      cleaned = cleaned.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      try {
        const parsed = JSON.parse(cleaned);
        const jsonStr = JSON.stringify(parsed);
        return `'${jsonStr.replace(/'/g, "''")}'::jsonb`;
      } catch {
        return `'${s.replace(/'/g, "''")}'`;
      }
    }
  }
  const escaped = s.replace(/\\/g, '\\\\').replace(/'/g, "''");
  return `'${escaped}'`;
}

const raw = fs.readFileSync('./siasetgk_gkjwinventory.sql', 'utf8');

function extractInserts(sql) {
  const result = {};
  // Map of MySQL column names to drop (Laravel-specific, not in Prisma)
  const dropCols = {
    'users': new Set(['remember_token']),
    'roles': new Set(['guard_name']),
    'permissions': new Set(['guard_name']),
    'peminjaman': new Set([]),
  };

  // Match INSERT INTO `table` (`cols`) VALUES ...;
  const regex = /INSERT INTO `(\w+)`\s*\(([^)]+)\)\s*VALUES\s*([\s\S]*?);\s*(?=CREATE|ALTER|INSERT|DROP|--|$)/gi;
  let m;
  while ((m = regex.exec(sql)) !== null) {
    const table = m[1];
    const rawCols = m[2].split(',').map(c => c.trim().replace(/`/g, ''));
    const drops = dropCols[table] || new Set();
    const dropIdxs = new Set();
    rawCols.forEach((c, i) => { if (drops.has(c)) dropIdxs.add(i); });
    const cols = rawCols.filter((_, i) => !dropIdxs.has(i));
    const valBlock = m[3];

    if (!result[table]) result[table] = [];

    // Parse rows properly handling nested parens and quotes
    let pos = 0;
    while (pos < valBlock.length) {
      // Find next opening paren
      const openIdx = valBlock.indexOf('(', pos);
      if (openIdx === -1) break;
      
      let depth = 1;
      let inQ = false, qCh = null;
      let i = openIdx + 1;
      for (; i < valBlock.length; i++) {
        const c = valBlock[i];
        if (!inQ && (c === "'" || c === '"')) { inQ = true; qCh = c; }
        else if (inQ && c === qCh) {
          if (valBlock[i+1] === qCh) { i++; } else { inQ = false; qCh = null; }
        }
        else if (!inQ) {
          if (c === '(') depth++;
          else if (c === ')') { depth--; if (depth === 0) break; }
        }
      }
      pos = i + 1;
      if (depth !== 0) continue; // malformed, skip

      const rawVal = valBlock.substring(openIdx + 1, i);
      const vals = [];
      let cur = '';
      let vInQ = false, vQCh = null, vDepth = 0;
      for (let j = 0; j < rawVal.length; j++) {
        const c = rawVal[j];
        if (!vInQ && (c === "'" || c === '"')) { vInQ = true; vQCh = c; }
        else if (vInQ && c === vQCh) {
          if (rawVal[j+1] === vQCh) { cur += c; j++; } else { vInQ = false; vQCh = null; }
        }
        else if (!vInQ && c === '(') { vDepth++; cur += c; }
        else if (!vInQ && c === ')') { vDepth--; cur += c; }
        else if (!vInQ && c === ',' && vDepth === 0) { vals.push(cur.trim()); cur = ''; }
        else { cur += c; }
      }
      if (cur.trim()) vals.push(cur.trim());

      const row = {};
      cols.forEach((col, idx) => {
        // Map to the correct value index (skip dropped columns)
        let valIdx = idx;
        for (const di of dropIdxs) { if (di <= valIdx) valIdx++; }
        let v = vals[valIdx] || 'NULL';
        if (v === 'NULL' || v === 'null') { row[col] = null; return; }
        if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) {
          v = v.slice(1, -1).replace(/''/g, "'");
        }
        if (/^-?\d+(\.\d+)?$/.test(v) && (v.length < 15)) {
          row[col] = v.includes('.') ? parseFloat(v) : parseInt(v, 10);
        } else if (v === 'true' || v === '1') {
          row[col] = true;
        } else if (v === 'false' || v === '0') {
          row[col] = false;
        } else {
          row[col] = v;
        }
      });
      result[table].push(row);
    }
  }
  return result;
}

const data = extractInserts(raw);

// ---- ID mapping ----
const idMaps = {};
const tablesWithId = {
  'komisi': 'id',
  'users': 'id',
  'roles': 'id',
  'permissions': 'id',
  'barang': 'id_barang',
  'mutasi': 'id_mutasi',
  'peminjaman': 'id_peminjaman',
  'penghapusan': 'id_penghapusan',
  'pemeliharaan': 'id_pemeliharaan',
};
for (const [table, idCol] of Object.entries(tablesWithId)) {
  if (!data[table]) continue;
  idMaps[table] = {};
  for (const row of data[table]) {
    if (row[idCol] !== undefined) idMaps[table][row[idCol]] = generateCuid();
  }
}

function mapId(table, oldId) {
  if (!oldId && oldId !== 0) return null;
  if (idMaps[table] && idMaps[table][oldId] !== undefined) return idMaps[table][oldId];
  return String(oldId);
}

let pg = `-- Converted from MySQL to PostgreSQL\n-- Database: neondb\n\n`;

pg += `TRUNCATE TABLE "aktivitas", "pemeliharaan", "penghapusan", "mutasi", "peminjaman", "barang", "model_has_permissions", "model_has_roles", "role_has_permissions", "permissions", "roles", "users", "komisi" CASCADE;\n\n`;

// KOMISI
if (data.komisi?.length) {
  pg += `-- komisi (${data.komisi.length} rows)\n`;
  pg += `INSERT INTO "komisi" (id, "nama_komisi", keterangan, "created_at", "updated_at") VALUES\n`;
  pg += data.komisi.map(r => `(${pgVal(mapId('komisi', r.id))}, ${pgVal(r.nama_komisi)}, ${pgVal(r.keterangan)}, ${pgVal(r.created_at)}, ${pgVal(r.updated_at)})`).join(',\n') + ';\n\n';
}

// USERS - skip remember_token
if (data.users?.length) {
  pg += `-- users (${data.users.length} rows)\n`;
  pg += `INSERT INTO "users" (id, "nama_lengkap", username, "komisi_id", "foto_profil", password, active, "created_at", "updated_at") VALUES\n`;
  pg += data.users.map(r => {
    const active = r.active === true || r.active === 1 || r.active === '1';
    return `(${pgVal(mapId('users', r.id))}, ${pgVal(r.nama_lengkap)}, ${pgVal(r.username)}, ${pgVal(mapId('komisi', r.komisi_id))}, ${pgVal(r.foto_profil)}, ${pgVal(r.password)}, ${active}, ${pgVal(r.created_at)}, ${pgVal(r.updated_at)})`;
  }).join(',\n') + ';\n\n';
}

// ROLES
if (data.roles?.length) {
  pg += `-- roles (${data.roles.length} rows)\n`;
  pg += `INSERT INTO "roles" (id, name) VALUES\n`;
  pg += data.roles.map(r => `(${pgVal(mapId('roles', r.id))}, ${pgVal(r.name)})`).join(',\n') + ';\n\n';
}

// PERMISSIONS
if (data.permissions?.length) {
  pg += `-- permissions (${data.permissions.length} rows)\n`;
  pg += `INSERT INTO "permissions" (id, name) VALUES\n`;
  pg += data.permissions.map(r => `(${pgVal(mapId('permissions', r.id))}, ${pgVal(r.name)})`).join(',\n') + ';\n\n';
}

// ROLE_HAS_PERMISSIONS (Prisma uses camelCase column names here)
if (data.role_has_permissions?.length) {
  pg += `-- role_has_permissions (${data.role_has_permissions.length} rows)\n`;
  pg += `INSERT INTO "role_has_permissions" ("roleId", "permissionId") VALUES\n`;
  pg += data.role_has_permissions.map(r => `(${pgVal(mapId('roles', r.role_id))}, ${pgVal(mapId('permissions', r.permission_id))})`).join(',\n') + ';\n\n';
}

// MODEL_HAS_ROLES (Prisma uses camelCase column names here)
if (data.model_has_roles?.length) {
  pg += `-- model_has_roles/UserRole (${data.model_has_roles.length} rows)\n`;
  pg += `INSERT INTO "model_has_roles" ("userId", "roleId") VALUES\n`;
  pg += data.model_has_roles.map(r => `(${pgVal(mapId('users', r.model_id))}, ${pgVal(mapId('roles', r.role_id))})`).join(',\n') + ';\n\n';
}

// MODEL_HAS_PERMISSIONS (Prisma uses camelCase column names here)
if (data.model_has_permissions?.length) {
  pg += `-- model_has_permissions/UserPermission (${data.model_has_permissions.length} rows)\n`;
  pg += `INSERT INTO "model_has_permissions" ("userId", "permissionId") VALUES\n`;
  pg += data.model_has_permissions.map(r => `(${pgVal(mapId('users', r.model_id))}, ${pgVal(mapId('permissions', r.permission_id))})`).join(',\n') + ';\n\n';
}

// BARANG
if (data.barang?.length) {
  pg += `-- barang (${data.barang.length} rows)\n`;
  pg += `INSERT INTO "barang" (id, "kode_barang", "nama_barang", "komisi_id", "user_id", spesifikasi, kondisi, lokasi, "tanggal_perolehan", "sumber_perolehan", "harga_perolehan", "foto_barang", "qr_code", status, jumlah, "created_at", "updated_at") VALUES\n`;
  pg += data.barang.map(r => {
    const harga = typeof r.harga_perolehan === 'number' ? r.harga_perolehan : 0;
    return `(${pgVal(mapId('barang', r.id_barang))}, ${pgVal(r.kode_barang)}, ${pgVal(r.nama_barang)}, ${pgVal(mapId('komisi', r.komisi_id))}, ${pgVal(mapId('users', r.user_id))}, ${pgVal(r.spesifikasi)}, ${pgVal(r.kondisi || 'Baik')}, ${pgVal(r.lokasi)}, ${pgVal(r.tanggal_perolehan)}, ${pgVal(r.sumber_perolehan)}, ${pgVal(harga)}, ${pgVal(r.foto_barang)}, ${pgVal(r.qr_code)}, ${pgVal(r.status || 'Aktif')}, ${r.jumlah || 0}, ${pgVal(r.created_at)}, ${pgVal(r.updated_at)})`;
  }).join(',\n') + ';\n\n';
}

// PEMINJAMAN
if (data.peminjaman?.length) {
  pg += `-- peminjaman (${data.peminjaman.length} rows)\n`;
  pg += `INSERT INTO "peminjaman" (id, "barang_id", "jumlah_dipinjam", peminjam, "tanggal_pinjam", "tanggal_kembali", keterangan, status, "created_by", "qr_code", "created_at", "updated_at") VALUES\n`;
  pg += data.peminjaman.map(r => {
    const idKey = r.id_peminjaman || r.id;
    return `(${pgVal(mapId('peminjaman', idKey))}, ${pgVal(mapId('barang', r.barang_id))}, ${r.jumlah_dipinjam || r.jumlah || 1}, ${pgVal(r.peminjam)}, ${pgVal(r.tanggal_pinjam)}, ${pgVal(r.tanggal_kembali)}, ${pgVal(r.keterangan)}, ${pgVal(r.status || 'Dipinjam')}, ${pgVal(mapId('users', r.created_by))}, ${pgVal(r.qr_code)}, ${pgVal(r.created_at)}, ${pgVal(r.updated_at)})`;
  }).join(',\n') + ';\n\n';
}

// MUTASI
if (data.mutasi?.length) {
  pg += `-- mutasi (${data.mutasi.length} rows)\n`;
  pg += `INSERT INTO "mutasi" (id, "barang_id", "lokasi_asal", "lokasi_tujuan", "tanggal_mutasi", keterangan, "user_id", "qr_code", "created_at", "updated_at") VALUES\n`;
  pg += data.mutasi.map(r => {
    const idKey = r.id_mutasi || r.id;
    return `(${pgVal(mapId('mutasi', idKey))}, ${pgVal(mapId('barang', r.barang_id))}, ${pgVal(r.lokasi_asal)}, ${pgVal(r.lokasi_tujuan)}, ${pgVal(r.tanggal_mutasi)}, ${pgVal(r.keterangan)}, ${pgVal(mapId('users', r.user_id))}, ${pgVal(r.qr_code)}, ${pgVal(r.created_at)}, ${pgVal(r.updated_at)})`;
  }).join(',\n') + ';\n\n';
}

// PENGHAPUSAN
if (data.penghapusan?.length) {
  pg += `-- penghapusan (${data.penghapusan.length} rows)\n`;
  pg += `INSERT INTO "penghapusan" (id, "barang_id", "tanggal_penghapusan", alasan, keterangan, "user_id", "qr_code", "created_at", "updated_at") VALUES\n`;
  pg += data.penghapusan.map(r => {
    const idKey = r.id_penghapusan || r.id;
    return `(${pgVal(mapId('penghapusan', idKey))}, ${pgVal(mapId('barang', r.barang_id))}, ${pgVal(r.tanggal_penghapusan)}, ${pgVal(r.alasan)}, ${pgVal(r.keterangan)}, ${pgVal(mapId('users', r.user_id))}, ${pgVal(r.qr_code)}, ${pgVal(r.created_at)}, ${pgVal(r.updated_at)})`;
  }).join(',\n') + ';\n\n';
}

// PEMELIHARAAN
if (data.pemeliharaan?.length) {
  pg += `-- pemeliharaan (${data.pemeliharaan.length} rows)\n`;
  pg += `INSERT INTO "pemeliharaan" (id, "barang_id", tanggal, biaya, keterangan, "user_id", "created_at", "updated_at") VALUES\n`;
  pg += data.pemeliharaan.map(r => {
    const idKey = r.id_pemeliharaan || r.id;
    const biaya = typeof r.biaya === 'number' ? r.biaya : 0;
    return `(${pgVal(mapId('pemeliharaan', idKey))}, ${pgVal(mapId('barang', r.barang_id))}, ${pgVal(r.tanggal)}, ${biaya}, ${pgVal(r.keterangan)}, ${pgVal(mapId('users', r.user_id))}, ${pgVal(r.created_at)}, ${pgVal(r.updated_at)})`;
  }).join(',\n') + ';\n\n';
}

// AKTIVITAS
if (data.aktivitas?.length) {
  pg += `-- aktivitas (${data.aktivitas.length} rows)\n`;
  pg += `INSERT INTO "aktivitas" (id, "user_id", aktivitas, waktu, "ip_address", "user_agent", meta) VALUES\n`;
  pg += data.aktivitas.map(r => {
    let meta = r.meta;
    if (typeof meta === 'string') {
      try { meta = JSON.parse(meta); } catch { /* keep as string */ }
    }
    const metaStr = typeof meta === 'object' ? JSON.stringify(meta) : meta;
    return `(${pgVal(generateCuid())}, ${pgVal(mapId('users', r.user_id))}, ${pgVal(r.aktivitas)}, ${pgVal(r.waktu)}, ${pgVal(r.ip_address)}, ${pgVal(r.user_agent)}, ${pgVal(metaStr)}::jsonb)`;
  }).join(',\n') + ';\n\n';
}

console.log('Data extracted:');
let totalRows = 0;
const skip = ['cache', 'cache_locks', 'dummy_barangs', 'failed_jobs', 'jobs', 'job_batches', 'migrations', 'sessions'];
for (const [t, rows] of Object.entries(data)) {
  if (skip.includes(t)) continue;
  console.log(`  ${t}: ${rows.length} rows`);
  totalRows += rows.length;
}
console.log(`  TOTAL: ${totalRows} rows`);

fs.writeFileSync('./siaset_import.sql', pg);
console.log(`\nSQL written to siaset_import.sql (${(pg.length / 1024).toFixed(1)} KB)`);
