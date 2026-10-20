import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// US06-02: /sitemap.xml trả 200. Lưu ý: MVP đang noindex (GAP-23/24, OPEN-7) nên sitemap
// chỉ để đạt AC; Google sẽ không index trang cho tới khi bỏ noindex ở giai đoạn 2.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 }]
}
