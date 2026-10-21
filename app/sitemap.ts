import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { PRODUCTS } from '@/lib/products'

// US06-02: /sitemap.xml trả 200. Lưu ý: MVP đang noindex (GAP-23/24, OPEN-7) nên sitemap
// chỉ để đạt AC; Google sẽ không index trang cho tới khi bỏ noindex ở giai đoạn 2.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  // Không có dấu "/" cuối — khớp canonical/og:url.
  return [
    { url: SITE_URL, lastModified, changeFrequency: 'monthly', priority: 1 },
    ...PRODUCTS.map((p) => ({
      url: `${SITE_URL}/san-pham/${p.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
