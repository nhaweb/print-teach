import { ArrowRight, MessageCircle } from 'lucide-react'

export function CtaBand() {
  return (
    <section aria-labelledby="cta-title" className="px-4 pb-20 md:px-6 md:pb-28">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-2xl bg-cta p-8 md:flex-row md:items-center md:p-12">
        <div className="max-w-2xl">
          <h2 id="cta-title" className="text-balance text-2xl font-extrabold tracking-tight text-cta-foreground md:text-3xl">
            Nhận mẫu thử miễn phí cho đơn hàng đầu tiên
          </h2>
          <p className="mt-3 leading-relaxed text-navy-soft">
            Gửi file thiết kế hoặc mô tả sản phẩm — kỹ sư PML phản hồi phương án kết cấu & báo giá trong 15 phút.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <a
            href="#bao-gia"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-navy px-6 font-semibold text-white transition-colors hover:bg-navy-soft active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-cta"
          >
            Yêu cầu báo giá
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
          <a
            href="https://zalo.me/0901234567"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md border-2 border-navy px-6 font-semibold text-navy transition-colors hover:bg-navy/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Chat Zalo
          </a>
        </div>
      </div>
    </section>
  )
}
