import Image from 'next/image'
import { BadgeCheck, Factory, Timer } from 'lucide-react'
import { QuoteForm } from './quote-form'

const TRUST_BADGES = [
  { icon: BadgeCheck, title: 'ISO 9001:2015', caption: 'Quản lý chất lượng' },
  { icon: Factory, title: '10M+ sản phẩm', caption: 'Công suất mỗi tháng' },
  { icon: Timer, title: '100% đúng hạn', caption: 'Cam kết giao hàng' },
]

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-navy">
      <Image
        src="/images/hero-packaging.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover opacity-30"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/95 to-navy/60"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:px-6 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:py-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
            <span className="size-1.5 rounded-full bg-cta" aria-hidden="true" />
            Nhà máy in & bao bì trực tiếp — không qua trung gian
          </p>
          <h1
            id="hero-title"
            className="mt-6 text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]"
          >
            Giải Pháp In Ấn & Sản Xuất Bao Bì{' '}
            <span className="text-cta">Công Nghiệp Khép Kín</span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-slate-300">
            Từ thiết kế khuôn, in offset 6 màu đến gia công thành phẩm — tất cả trong một nhà máy. Sản
            xuất nhanh, công suất lớn, chất lượng chuẩn ISO và giá tận xưởng cho doanh nghiệp FMCG, mỹ
            phẩm, dược phẩm & điện tử.
          </p>

          <ul className="mt-10 grid gap-3 sm:grid-cols-3">
            {TRUST_BADGES.map(({ icon: Icon, title, caption }) => (
              <li
                key={title}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-sm"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-cta/15 text-cta">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-bold text-white">{title}</span>
                  <span className="text-xs text-slate-400">{caption}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <QuoteForm />
      </div>
    </section>
  )
}
