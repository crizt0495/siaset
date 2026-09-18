import { promises as fs } from "fs"
import path from "path"
import { Pool } from "pg"
import { prisma } from "@/lib/prisma"

const BACKUP_DIR = process.env.BACKUP_DIR || path.join(process.cwd(), "backups")

/* ============================================================
   File helpers
   ============================================================ */

async function ensureBackupDir() {
  await fs.mkdir(BACKUP_DIR, { recursive: true })
}

function sanitizeFilename(id: string): string | null {
  if (!/^backup_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.sql$/.test(id)) return null
  const resolved = path.basename(id)
  if (resolved !== id || id.includes("..") || id.includes("/") || id.includes("\\")) {
    return null
  }
  return resolved
}

export function getBackupDir(): string {
  return BACKUP_DIR
}

export interface BackupFileInfo {
  id: string
  filename: string
  size: string
  sizeBytes: number
  createdAt: string
  status: "success"
}

export function formatBytes(bytes: number): string {
  if (!bytes) return "0 B"
  const units = ["B", "KB", "MB", "GB"]
  const i = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024))
  )
  const val = bytes / Math.pow(1024, i)
  return `${val.toFixed(i === 0 || val >= 10 ? 0 : 1)} ${units[i]}`
}

export async function listBackupFiles(): Promise<BackupFileInfo[]> {
  await ensureBackupDir()
  const entries = await fs.readdir(BACKUP_DIR)

  const files: BackupFileInfo[] = []

  for (const name of entries) {
    if (!sanitizeFilename(name)) continue
    const full = path.join(BACKUP_DIR, name)
    let stat
    try {
      stat = await fs.stat(full)
    } catch {
      continue
    }
    if (!stat.isFile()) continue

    const match = name.match(/^backup_(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2}-\d{2})\.sql$/)
    const createdAt = match
      ? `${match[1]} ${match[2].replace(/-/g, ":")}`
      : stat.mtime.toISOString().slice(0, 19).replace("T", " ")

    files.push({
      id: name,
      filename: name,
      size: formatBytes(stat.size),
      sizeBytes: stat.size,
      createdAt,
      status: "success",
    })
  }

  return files.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function readBackupFile(id: string): Promise<{
  filename: string
  buffer: Buffer
}> {
  const name = sanitizeFilename(id)
  if (!name) throw new Error("Nama file backup tidak valid")
  const full = path.join(BACKUP_DIR, name)
  const buffer = await fs.readFile(full)
  return { filename: name, buffer }
}

export async function deleteBackupFile(id: string): Promise<void> {
  const name = sanitizeFilename(id)
  if (!name) throw new Error("Nama file backup tidak valid")
  await fs.unlink(path.join(BACKUP_DIR, name))
}

/* ============================================================
   SQL dump generator
   ============================================================ */

interface ColumnInfo {
  name: string
  dataType: string
  udtName: string
  nullable: boolean
  length: number | null
  precision: number | null
  scale: number | null
  datetimePrecision: number | null
  defaultValue: string | null
}

const KNOWN_TYPES: Record<string, string> = {
  int2: "SMALLINT",
  int4: "INTEGER",
  int8: "BIGINT",
  text: "TEXT",
  varchar: "VARCHAR",
  bpchar: "CHAR",
  bool: "BOOLEAN",
  float4: "REAL",
  float8: "DOUBLE PRECISION",
  numeric: "NUMERIC",
  timestamptz: "TIMESTAMPTZ",
  timestamp: "TIMESTAMP",
  date: "DATE",
  time: "TIME",
  timetz: "TIMETZ",
  json: "JSON",
  jsonb: "JSONB",
  uuid: "UUID",
  bytea: "BYTEA",
  inet: "INET",
}

function sqlColumnType(col: ColumnInfo): string {
  const mapped = KNOWN_TYPES[col.udtName]
  if (mapped) return mapped
  return `"${col.udtName}"`
}

function sqlDataType(col: ColumnInfo): string {
  let type = sqlColumnType(col)
  if (
    (col.udtName === "varchar" || col.udtName === "bpchar") &&
    col.length != null
  ) {
    type = `${type}(${col.length})`
  }
  if (col.udtName === "numeric" && col.precision != null) {
    type = `NUMERIC(${col.precision},${col.scale ?? 0})`
  }
  if (
    (col.udtName === "timestamptz" || col.udtName === "timestamp") &&
    col.datetimePrecision != null
  ) {
    type = `${type}(${col.datetimePrecision})`
  }
  return type
}

