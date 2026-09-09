import type { Metadata } from "next"
import { Space_Grotesk, Archivo_Black } from "next/font/google"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-siaset",
})

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-siaset-display",
})

export const metadata: Metadata = {
  title: "SiAset GKJW - Sistem Inventaris Aset",
  description: "Sistem Informasi Inventaris Aset GKJW Jemaat Probolinggo",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${archivoBlack.variable}`}>
        {children}
      </body>
    </html>
  )
}