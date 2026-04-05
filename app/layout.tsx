import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Liga eFootball Mobile",
  description: "Platform liga eFootball Mobile terlengkap — klasemen, jadwal, statistik, dan data tim/pemain.",
  keywords: ["efootball", "liga", "mobile", "esports", "gaming"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className="dark">
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  )
}
