import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SiAset GKJW - Sistem Inventaris Aset",
    short_name: "SiAset",
    description: "Sistem Informasi Inventaris Aset GKJW Jemaat Probolinggo",
    start_url: "/login",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f2ecdf",
    theme_color: "#16161a",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  }
}