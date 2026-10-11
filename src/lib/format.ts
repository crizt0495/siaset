/** Utilitas format angka, mata uang, dan tanggal (locale id-ID). */

export function formatRupiah(value: number | string | null | undefined, withSymbol = true): string {
  const n = Number(value) || 0
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...(withSymbol ? {} : { currencyDisplay: "code" }),
  })
    .format(n)
    .replace(/\s/g, " ")
}

export function formatAngka(value: number | string | null | undefined): string {
  return new Intl.NumberFormat("id-ID").format(Number(value) || 0)
}

/** Versi ringkas untuk kartu statistik: Rp 7,5 jt / Rp 1,2 M. */
export function formatRupiahRingkas(value: number | string | null | undefined): string {
  const n = Number(value) || 0
  const abs = Math.abs(n)
  if (abs >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 2 })} M`
  if (abs >= 1_000_000) return `Rp ${(n / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`
  if (abs >= 1_000) return `Rp ${(n / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 0 })} rb`
  return formatRupiah(n)
}

export function formatTanggal(
  value: Date | string | null | undefined,
  opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" }
): string {
  if (!value) return "-"
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return "-"
  return d.toLocaleDateString("id-ID", opts)
}

export function formatDateTime(value: Date | string | null | undefined): string {
  return formatTanggal(value, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/** yyyy-mm-dd untuk <input type="date">. */
export function tanggalInput(value: Date | string | null | undefined): string {
  if (!value) return ""
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return ""
  return d.toISOString().slice(0, 10)
}

/** "36 bulan" → "3 thn" bila kelipatan 12, selain itu "3 thn 6 bln". */
export function formatMasaManfaat(bulan: number): string {
  const n = Math.max(0, Math.floor(bulan || 0))
  if (n === 0) return "—"
  const tahun = Math.floor(n / 12)
  const sisa = n % 12
  if (tahun === 0) return `${n} bln`
  if (sisa === 0) return `${tahun} thn`
  return `${tahun} thn ${sisa} bln`
}
