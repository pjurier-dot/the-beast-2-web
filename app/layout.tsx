import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "The Beast 2",
  description: 'Launcher de Minecraft creado con Launcher Creator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
