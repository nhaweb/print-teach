import Link from 'next/link'
import { SiteHeader } from '@/components/landing/site-header'
import { SiteFooter } from '@/components/landing/site-footer'

/** PD-19 AC1: 404 thân thiện (HTTP 404). */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="py-20 md:py-28">
        <div className="mx-auto max-w-xl px-4 text-center">
          <p className="font-mono text-sm font-semibold text-cta-hover">404</p>
          <h1 className="mt-3 text-3xl font-bold text-foreground">Không tìm thấy trang</h1>
          <p className="mt-3 text-slate-600">Sản phẩm hoặc trang bạn tìm không tồn tại hoặc đã được đổi địa chỉ.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/san-pham" className="inline-flex min-h-11 items-center justify-center rounded-md border border-navy px-5 text-sm font-semibold text-foreground hover:bg-navy hover:text-white">
              Xem tất cả sản phẩm
            </Link>
            <Link href="/#bao-gia" className="inline-flex min-h-11 items-center justify-center rounded-md bg-cta px-5 text-sm font-semibold text-cta-foreground hover:bg-cta-hover">
              Nhận báo giá
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
