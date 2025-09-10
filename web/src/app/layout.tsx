import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { Toaster } from 'sonner'
import { Analytics } from '@/components/Analytics'

export const metadata: Metadata = {
  title: 'PayFlow - Advanced Payment Processing Platform',
  description: 'Professional credit card processing for modern businesses. Real-time transactions, commission management, and comprehensive analytics.',
  keywords: 'payment processing, credit card, mobile payments, POS, financial technology',
  authors: [{ name: 'PayFlow Team' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="font-nexus antialiased">
        <div className="min-h-screen bg-nexus-gradient cyber-grid">
          <AuthProvider>
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                style: {
                  background: 'rgba(19, 21, 26, 0.95)',
                  border: '1px solid rgba(0, 212, 255, 0.2)',
                  color: '#FFFFFF',
                  backdropFilter: 'blur(12px)',
                },
              }}
            />
          </AuthProvider>
        </div>
        <Analytics />
      </body>
    </html>
  )
}