function sqlLiteral(value: unknown): string {
  if (value === null || value === undefined) return "NULL"
  if (typeof value === "string") {
    return `'${value.replace(/\\/g, "\\\\").replace(/'/g, "''")}'`
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "NULL"
  }
  if (typeof value === "boolean") return value ? "true" : "false"
  if (value instanceof Date) return `'${value.toISOString()}'`
  if (value instanceof Uint8Array) {
    return `'\\x${Buffer.from(value).toString("hex")}'`
  }
  if (
    typeof (value as { toFixed?: unknown }).toFixed === "function" &&
    typeof (value as { toString?: unknown }).toString === "function"
  ) {
    return String(value)
  }
  if (typeof value === "object") {
    return `'${JSON.stringify(value)
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "''")}'::jsonb`
  }
  return `'${String(value).replace(/\\/g, "\\\\").replace(/'/g, "''")}'`
}

async function getTableNamesAndOrder(): Promise<{
  tables: string[]
  enums: { name: string; labels: string[] }[]
}> {
  const enums = (await prisma.$queryRawUnsafe(
    `SELECT t.typname AS name, array_agg(e.enumlabel ORDER BY e.enumsortorder)::text[] AS labels
     FROM pg_type t
     JOIN pg_enum e ON e.enumtypid = t.oid
     JOIN pg_namespace n ON n.oid = t.typnamespace
     WHERE n.nspname = 'public' AND t.typtype = 'e'
     GROUP BY t.typname
     ORDER BY t.typname`
  )) as { name: string; labels: string[] }[]

  const tableRows = (await prisma.$queryRawUnsafe(
    `SELECT table_name AS name
     FROM information_schema.tables
     WHERE table_schema = 'public'
       AND table_type = 'BASE TABLE'
       AND table_name != '_prisma_migrations'
     ORDER BY table_name`
  )) as { name: string }[]

  const refs = (await prisma.$queryRawUnsafe(
    `SELECT c.relname AS table_name, f.relname AS foreign_table
     FROM pg_constraint con
     JOIN pg_class c ON c.oid = con.conrelid
     JOIN pg_class f ON f.oid = con.confrelid
     JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = 'public' AND con.contype = 'f'
       AND c.relname != f.relname`
  )) as { table_name: string; foreign_table: string }[]

  const tableSet = new Set(tableRows.map((r) => r.name))
  const deps = new Map<string, Set<string>>()
  for (const r of tableRows) deps.set(r.name, new Set())

  for (const r of refs) {
    if (!tableSet.has(r.table_name)) continue
    if (r.foreign_table === r.table_name) continue
    if (tableSet.has(r.foreign_table)) deps.get(r.table_name)!.add(r.foreign_table)
  }

  const ordered: string[] = []
  const visited = new Set<string>()

  const visit = (table: string) => {
    if (visited.has(table)) return
    visited.add(table)
    for (const dep of deps.get(table) || []) visit(dep)
    ordered.push(table)
  }

  for (const r of tableRows) visit(r.name)

  return { tables: ordered, enums }
}

async function getColumns(table: string): Promise<ColumnInfo[]> {
  return (await prisma.$queryRawUnsafe(
    `SELECT column_name AS name,
            data_type,
            udt_name AS "udtName",
            (is_nullable = 'YES') AS nullable,
            character_maximum_length AS length,
            numeric_precision AS precision,
            numeric_scale AS scale,
            datetime_precision AS "datetimePrecision",
            column_default AS "defaultValue"
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = $1
     ORDER BY ordinal_position`,
    table
  )) as unknown as ColumnInfo[]
}

async function getConstraints(table: string): Promise<string[]> {
  const rows = (await prisma.$queryRawUnsafe(
    `SELECT conname, pg_get_constraintdef(oid) AS def
     FROM pg_constraint
     WHERE conrelid = ('public.' || $1)::regclass
     ORDER BY conname`,
    table
  )) as { conname: string; def: string }[]
  return rows.map((r) => `ALTER TABLE "public"."${table}" ADD CONSTRAINT "${r.conname}" ${r.def};`)
}

