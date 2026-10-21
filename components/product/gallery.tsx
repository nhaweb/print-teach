'use client'

import { useRef, useState } from 'react'
import { Expand } from 'lucide-react'
import type { ProductImage } from '@/content/products'
import { cn } from '@/lib/utils'
import { Lightbox } from './lightbox'
import { SafeImage } from './safe-image'

/** PD-06: ảnh lớn + thumbnail; bấm ảnh lớn mở lightbox; đóng thì focus về ảnh lớn. */
export function Gallery({ images, name }: { images: readonly ProductImage[]; name: string }) {
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const mainRef = useRef<HTMLButtonElement>(null)
  const img = images[active]
  return (
    <div>
      <button
        ref={mainRef}
        type="button"
        data-testid="gallery-main"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="group relative block aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <SafeImage
          src={img.src}
          alt={img.alt}
          fill
          priority={active === 0}
          sizes="(min-width:1024px) 55vw, 100vw"
          className="object-cover"
        />
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-slate-950/70 px-3 py-1.5 text-xs font-semibold text-white">
          <Expand className="size-3.5" aria-hidden="true" />
          Phóng to
        </span>
        <span className="sr-only">Mở ảnh lớn: {img.alt}</span>
      </button>
      <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5" aria-label={`Ảnh ${name}`}>
        {images.map((im, i) => (
          <li key={`${im.src}-${i}`}>
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-current={i === active ? 'true' : undefined}
              className={cn(
                'relative block aspect-[4/3] w-full min-h-11 overflow-hidden rounded-md border-2 bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                i === active ? 'border-cta' : 'border-transparent opacity-80 hover:opacity-100',
              )}
            >
              <SafeImage src={im.src} alt="" fill loading="lazy" sizes="120px" className="object-cover" />
              <span className="sr-only">Xem ảnh {i + 1}: {im.alt}</span>
            </button>
          </li>
        ))}
      </ul>
      {open && (
        <Lightbox
          images={images}
          index={active}
          onIndex={setActive}
          label={`Ảnh sản phẩm ${name}`}
          onClose={() => {
            setOpen(false)
            requestAnimationFrame(() => mainRef.current?.focus())
          }}
        />
      )}
    </div>
  )
}

/** PD-13: lưới portfolio, bấm mở lightbox (dùng lại PD-06). */
export function PortfolioGrid({ items }: { items: readonly { src: string; alt: string; caption: string }[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <li key={`${it.src}-${i}`}>
            <figure>
              <button
                ref={(el) => {
                  refs.current[i] = el
                }}
                type="button"
                onClick={() => setOpen(i)}
                className="relative block aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <SafeImage src={it.src} alt={it.alt} fill loading="lazy" sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
                <span className="absolute left-2 top-2 rounded bg-slate-950/75 px-2 py-0.5 text-[11px] font-semibold text-white">
                  Ảnh minh hoạ
                </span>
              </button>
              <figcaption className="mt-2 text-sm text-slate-600">{it.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
      {open !== null && (
        <Lightbox
          images={items}
          index={open}
          onIndex={setOpen}
          label="Portfolio"
          onClose={() => {
            const i = open
            setOpen(null)
            requestAnimationFrame(() => refs.current[i]?.focus())
          }}
        />
      )}
    </>
  )
}
