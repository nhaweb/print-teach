import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Logo } from '@/components/landing/logo'
import { SiteFooter } from '@/components/landing/site-footer'
import { PRODUCTS, getProduct } from '@/lib/products'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return {}
  const path = `/san-pham/${product.slug}`
  const title = `${product.title} — PML PrintTech`
  return {
    title,
    description: product.description,
    alternates: { canonical: path },
    // Giữ noindex như toàn site (GAP-23/24).
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
    openGraph: {
      title,
      description: product.description,
      url: path,
      siteName: 'PML PrintTech',
      locale: 'vi_VN',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description: product.description },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()
  const { icon: Icon, title, description, tags } = product

  return (
    <>
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 md:px-6">
          <Link href="/" aria-label="PML PrintTech — Trang chủ">
            <Logo />
          </Link>
          <Link
            href="/#bao-gia"
            className="inline-flex items-center gap-1.5 rounded-md bg-cta px-4 py-2 text-sm font-semibold text-cta-foreground hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Nhận báo giá
          </Link>
        </div>
      </header>
      <main className="py-12 md:py-20">
        <article className="mx-auto max-w-3xl px-4 md:px-6">
          <Link
            href="/#dich-vu"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Quay lại dịch vụ
          </Link>
          <span className="mt-8 grid size-14 place-items-center rounded-lg bg-navy text-cta">
            <Icon className="size-7" aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">{title}</h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">{description}</p>
          <h2 className="mt-10 text-sm font-bold uppercase tracking-[0.18em] text-cta-hover">Chất liệu phổ biến</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li key={tag} className="rounded bg-muted px-3 py-1 text-sm font-medium text-slate-600">
                {tag}
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl bg-navy p-8 text-white sm:flex-row sm:items-center sm:justify-between">
            <p className="text-lg font-semibold">Cần báo giá cho {title.toLowerCase()}?</p>
            <Link
              href="/#bao-gia"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-cta px-5 py-3 text-sm font-semibold text-cta-foreground hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Nhận báo giá ngay
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  )
}