async function getIndexes(table: string): Promise<string[]> {
  const rows = (await prisma.$queryRawUnsafe(
    `SELECT pg_get_indexdef(idx.indexrelid) AS def
     FROM pg_index idx
     JOIN pg_class i ON i.oid = idx.indexrelid
     JOIN pg_namespace n ON n.oid = i.relnamespace
     WHERE n.nspname = 'public'
       AND idx.indrelid = ('public.' || $1)::regclass
       AND NOT idx.indisprimary
       AND NOT idx.indisunique
     ORDER BY i.relname`,
    table
  )) as { def: string }[]
  return rows.map((r) => `${r.def};`)
}

async function getTableData(table: string): Promise<Record<string, unknown>[]> {
  return (await prisma.$queryRawUnsafe(
    `SELECT * FROM "public"."${table}"`
  )) as Record<string, unknown>[]
}

export async function generateSqlDump(): Promise<string> {
  const { tables, enums } = await getTableNamesAndOrder()

  const lines: string[] = []
  const now = new Date()
  lines.push(
    `-- ==============================================`,
    `-- SIASET Database Backup`,
    `-- Generated: ${now.toISOString()}`,
    `-- Format: PostgreSQL (pg_dump compatible)`,
    `-- ==============================================`,
    ``,
    `SET statement_timeout = 0;`,
    `BEGIN;`,
    ``
  )

  for (const en of enums) {
    lines.push(
      `CREATE TYPE "${en.name}" AS ENUM (${en.labels
        .map((l) => `'${l}'`)
        .join(", ")});`,
      ``
    )
  }

  for (const table of tables) {
    const cols = await getColumns(table)
    if (!cols.length) continue

    const colDefs = cols.map((c) => {
      let def = `"${c.name}" ${sqlDataType(c)}`
      def += c.defaultValue ? ` DEFAULT ${c.defaultValue}` : ""
      if (!c.nullable) def += " NOT NULL"
      return def
    })

    lines.push(
      `CREATE TABLE "public"."${table}" (`,
      `  ${colDefs.join(",\n  ")}`,
      `);`,
      ``
    )

    const constraints = await getConstraints(table)
    for (const con of constraints) lines.push(con)
    if (constraints.length) lines.push(``)
    const indexes = await getIndexes(table)
    for (const idx of indexes) lines.push(idx)
    if (indexes.length) lines.push(``)

    const rows = await getTableData(table)
    if (rows.length) {
      const colNames = cols.map((c) => `"${c.name}"`).join(", ")
      const values = rows.map(
        (row) =>
          `  (${cols.map((c) => sqlLiteral(row[c.name])).join(", ")})`
      )
      const chunkSize = 200
      for (let i = 0; i < values.length; i += chunkSize) {
        lines.push(
          `INSERT INTO "public"."${table}" (${colNames}) VALUES`,
          values.slice(i, i + chunkSize).join(",\n"),
          `;`,
          ``
        )
      }
    }
  }

  lines.push(`COMMIT;`, ``)
  lines.push(`-- End of backup`)
  return lines.join("\n")
}

export async function createBackup(): Promise<BackupFileInfo> {
  await ensureBackupDir()
  const sql = await generateSqlDump()

  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  const filename =
    `backup_${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
    `_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}.sql`

  await fs.writeFile(path.join(BACKUP_DIR, filename), sql, "utf-8")
  return {
    id: filename,
    filename,
    size: formatBytes(sql.length),
    sizeBytes: sql.length,
    createdAt: now.toISOString().slice(0, 19).replace("T", " "),
    status: "success",
  }
}

/* ============================================================
   Restore
   ============================================================ */

export async function restoreSql(sql: string): Promise<void> {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error("DATABASE_URL belum dikonfigurasi")

  const hasSsl = /[?&]sslmode=require/i.test(url)
  const pool = new Pool({
    connectionString: url,
    ssl: hasSsl ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 15000,
    max: 1,
  })

  try {
    const trimmed = sql.trim()
    const wrapped = /^BEGIN\b/i.test(trimmed)
      ? trimmed
      : `BEGIN;\n${trimmed}\nCOMMIT;`

    await pool.query(wrapped)
  } finally {
    await pool.end()
  }
}