import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Download, MessageCircle } from 'lucide-react'
import { SiteHeader } from '@/components/landing/site-header'
import { SiteFooter } from '@/components/landing/site-footer'
import { Gallery, PortfolioGrid } from '@/components/product/gallery'
import { Faq } from '@/components/product/faq'
import { ProductCard } from '@/components/product/product-card'
import { SafeImage } from '@/components/product/safe-image'
import {
  Configurator,
  FinishPickButton,
  MobileContactBar,
  ProductQuoteForm,
  ProductQuoteProvider,
} from '@/components/product/product-quote'
import {
  PRINT_METHOD_LABELS,
  PRODUCTS,
  finishById,
  getProduct,
  getRelated,
  materialLabel,
  typeLabel,
} from '@/content/products'
import { SITE_URL, ZALO_URL } from '@/lib/site'

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
  const title = product.seo.title ?? `${product.name} | PML PrintTech`
  const description = product.seo.description
  const image = { url: product.images[0].src, width: product.images[0].width, height: product.images[0].height, alt: product.images[0].alt }
  return {
    title,
    description,
    alternates: { canonical: path },
    // PD-17 AC3: noindex giữ nguyên như toàn site (OPEN-7).
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
    openGraph: { title, description, url: path, siteName: 'PML PrintTech', locale: 'vi_VN', images: [image] },
    // Next Metadata không hỗ trợ og:type=product → khai báo qua `other`.
    other: { 'og:type': 'product' },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
  }
}

