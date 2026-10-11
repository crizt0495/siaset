/**
 * Utilitas export file (CSV/Excel & cetak) untuk komponen client.
 * File CSV diberi BOM UTF-8 agar karakter Indonesia & pemisah ribuan
 * terbaca benar saat dibuka di Microsoft Excel.
 */

export type CsvValue = string | number | null | undefined

function escapeCsv(value: CsvValue): string {
  const s = value === null || value === undefined ? "" : String(value)
  if (/[",\n\r;]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export function toCsv(headers: string[], rows: CsvValue[][]): string {
  return [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n")
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function stampNamaFile(prefix: string): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${prefix}-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`
}

export function downloadCsv(filename: string, headers: string[], rows: CsvValue[][]) {
  const csv = "\uFEFF" + toCsv(headers, rows)
  triggerDownload(new Blob([csv], { type: "text/csv;charset=utf-8;" }), filename)
}

/** Export data siap-pakai: nama file otomatis berstempel, .csv. */
export function exportCsv(prefix: string, headers: string[], rows: CsvValue[][]) {
  downloadCsv(`${stampNamaFile(prefix)}.csv`, headers, rows)
}
