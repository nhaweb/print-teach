import type { LucideIcon } from 'lucide-react'
import { Box, Gift, Layers, Tags } from 'lucide-react'

export type Product = {
  slug: string
  icon: LucideIcon
  title: string
  description: string
  tags: readonly string[]
}

// Nội dung lấy nguyên từ copy hiện có (Services). Không thêm thông số chưa được xác thực.
export const PRODUCTS: readonly Product[] = [
  {
    slug: 'hop-giay-carton',
    icon: Box,
    title: 'In Bao bì Hộp giấy / Carton cao cấp',
    description: 'Hộp cứng, hộp âm dương, hộp carton sóng E/B cho mỹ phẩm, thực phẩm, điện tử.',
    tags: ['Ivory', 'Duplex', 'Carton sóng'],
  },
  {
    slug: 'tui-giay-gift-box',
    icon: Gift,
    title: 'In Túi giấy Thương hiệu & Gift box',
    description: 'Túi giấy quai dây, túi kraft, hộp quà tặng cao cấp cho chuỗi bán lẻ & sự kiện.',
    tags: ['Kraft', 'Couche', 'Mỹ thuật'],
  },
  {
    slug: 'tem-nhan-decal-cuon',
    icon: Tags,
    title: 'In Tem nhãn / Decal cuộn tự động',
    description: 'Decal giấy, decal nhựa PP/PE, tem bảo hành, nhãn dán máy tự động tốc độ cao.',
    tags: ['Flexo', 'Digital', 'Bế cuộn'],
  },
  {
    slug: 'mang-phuc-hop-nhua-dinh-hinh',
    icon: Layers,
    title: 'Bao bì Màng phức hợp & Nhựa định hình',
    description: 'Túi zipper, túi đáy đứng, khay nhựa định hình PET/PVC đạt chuẩn an toàn thực phẩm.',
    tags: ['PET/PE', 'OPP/CPP', 'Màng nhôm'],
  },
]

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}
