import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { PRODUCTS, validateProducts } from '@/content/products'

// US06-02 + PD-17 AC5. MVP vẫn noindex (OPEN-7) nên sitemap chỉ để sẵn cho go-live.
export default function sitemap(): MetadataRoute.Sitemap {
  // PD-01 AC1: dữ liệu sản phẩm sai → build fail.
  const errs = validateProducts()
  if (errs.length) throw new Error(`content/products.ts không hợp lệ:\n${errs.join('\n')}`)
  const lastModified = new Date()
  // Không có dấu "/" cuối — khớp canonical/og:url.
  return [
    { url: SITE_URL, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/san-pham`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    ...PRODUCTS.map((p) => ({
      url: `${SITE_URL}/san-pham/${p.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
