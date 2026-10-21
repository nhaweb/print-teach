'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { CATEGORIES } from '@/content/products'
import { SectionHeading } from './section-heading'


export function Services() {
  return (
    <section id="dich-vu" aria-labelledby="services-title" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="services-title"
            eyebrow="Dịch vụ cốt lõi"
            title="Một nhà máy — Trọn bộ giải pháp bao bì"
            description="Chủ động 100% công đoạn từ chế bản, in, gia công đến đóng gói, giúp doanh nghiệp kiểm soát chất lượng và tối ưu chi phí."
          />
          <a
            href="#bao-gia"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Tư vấn chọn bao bì
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map(({ value, icon: Icon, title, description, tags }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
            >
              <article className="group relative flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-navy hover:shadow-xl hover:shadow-slate-900/10 focus-within:border-navy">
                <span className="grid size-12 place-items-center rounded-lg bg-navy text-cta transition-colors duration-300 group-hover:bg-cta group-hover:text-cta-foreground">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <span className="absolute right-6 top-6 font-mono text-xs font-semibold text-slate-400">
                  0{i + 1}
                </span>
                <h3 className="mt-6 text-lg font-bold leading-snug text-foreground">{title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Chất liệu phổ biến">
                  {tags.map((tag) => (
                    <li key={tag} className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-slate-600">
                      {tag}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/san-pham?loai=${value}`}
                  className="mt-6 inline-flex items-center gap-1.5 border-t border-border pt-4 text-sm font-semibold text-foreground after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none group-hover:text-cta-hover"
                >
                  Xem chi tiết
                  <span className="sr-only">: {title}</span>
                  <ArrowUpRight
                    className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </article>
            </motion.li>
          ))}
        </ul>
        <div className="mt-8 flex justify-center">
          <Link
            href="/san-pham"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-navy px-5 text-sm font-semibold text-foreground transition-colors hover:bg-navy hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Xem tất cả sản phẩm
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
