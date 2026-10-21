'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { cn } from '@/lib/utils'

const FINISHES = [
  {
    id: 'ep-kim',
    label: 'Ép kim',
    en: 'Foil stamping',
    image: '/images/finish-foil.webp',
    alt: 'Ép kim vàng trên hộp giấy màu xanh navy',
    description:
      'Ép nhũ vàng, bạc, hologram bằng khuôn đồng nhiệt — tạo điểm nhấn sang trọng cho logo và họa tiết.',
    specs: ['Nhũ vàng, bạc, đồng, hologram', 'Độ chính xác ±0.15mm', 'Phù hợp: mỹ phẩm, quà tặng, rượu'],
  },
  {
    id: 'can-mang',
    label: 'Cán màng',
    en: 'Lamination',
    image: '/images/finish-lamination.webp',
    alt: 'Mẫu giấy cán màng mờ và cán màng bóng',
    description:
      'Cán màng bóng, mờ hoặc soft-touch nhung giúp chống ẩm, chống trầy và tăng cảm giác cao cấp khi cầm.',
    specs: ['Bóng / Mờ / Soft-touch', 'Chống thấm & trầy xước', 'Tăng độ bền gấp 3 lần'],
  },
  {
    id: 'phu-uv',
    label: 'Phủ UV định hình',
    en: 'Spot UV',
    image: '/images/finish-uv.webp',
    alt: 'Phủ UV định hình bóng trên nền hộp đen mờ',
    description:
      'Phủ UV cục bộ tạo hiệu ứng bóng nổi trên nền mờ, làm nổi bật tên thương hiệu và chi tiết hình ảnh.',
    specs: ['UV bóng, UV nổi 3D, UV nhám', 'Kết hợp cán màng mờ', 'Phù hợp: điện tử, F&B'],
  },
  {
    id: 'thuc-noi',
    label: 'Thúc nổi',
    en: 'Embossing',
    image: '/images/finish-emboss.webp',
    alt: 'Logo thúc nổi trên giấy mỹ thuật trắng',
    description:
      'Dập nổi hoặc dập chìm bằng khuôn nam – nữ tạo chiều sâu xúc giác, tinh tế mà không cần mực in.',
    specs: ['Thúc nổi / Thúc chìm / Đa tầng', 'Kết hợp ép kim', 'Phù hợp: giấy mỹ thuật 300gsm+'],
  },
]

export function Finishes() {
  const [active, setActive] = useState(FINISHES[0].id)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const current = FINISHES.find((f) => f.id === active) ?? FINISHES[0]

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    let next = index
    if (e.key === 'ArrowRight') next = (index + 1) % FINISHES.length
    else if (e.key === 'ArrowLeft') next = (index - 1 + FINISHES.length) % FINISHES.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = FINISHES.length - 1
    else return
    e.preventDefault()
    setActive(FINISHES[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="san-pham-mau" aria-labelledby="finishes-title" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          id="finishes-title"
          align="center"
          eyebrow="Gia công bề mặt"
          title="Hoàn thiện cao cấp — Khác biệt trên kệ hàng"
          description="Khám phá các kỹ thuật gia công bề mặt giúp bao bì của bạn nổi bật và tăng giá trị cảm nhận."
        />

        <div
          role="tablist"
          aria-label="Kỹ thuật gia công bề mặt"
          className="mx-auto mt-10 flex max-w-3xl gap-1 overflow-x-auto rounded-lg border border-border bg-white p-1"
        >
          {FINISHES.map((f, i) => {
            const selected = f.id === active
            return (
              <button
                key={f.id}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                role="tab"
                id={`tab-${f.id}`}
                aria-selected={selected}
                aria-controls={`panel-${f.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(f.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={cn(
                  'relative flex-1 whitespace-nowrap rounded-md px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  selected ? 'text-white' : 'text-slate-600 hover:bg-muted hover:text-foreground',
                )}
              >
                {selected && (
                  <motion.span
                    layoutId="finish-tab"
                    className="absolute inset-0 rounded-md bg-navy"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.45 }}
                  />
                )}
                <span className="relative">{f.label}</span>
              </button>
            )
          })}
        </div>

        <div
          role="tabpanel"
          id={`panel-${current.id}`}
          aria-labelledby={`tab-${current.id}`}
          className="mt-10 overflow-hidden rounded-2xl border border-border bg-white"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid lg:grid-cols-2"
            >
              <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[420px]">
                <Image
                  src={current.image}
                  alt={current.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12">
                <p className="font-mono text-xs font-semibold uppercase tracking-widest text-cta-text">
                  {current.en}
                </p>
                <h3 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">{current.label}</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">{current.description}</p>
                <ul className="mt-6 space-y-3">
                  {current.specs.map((spec) => (
                    <li key={spec} className="flex items-center gap-3 text-sm font-medium text-foreground">
                      <span className="grid size-5 place-items-center rounded-full bg-accent text-accent-foreground">
                        <Check className="size-3" aria-hidden="true" />
                      </span>
                      {spec}
                    </li>
                  ))}
                </ul>
                <a
                  href="#bao-gia"
                  className="mt-8 inline-flex h-11 w-fit items-center rounded-md border border-navy px-5 text-sm font-semibold text-foreground transition-colors hover:bg-navy hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Đặt làm mẫu {current.label.toLowerCase()}
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="mt-10 text-center">
          <Link
            href="/san-pham"
            className="text-sm font-semibold text-foreground underline underline-offset-4 hover:text-cta-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Xem tất cả sản phẩm
          </Link>
        </p>
      </div>
    </section>
  )
}