const nf = new Intl.NumberFormat('vi-VN')
const h2 = 'text-2xl font-bold tracking-tight text-foreground'

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const url = `${SITE_URL}/san-pham/${product.slug}`
  const catHref = `/san-pham?loai=${product.packaging_type}`
  const related = getRelated(product)

  const specs: [string, string | undefined][] = [
    ['Kích thước tiêu chuẩn', [...product.sizes.map((s) => s.label), 'Theo yêu cầu'].join('; ')],
    ['Chất liệu', product.materials.map(materialLabel).join(', ')],
    ['Định lượng / độ dày', product.gsm],
    ['Phương pháp in', product.print_methods.map((m) => PRINT_METHOD_LABELS[m]).join(', ')],
    ['Số màu', product.colors],
    ['Gia công bề mặt', product.finishes.map((f) => finishById(f)?.label ?? f).join(', ')],
    ['MOQ', `${nf.format(product.moq)} sp`],
    ['Thời gian sản xuất', `${product.lead_time_days.min}–${product.lead_time_days.max} ngày làm việc (sau khi duyệt mẫu)`],
    ['Chứng nhận / tiêu chuẩn', product.certifications?.join(', ')],
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images.map((i) => `${SITE_URL}${i.src}`),
      brand: { '@type': 'Brand', name: 'PML' },
      url,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Sản phẩm', item: `${SITE_URL}/san-pham` },
        { '@type': 'ListItem', position: 3, name: typeLabel(product.packaging_type), item: `${SITE_URL}${catHref}` },
        { '@type': 'ListItem', position: 4, name: product.name, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: product.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <SiteHeader />
      <ProductQuoteProvider slug={product.slug}>
        <main className="pb-24 pt-6 md:pb-16 md:pt-10">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <nav aria-label="Breadcrumb" className="text-sm text-slate-600">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li><Link href="/" className="hover:text-foreground hover:underline">Trang chủ</Link></li>
                <li aria-hidden="true">›</li>
                <li><Link href="/san-pham" className="hover:text-foreground hover:underline">Sản phẩm</Link></li>
                <li aria-hidden="true">›</li>
                <li><Link href={catHref} className="hover:text-foreground hover:underline">{typeLabel(product.packaging_type)}</Link></li>
                <li aria-hidden="true">›</li>
                <li aria-current="page" className="font-semibold text-foreground">{product.name}</li>
              </ol>
            </nav>

            <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
              <div className="min-w-0">
                <Gallery images={product.images} name={product.name} />
              </div>
              <div className="min-w-0 lg:row-span-2">
                <div className="lg:sticky lg:top-24">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cta-hover">{typeLabel(product.packaging_type)}</p>
                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">{product.name}</h1>
                  <p className="mt-3 leading-relaxed text-slate-600">{product.description}</p>
                  <p className="mt-2 text-xs text-slate-500">Nội dung, ảnh và giá trên trang là dữ liệu mẫu.</p>
                  <div className="mt-5">
                    <Configurator />
                  </div>
                </div>
              </div>

              <div className="min-w-0 space-y-14">
                <section aria-labelledby="specs-title">
                  <h2 id="specs-title" className={h2}>Thông số kỹ thuật</h2>
                  <table className="mt-4 w-full border-collapse overflow-hidden rounded-xl border border-border bg-white text-sm">
                    <tbody>
                      {specs
                        .filter((r): r is [string, string] => Boolean(r[1]))
                        .map(([k, v]) => (
                          <tr key={k} className="border-b border-border last:border-0">
                            <th scope="row" className="w-2/5 bg-muted/50 px-3 py-3 text-left align-top font-semibold text-slate-700 sm:px-4">{k}</th>
                            <td className="break-words px-3 py-3 text-foreground sm:px-4">{v}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <p className="mt-2 text-xs text-slate-600">Thông số mẫu, có thể tuỳ chỉnh theo yêu cầu.</p>
                </section>

                <section aria-labelledby="finishes-title">
                  <h2 id="finishes-title" className={h2}>Gia công khả dụng</h2>
                  <p className="mt-1 text-sm text-slate-600">Bấm để thêm vào cấu hình.</p>
                  <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {product.finishes.map((id) => {
                      const f = finishById(id)
                      if (!f) return null
                      return (
                        <li key={id}>
                          <FinishPickButton id={id}>
                            <span className="relative block aspect-[16/9] w-full bg-muted">
                              <SafeImage src={f.icon} alt="" fill loading="lazy" sizes="(min-width:640px) 30vw, 100vw" className="object-cover" />
                            </span>
                            <span className="block p-4">
                              <span className="block font-semibold text-foreground">{f.label}</span>
                              <span className="mt-1 block text-sm text-slate-600">{f.description}</span>
                            </span>
                          </FinishPickButton>
                        </li>
                      )
                    })}
                  </ul>
                </section>

                <section aria-labelledby="apps-title">
                  <h2 id="apps-title" className={h2}>Ứng dụng</h2>
                  <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {product.industries.map((i) => (
                      <li key={i.id} className="rounded-xl border border-border bg-white p-4">
                        <h3 className="font-semibold text-foreground">{i.label}</h3>
                        <p className="mt-1 text-sm text-slate-600">{i.example}</p>
                      </li>
                    ))}
                  </ul>
                </section>

                {product.portfolio && product.portfolio.length > 0 && (
                  <section aria-labelledby="portfolio-title">
                    <h2 id="portfolio-title" className={h2}>Sản phẩm thực tế</h2>
                    <div className="mt-4"><PortfolioGrid items={product.portfolio} /></div>
                  </section>
                )}

                {product.faqs.length > 0 && (
                  <section aria-labelledby="faq-title">
                    <h2 id="faq-title" className={h2}>Câu hỏi thường gặp</h2>
                    <div className="mt-4"><Faq items={product.faqs} /></div>
                    <p className="mt-3 text-sm text-slate-700">
                      Chưa thấy câu trả lời?{' '}
                      <a href={ZALO_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold underline underline-offset-4">
                        <MessageCircle className="size-4" aria-hidden="true" /> Hỏi PML qua Zalo
                      </a>
                    </p>
                  </section>
                )}

                {product.downloads && product.downloads.length > 0 && (
                  <section aria-labelledby="dl-title">
                    <h2 id="dl-title" className={h2}>Tài liệu tải về</h2>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      {product.downloads.map((d) => (
                        <a
                          key={d.file}
                          href={d.file}
                          download
                          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-navy px-4 text-sm font-semibold text-foreground hover:bg-navy hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <Download className="size-4" aria-hidden="true" />
                          {d.type === 'spec' ? 'Spec sheet (PDF)' : 'Dieline mẫu (PDF)'} · {d.size_kb} KB
                        </a>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-slate-600">File mẫu dùng chung cho nhóm sản phẩm, có watermark &quot;MẪU&quot;.</p>
                  </section>
                )}

                <section aria-label="Yêu cầu báo giá">
                  <ProductQuoteForm />
                </section>
              </div>
            </div>

            {related.length > 0 && (
              <section aria-labelledby="related-title" className="mt-16">
                <h2 id="related-title" className={h2}>Sản phẩm liên quan</h2>
                <ul className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((p) => (
                    <li key={p.slug}><ProductCard product={p} headingLevel="h3" /></li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </main>
        <MobileContactBar />
      </ProductQuoteProvider>
      {/* PD-11 AC2: chừa chỗ cho thanh liên hệ cố định trên mobile. */}
      <div className="pb-12 md:pb-0">
        <SiteFooter />
      </div>
    </>
  )
}
