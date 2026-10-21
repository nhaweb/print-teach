import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { formatVnd } from '@/lib/quote'
import { fromPrice, materialLabel, type Product } from '@/content/products'
import { SafeImage } from './safe-image'

const nf = new Intl.NumberFormat('vi-VN')

/** Card dùng chung cho danh mục (PD-02) và sản phẩm liên quan (PD-16). Cả card bấm được. */
export function ProductCard({ product, headingLevel = 'h2' }: { product: Product; headingLevel?: 'h2' | 'h3' }) {
  const H = headingLevel
  const price = fromPrice(product)
  const cover = product.images[0]
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-navy hover:shadow-xl hover:shadow-slate-900/10 focus-within:border-navy focus-within:ring-2 focus-within:ring-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <SafeImage
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <H className="text-lg font-bold leading-snug text-foreground">
          <Link
            href={`/san-pham/${product.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none group-hover:text-cta-hover"
          >
            {product.name}
          </Link>
        </H>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{product.short_description}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Chất liệu">
          {product.materials.map((m) => (
            <li key={m} className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-slate-600">
              {materialLabel(m)}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-border pt-4 text-sm">
          <div>
            <p className="text-slate-600">MOQ từ {nf.format(product.moq)} sp</p>
            {price && (
              <p className="font-semibold text-foreground">
                Giá mẫu từ <span className="tabular-nums">{formatVnd(price.min)}</span> đ/sp
              </p>
            )}
          </div>
          <ArrowUpRight
            className="size-5 shrink-0 text-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </div>
      </div>
    </article>
  )
}
