'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { animate, useInView, useReducedMotion } from 'framer-motion'
import { Cog, Printer, Scissors, Warehouse } from 'lucide-react'
import { SectionHeading } from './section-heading'

const STATS = [
  { value: 15, suffix: '+', decimals: 0, label: 'Năm kinh nghiệm' },
  { value: 500, suffix: '+', decimals: 0, label: 'Đối tác doanh nghiệp' },
  { value: 99.8, suffix: '%', decimals: 1, label: 'Chuẩn màu (Delta E < 2)' },
  { value: 10, suffix: 'M+', decimals: 0, label: 'Sản phẩm / tháng' },
]

const MACHINES = [
  { icon: Printer, title: 'Máy in Offset 6 màu', detail: 'Heidelberg CX 102 — 15.000 tờ/giờ, phủ UV inline' },
  { icon: Scissors, title: 'Máy bế tự động', detail: 'Bobst SP 106 — bế, ép nhũ chính xác ±0.1mm' },
  { icon: Cog, title: 'Dây chuyền dán hộp', detail: 'Tự động dán đáy khóa, hộp 4–6 góc' },
  { icon: Warehouse, title: 'Xưởng 5.000m²', detail: 'Kho thành phẩm kiểm soát nhiệt độ & độ ẩm' },
]

function Counter({ value, suffix, decimals }: { value: number; suffix: string; decimals: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setDisplay(value)
      return
    }
    const controls = animate(0, value, {
      duration: 1.6,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(v),
    })
    return () => controls.stop()
  }, [inView, value, reduce])

  return (
    <span ref={ref} className="tabular-nums">
      {display.toLocaleString('vi-VN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      <span className="text-cta">{suffix}</span>
    </span>
  )
}

export function Factory() {
  return (
    <section id="nang-luc" aria-labelledby="factory-title" className="bg-navy py-20 text-white md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          id="factory-title"
          tone="dark"
          eyebrow="Năng lực sản xuất"
          title="Hệ thống máy móc nhập khẩu từ Đức & Thụy Sĩ"
          description="Đầu tư liên tục vào thiết bị và quy trình để đảm bảo mỗi lô hàng đều đồng nhất màu sắc, đúng kích thước và đúng tiến độ."
        />

        <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col-reverse gap-1 bg-navy p-6 md:p-8">
              <dt className="text-sm text-slate-400">{s.label}</dt>
              <dd className="text-3xl font-extrabold tracking-tight md:text-5xl">
                <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
          <figure className="group relative overflow-hidden rounded-xl lg:col-span-2 lg:row-span-2">
            <Image
              src="/images/factory-offset.png"
              alt="Máy in offset 6 màu đang vận hành tại xưởng PML"
              width={1200}
              height={800}
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="aspect-[16/10] h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/95 to-transparent p-6 pt-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-cta">Xưởng in chính</p>
              <p className="mt-1 text-lg font-bold">Khu in offset 6 màu + phủ UV inline</p>
            </figcaption>
          </figure>
          <figure className="group relative overflow-hidden rounded-xl">
            <Image
              src="/images/factory-diecut.png"
              alt="Máy bế tự động xử lý tờ in carton"
              width={800}
              height={600}
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="aspect-[4/3] h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/95 to-transparent p-5 pt-12 text-sm font-bold">
              Khu bế & gia công thành phẩm
            </figcaption>
          </figure>
          <ul className="grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
            {MACHINES.map(({ icon: Icon, title, detail }) => (
              <li key={title} className="flex items-start gap-3 bg-navy-soft p-4 transition-colors hover:bg-slate-700/60">
                <Icon className="mt-0.5 size-5 shrink-0 text-cta" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
