/**
 * Modul perhitungan penyusutan (depresiasi) & valuasi aset.
 *
 * Murni TypeScript tanpa dependensi sehingga aman dipakai baik di server
 * (API route) maupun di client (halaman detail aset) — hasil perhitungan
 * dijamin identik di kedua sisi.
 *
 * Asumsi data:
 * - `hargaPerolehan`, `nilaiResidu` adalah nilai PER UNIT
 * - `jumlah` adalah banyaknya unit, sehingga total = nilai per unit × jumlah
 * - penyusutan mulai dihitung sejak `tanggalPerolehan`
 */

export type MetodePenyusutan = "GarisLurus" | "SaldoMenurunGanda"

export const METODE_PENYUSUTAN_LABEL: Record<MetodePenyusutan, string> = {
  GarisLurus: "Garis Lurus",
  SaldoMenurunGanda: "Saldo Menurun Ganda",
}

export const METODE_PENYUSUTAN_OPTIONS: { value: MetodePenyusutan; label: string; hint: string }[] = [
  {
    value: "GarisLurus",
    label: "Garis Lurus",
    hint: "Beban penyusutan sama besar setiap bulan (paling umum)",
  },
  {
    value: "SaldoMenurunGanda",
    label: "Saldo Menurun Ganda",
    hint: "Beban lebih besar di awal umur aset (dipercepat)",
  },
]

export interface BarangSusutInput {
  hargaPerolehan: number | string
  jumlah?: number | null
  nilaiResidu?: number | string | null
  masaManfaat?: number | null
  metodePenyusutan?: MetodePenyusutan | null
  tanggalPerolehan: Date | string
}

export interface HasilPenyusutan {
  /** Tanggal perhitungan (cut-off). */
  asOf: Date
  metodePenyusutan: MetodePenyusutan
  masaManfaat: number
  umurBulan: number
  sisaBulan: number
  jumlahUnit: number
  /** Nilai per unit. */
  nilaiPerolehan: number
  nilaiResidu: number
  nilaiDapatDisusut: number
  penyusutanPerBulan: number
  penyusutanPerTahun: number
  akumulasiPenyusutan: number
  nilaiBuku: number
  /** Nilai dikalikan jumlah unit. */
  nilaiPerolehanTotal: number
  nilaiResiduTotal: number
  akumulasiPenyusutanTotal: number
  nilaiBukuTotal: number
  /** Persentase akumulasi terhadap nilai yang dapat disusut (0-100). */
  persenSusut: number
  /** true bila aset sudah habis masa manfaatnya. */
  selesai: boolean
}

const EPSILON = 0.5

function toNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined) return 0
  const n = typeof value === "number" ? value : Number(value)
  return Number.isFinite(n) ? n : 0
}

function toDate(value: Date | string): Date {
  const d = value instanceof Date ? value : new Date(value)
  return Number.isNaN(d.getTime()) ? new Date() : d
}

/** Selisih bulan penuh antara dua tanggal (mengabaikan hari, dibulatkan ke bawah). */
export function selisihBulan(from: Date, to: Date): number {
  if (to.getTime() <= from.getTime()) return 0
  let months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth())
  if (to.getDate() < from.getDate()) months -= 1
  return Math.max(0, months)
}

/**
 * Hitung penyusutan & nilai buku sebuah aset pada tanggal tertentu.
 */
