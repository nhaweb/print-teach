import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PML PrintTech — Sản xuất bao bì & In ấn công nghiệp khép kín',
  description:
    'PML Vietnam: in hộp giấy carton, túi giấy, tem nhãn decal cuộn, bao bì màng phức hợp. Xưởng 5.000m², chuẩn ISO 9001:2015, 10 triệu+ sản phẩm/tháng, giá tận xưởng.',
  keywords: [
    'in bao bì',
    'in hộp giấy',
    'in túi giấy',
    'in tem nhãn decal',
    'bao bì màng phức hợp',
    'xưởng in offset',
    'PML Vietnam',
  ],
  openGraph: {
    title: 'PML PrintTech — Giải pháp in ấn & bao bì công nghiệp',
    description: 'Xưởng in offset 6 màu, chuẩn ISO 9001:2015, giao hàng đúng hạn 100%.',
    locale: 'vi_VN',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={jakarta.variable}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
