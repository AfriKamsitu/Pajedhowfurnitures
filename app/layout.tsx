import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { StoreProvider } from '@/components/store-provider'
import { AuthProvider } from '@/components/auth-provider'
import { ChatProvider } from '@/components/chat-provider'
import { ChatWidget } from '@/components/chat/chat-widget'
import './globals.css'

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})
const poppins = Poppins({
  variable: '--font-heading',
  weight: ['500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Paje Dhow Furniture — Handcrafted Living',
  description:
    'Discover a wide range of stylish and quality furniture for every room. Sofas, beds, dining sets, chairs and more.',
  generator: 'v0.app',
  icons: {
    icon: '/paje-dhow-logo.png',
    apple: '/paje-dhow-logo.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#1f3a29',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`light ${inter.variable} ${poppins.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <AuthProvider>
          <ChatProvider>
            <StoreProvider>{children}</StoreProvider>
            <ChatWidget />
          </ChatProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
