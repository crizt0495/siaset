import type { Metadata, Viewport } from "next"
import { Space_Grotesk, Archivo_Black } from "next/font/google"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-siaset",
  display: "swap",
})

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-siaset-display",
  display: "swap",
})

export const metadata: Metadata = {
  title: "SiAset GKJW - Sistem Inventaris Aset",
  description: "Sistem Informasi Inventaris Aset GKJW Jemaat Probolinggo",
  applicationName: "SiAset",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SiAset",
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#14130f" },
    { media: "(prefers-color-scheme: light)", color: "#16161a" },
  ],
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