export function hitungPenyusutan(
  input: BarangSusutInput,
  asOf: Date | string = new Date()
): HasilPenyusutan {
  const tanggal = toDate(asOf)
  const nilaiPerolehan = Math.max(0, toNumber(input.hargaPerolehan))
  const nilaiResidu = Math.min(Math.max(0, toNumber(input.nilaiResidu)), nilaiPerolehan)
  const jumlahUnit = Math.max(0, Math.floor(toNumber(input.jumlah ?? 1)))
  const masaManfaat = Math.max(0, Math.floor(toNumber(input.masaManfaat ?? 60)))
  const metodePenyusutan: MetodePenyusutan = input.metodePenyusutan || "GarisLurus"

  const umurBulan = selisihBulan(toDate(input.tanggalPerolehan), tanggal)
  const nilaiDapatDisusut = Math.max(0, nilaiPerolehan - nilaiResidu)

  let akumulasiPenyusutan = 0
  let penyusutanPerBulan = 0
  const bulanTersusut = masaManfaat > 0 ? Math.min(umurBulan, masaManfaat) : 0

  if (nilaiDapatDisusut > 0 && bulanTersusut > 0) {
    if (metodePenyusutan === "SaldoMenurunGanda") {
      // Double declining balance: tarif = 2 / umur, diterapkan pada nilai buku.
      const tarif = (2 / masaManfaat)
      let nilaiBuku = nilaiPerolehan
      for (let i = 0; i < bulanTersusut; i++) {
        let beban = nilaiBuku * tarif
        if (nilaiBuku - beban < nilaiResidu) beban = Math.max(0, nilaiBuku - nilaiResidu)
        nilaiBuku -= beban
        akumulasiPenyusutan += beban
      }
      penyusutanPerBulan = bulanTersusut > 0 ? akumulasiPenyusutan / bulanTersusut : 0
    } else {
      // Garis lurus: (harga - residu) / masa manfaat.
      penyusutanPerBulan = masaManfaat > 0 ? nilaiDapatDisusut / masaManfaat : 0
      akumulasiPenyusutan = penyusutanPerBulan * bulanTersusut
    }
  }

  akumulasiPenyusutan = Math.min(akumulasiPenyusutan, nilaiDapatDisusut)
  const nilaiBuku = Math.max(nilaiResidu, nilaiPerolehan - akumulasiPenyusutan)
  const persenSusut =
    nilaiDapatDisusut > 0
      ? Math.min(100, (akumulasiPenyusutan / nilaiDapatDisusut) * 100)
      : nilaiPerolehan > 0
        ? 100
        : 0
  const selesai = nilaiDapatDisusut <= EPSILON || akumulasiPenyusutan >= nilaiDapatDisusut - EPSILON

  return {
    asOf: tanggal,
    metodePenyusutan,
    masaManfaat,
    umurBulan,
    sisaBulan: Math.max(0, masaManfaat - umurBulan),
    jumlahUnit,
    nilaiPerolehan,
    nilaiResidu,
    nilaiDapatDisusut,
    penyusutanPerBulan,
    penyusutanPerTahun: penyusutanPerBulan * 12,
    akumulasiPenyusutan,
    nilaiBuku,
    nilaiPerolehanTotal: nilaiPerolehan * jumlahUnit,
    nilaiResiduTotal: nilaiResidu * jumlahUnit,
    akumulasiPenyusutanTotal: akumulasiPenyusutan * jumlahUnit,
    nilaiBukuTotal: nilaiBuku * jumlahUnit,
    persenSusut,
    selesai,
  }
}

export interface RingkasanValuasi {
  jumlahAset: number
  jumlahUnit: number
  nilaiPerolehan: number
  nilaiResidu: number
  akumulasiPenyusutan: number
  nilaiBuku: number
  persenSusut: number
  asetTersusut: number
  asetAktifDisusut: number
}

/** Agregasi hasil penyusutan banyak aset menjadi satu ringkasan. */
export function ringkasValuasi(hasil: HasilPenyusutan[]): RingkasanValuasi {
  const nilaiPerolehan = hasil.reduce((s, h) => s + h.nilaiPerolehanTotal, 0)
  const nilaiBuku = hasil.reduce((s, h) => s + h.nilaiBukuTotal, 0)
  const akumulasi = hasil.reduce((s, h) => s + h.akumulasiPenyusutanTotal, 0)
  const dapatDisusut = Math.max(0, nilaiPerolehan - hasil.reduce((s, h) => s + h.nilaiResiduTotal, 0))
  return {
    jumlahAset: hasil.length,
    jumlahUnit: hasil.reduce((s, h) => s + h.jumlahUnit, 0),
    nilaiPerolehan,
    nilaiResidu: hasil.reduce((s, h) => s + h.nilaiResiduTotal, 0),
    akumulasiPenyusutan: akumulasi,
    nilaiBuku,
    persenSusut: dapatDisusut > 0 ? Math.min(100, (akumulasi / dapatDisusut) * 100) : 0,
    asetTersusut: hasil.filter((h) => h.selesai).length,
    asetAktifDisusut: hasil.filter((h) => !h.selesai && h.nilaiDapatDisusut > 0).length,
  }
}
