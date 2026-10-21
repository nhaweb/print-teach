/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Slug cũ (fdfacfe, 4 nhóm) → danh mục đã lọc theo nhóm.
  async redirects() {
    return [
      ['hop-giay-carton', 'hop-giay'],
      ['tui-giay-gift-box', 'tui-giay'],
      ['tem-nhan-decal-cuon', 'tem-nhan'],
      ['mang-phuc-hop-nhua-dinh-hinh', 'mang-phuc-hop'],
    ].map(([from, loai]) => ({ source: `/san-pham/${from}`, destination: `/san-pham?loai=${loai}`, permanent: false }))
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ]
  },
}

export default nextConfig
