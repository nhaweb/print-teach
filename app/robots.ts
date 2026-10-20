import type { MetadataRoute } from 'next'

// Cho phép crawl để bot đọc được thẻ <meta name="robots" content="noindex, nofollow">
// (nếu Disallow thì bot không thấy noindex). Không khai báo sitemap vì trang đang noindex.
// Giai đoạn 2 (OPEN-7): bỏ noindex trong app/layout.tsx và thêm `sitemap: \`${SITE_URL}/sitemap.xml\``.
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/' }] }
}
