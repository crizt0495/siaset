"use client"

import { useState } from "react"
import { ScanLine, Search, Trash2, Package, User, MapPin } from "lucide-react"

interface ScanResult {
  id: string
  type: string
  details: Record<string, string>
  scannedAt: Date
}

export default function ScanPage() {
  const [qrInput, setQrInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [history, setHistory] = useState<ScanResult[]>([])
  const [error, setError] = useState("")

  const handleScan = async () => {
    if (!qrInput.trim()) return
    setLoading(true)
    setError("")
    setResult(null)
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrCode: qrInput.trim() }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || "Gagal memproses QR code")
        return
      }
      const scanResult: ScanResult = {
        id: json.data?.id || Date.now().toString(),
        type: json.data?.type || "unknown",
        details: json.data?.details || {},
        scannedAt: new Date(),
      }
      setResult(scanResult)
      setHistory(prev => [scanResult, ...prev].slice(0, 20))
      setQrInput("")
    } catch {
      setError("Terjadi kesalahan jaringan")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleScan()
  }

  const typeIcon = (type: string) => {
    switch (type) {
      case "barang": return <Package className="w-5 h-5" />
      case "user": return <User className="w-5 h-5" />
      case "lokasi": return <MapPin className="w-5 h-5" />
      default: return <ScanLine className="w-5 h-5" />
    }
  }

  const typeBadge = (type: string) => {
    const colors: Record<string, string> = {
      barang: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      user: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      lokasi: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    }
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors[type] || "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}>
        {typeIcon(type)}
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    )
  }

  const clearHistory = () => setHistory([])

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <ScanLine className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">QR Scanner</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Scan atau masukkan kode QR secara manual</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Masukkan Konten QR Code</label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Contoh: BRG-001 atau kode QR lainnya..."
              value={qrInput}
              onChange={e => setQrInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-9 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>
          <button
            onClick={handleScan}
            disabled={loading || !qrInput.trim()}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            <ScanLine className="w-4 h-4" />
            {loading ? "Memproses..." : "Scan"}
          </button>
        </div>
        {error && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Hasil Scan</h2>
            {typeBadge(result.type)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(result.details).map(([key, value]) => (
              <div key={key} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                <p className="text-sm text-gray-800 dark:text-white font-medium">{value}</p>
              </div>
            ))}
          </div>
          {Object.keys(result.details).length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">Tidak ada detail ditemukan untuk QR code ini.</p>
          )}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Riwayat Scan</h2>
          {history.length > 0 && (
            <button onClick={clearHistory} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors">
              <Trash2 className="w-4 h-4" />
              Hapus Riwayat
            </button>
          )}
        </div>
        {history.length === 0 ? (
          <div className="p-8 text-center">
            <ScanLine className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Belum ada riwayat scan</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {history.map((item, i) => (
              <div key={`${item.id}-${i}`} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <div className="flex items-center gap-3">
                  {typeIcon(item.type)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800 dark:text-white">{item.details.nama || item.details.kodeBarang || item.id}</span>
                      {typeBadge(item.type)}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {item.scannedAt.toLocaleTimeString("id-ID")} - {item.scannedAt.toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 font-mono">{item.id}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
