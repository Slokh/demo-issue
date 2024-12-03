import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'
import { GeistSans } from 'geist/font/sans'

export const metadata: Metadata = {
  title: 'demo',
  description: 'demo',
  openGraph: {
    title: 'demo',
    description: 'demo',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} antialiased min-h-screen w-full`}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
