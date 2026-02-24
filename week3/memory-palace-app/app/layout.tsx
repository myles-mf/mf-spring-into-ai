import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Memory Palace — Spring Into AI Week 3',
  description:
    'AI-powered Memory Palace (Method of Loci). Remember anything by placing it in your space. Interactive tutorial for Week 3.',
}

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
