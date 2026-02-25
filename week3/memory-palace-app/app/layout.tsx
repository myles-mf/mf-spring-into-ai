import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Memory Palace — Spring Into AI Week 3',
  description:
    'Learn the Method of Loci: put what you want to remember in a room (template or your photo). AI generates vivid associations; you explore and quiz. Interactive tutorial — learning by doing.',
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
