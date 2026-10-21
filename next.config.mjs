/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // PD-B02: bật tối ưu ảnh của Next (Vercel hỗ trợ sẵn, mặc định trả WebP theo kích thước thiết bị).
    qualities: [70, 75],
  },
  // Slug cũ (fdfacfe, 4 nhóm) → danh mục đã lọc theo nhóm.
  async redirects() {
    return [
      ['hop-giay-carton', 'hop-giay'],
      ['tui-giay-gift-box', 'tui-giay'],
      ['tem-nhan-decal-cuon', 'tem-nhan'],
      ['mang-phuc-hop-nhua-dinh-hinh', 'mang-phuc-hop'],
    ].map(([from, loai]) => ({ source: `/san-pham/${from}`, destination: `/san-pham?loai=${loai}`, permanent: true }))
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
