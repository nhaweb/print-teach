import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/landing/site-header'
import { SiteFooter } from '@/components/landing/site-footer'
import { Catalog } from '@/components/product/catalog'

const title = 'Sản phẩm bao bì & in ấn | PML PrintTech'
const description =
  'Danh mục sản phẩm bao bì mẫu của PML PrintTech: hộp giấy, túi giấy, tem nhãn decal, túi màng phức hợp. Lọc theo loại và chất liệu, xem giá mẫu và MOQ.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/san-pham' },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { title, description, url: '/san-pham', siteName: 'PML PrintTech', locale: 'vi_VN', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
}

export default function CatalogPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-muted/30 py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-600">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link href="/" className="hover:text-foreground hover:underline">Trang chủ</Link></li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" className="font-semibold text-foreground">Sản phẩm</li>
            </ol>
          </nav>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Sản phẩm bao bì &amp; in ấn</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Dữ liệu và giá mẫu tham khảo, chưa gồm VAT. Chọn sản phẩm để xem thông số và nhận báo giá chi tiết.
          </p>
          <div className="mt-8">
            <Catalog />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
