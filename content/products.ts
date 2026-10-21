/**
 * Nguồn dữ liệu sản phẩm duy nhất (PD-01, spec US-product-detail §5.1).
 * TOÀN BỘ nội dung dưới đây là DỮ LIỆU MẪU cho MVP (D2/D5): tên, thông số, ảnh, FAQ, file tải về
 * đều là minh hoạ và cần PML/khách xác nhận trước khi go-live.
 */
import type { LucideIcon } from 'lucide-react'
import { Box, Gift, Layers, Tags } from 'lucide-react'
import {
  MATERIALS,
  PACKAGING_TYPES,
  QUANTITY_TIERS,
  estimateUnitPrice,
  type Material,
  type PackagingType,
  type PriceEstimate,
} from '@/lib/quote'

export type PrintMethod = 'offset' | 'flexo' | 'digital' | 'gravure'
export type FinishId = 'can-mang-bong' | 'can-mang-mo' | 'ep-nhu' | 'uv-dinh-hinh' | 'dap-noi' | 'be-cua-so' | 'phu-uv'

export type ProductImage = { src: string; alt: string; width: number; height: number }
export type ProductSize = { id: string; label: string; w_mm: number; h_mm: number; d_mm?: number }
export type Product = {
  slug: string
  name: string
  packaging_type: PackagingType
  short_description: string
  description: string
  images: readonly ProductImage[]
  materials: readonly Material[]
  sizes: readonly ProductSize[]
  gsm: string
  print_methods: readonly PrintMethod[]
  colors?: string
  finishes: readonly FinishId[]
  moq: number
  lead_time_days: { min: number; max: number }
  certifications?: readonly string[]
  industries: readonly { id: string; label: string; example: string }[]
  portfolio?: readonly { src: string; alt: string; caption: string }[]
  faqs: readonly { q: string; a: string }[]
  downloads?: readonly { type: 'spec' | 'dieline'; file: string; size_kb: number }[]
  related?: readonly string[]
  seo: { title?: string; description: string }
  sort_order: number
}

export const PRINT_METHOD_LABELS: Record<PrintMethod, string> = {
  offset: 'Offset',
  flexo: 'Flexo',
  digital: 'Digital',
  gravure: 'Ống đồng',
}

/** Danh mục gia công dùng chung (§5.1). Ảnh lấy lại từ section Gia công ở trang chủ. */
export const FINISHES: readonly { id: FinishId; label: string; description: string; icon: string }[] = [
  { id: 'can-mang-bong', label: 'Cán màng bóng', description: 'Bề mặt bóng, chống ẩm và trầy xước, màu in tươi hơn.', icon: '/images/finish-lamination.webp' },
  { id: 'can-mang-mo', label: 'Cán màng mờ', description: 'Bề mặt mờ sang trọng, hạn chế bám vân tay, hợp kết hợp UV/ép nhũ.', icon: '/images/finish-lamination.webp' },
  { id: 'ep-nhu', label: 'Ép nhũ', description: 'Ép nhũ vàng, bạc, hologram bằng khuôn đồng nhiệt làm nổi bật logo.', icon: '/images/finish-foil.webp' },
  { id: 'uv-dinh-hinh', label: 'UV định hình', description: 'Phủ UV cục bộ tạo điểm bóng nổi trên nền mờ.', icon: '/images/finish-uv.webp' },
  { id: 'dap-noi', label: 'Dập nổi', description: 'Dập nổi/chìm bằng khuôn nam – nữ tạo chiều sâu xúc giác.', icon: '/images/finish-emboss.webp' },
  { id: 'be-cua-so', label: 'Bế cửa sổ', description: 'Bế ô cửa sổ, dán màng trong để khách nhìn thấy sản phẩm bên trong.', icon: '/images/factory-diecut.webp' },
  { id: 'phu-uv', label: 'Phủ UV toàn phần', description: 'Phủ UV toàn bề mặt giúp tăng độ bóng và độ bền màu.', icon: '/images/finish-uv.webp' },
]

/** 4 nhóm sản phẩm (card ở trang chủ, PD-01 AC4 / PD-04). */
export const CATEGORIES: readonly {
  value: PackagingType
  icon: LucideIcon
  title: string
  description: string
  tags: readonly string[]
}[] = [
  { value: 'hop-giay', icon: Box, title: 'In Bao bì Hộp giấy / Carton cao cấp', description: 'Hộp cứng, hộp âm dương, hộp carton sóng E/B cho mỹ phẩm, thực phẩm, điện tử.', tags: ['Ivory', 'Duplex', 'Carton sóng'] },
  { value: 'tui-giay', icon: Gift, title: 'In Túi giấy Thương hiệu & Gift box', description: 'Túi giấy quai dây, túi kraft, hộp quà tặng cao cấp cho chuỗi bán lẻ & sự kiện.', tags: ['Kraft', 'Couche', 'Mỹ thuật'] },
  { value: 'tem-nhan', icon: Tags, title: 'In Tem nhãn / Decal cuộn tự động', description: 'Decal giấy, decal nhựa PP/PE, tem bảo hành, nhãn dán máy tự động tốc độ cao.', tags: ['Flexo', 'Digital', 'Bế cuộn'] },
  { value: 'mang-phuc-hop', icon: Layers, title: 'Bao bì Màng phức hợp & Nhựa định hình', description: 'Túi zipper, túi đáy đứng, khay nhựa định hình PET/PVC đạt chuẩn an toàn thực phẩm.', tags: ['PET/PE', 'OPP/CPP', 'Màng nhôm'] },
]

export const typeLabel = (t: string) => PACKAGING_TYPES.find((x) => x.value === t)?.label ?? t
export const materialLabel = (m: string) => MATERIALS.find((x) => x.value === m)?.label ?? m
export const finishById = (id: string) => FINISHES.find((f) => f.id === id)

const img = (src: string, alt: string): ProductImage => ({ src, alt, width: 1408, height: 768 })
const IMG = {
  hero: '/images/hero-packaging.webp',
  offset: '/images/factory-offset.webp',
  diecut: '/images/factory-diecut.webp',
  foil: '/images/finish-foil.webp',
  lam: '/images/finish-lamination.webp',
  uv: '/images/finish-uv.webp',
  emboss: '/images/finish-emboss.webp',
}
const dl = (group: PackagingType, specKb: number, dieKb: number) =>
  [
    { type: 'spec' as const, file: `/downloads/spec-${group}.pdf`, size_kb: specKb },
    { type: 'dieline' as const, file: `/downloads/dieline-${group}.pdf`, size_kb: dieKb },
  ]

const COMMON_FAQS = {
  sample: { q: 'PML có làm mẫu trước khi sản xuất không?', a: 'Có. PML làm mẫu thử (in kỹ thuật số hoặc mẫu trắng) để khách duyệt form và màu trước khi chạy hàng loạt.' },
  file: { q: 'Tôi cần chuẩn bị file thiết kế thế nào?', a: 'File AI/PDF hệ màu CMYK, chữ đã convert outline, bleed 3mm. Bạn có thể tải dieline mẫu bên dưới để dàn trang.' },
  ship: { q: 'PML có giao hàng toàn quốc không?', a: 'Có. Giao miễn phí nội thành TP.HCM với đơn đạt MOQ, các tỉnh khác gửi qua đối tác vận chuyển (dữ liệu mẫu).' },
  pay: { q: 'Điều kiện thanh toán ra sao?', a: 'Thông thường đặt cọc 50% khi duyệt mẫu, thanh toán phần còn lại khi giao hàng (dữ liệu mẫu, sales sẽ xác nhận).' },
}

const PRODUCT_LIST: Product[] = [
  {
    slug: 'hop-cung-am-duong',
    name: 'Hộp cứng âm dương',
    packaging_type: 'hop-giay',
    short_description: 'Hộp nắp rời âm dương bồi carton cứng, sang trọng cho quà tặng, mỹ phẩm và rượu.',
    description:
      'Hộp cứng âm dương gồm nắp và đáy rời, giấy in Ivory bồi carton 2mm giúp hộp đứng form, chịu lực tốt. Phù hợp làm hộp quà Tết, hộp mỹ phẩm cao cấp, hộp rượu và trang sức.',
    images: [
      img(IMG.hero, 'Hộp cứng âm dương màu xanh navy in logo ép nhũ vàng (ảnh minh hoạ)'),
      img(IMG.foil, 'Cận cảnh logo ép nhũ vàng trên nắp hộp cứng (ảnh minh hoạ)'),
      img(IMG.lam, 'Bề mặt hộp cứng cán màng mờ và cán màng bóng (ảnh minh hoạ)'),
      img(IMG.offset, 'Máy in offset in tờ giấy bồi hộp cứng tại xưởng (ảnh minh hoạ)'),
    ],
    materials: ['ivory', 'duplex'],
    sizes: [
      { id: 's-200x150x60', label: '200 × 150 × 60 mm', w_mm: 200, h_mm: 150, d_mm: 60 },
      { id: 's-250x200x80', label: '250 × 200 × 80 mm', w_mm: 250, h_mm: 200, d_mm: 80 },
      { id: 's-300x220x100', label: '300 × 220 × 100 mm', w_mm: 300, h_mm: 220, d_mm: 100 },
    ],
    gsm: 'Ivory 350gsm bồi carton 2mm',
    print_methods: ['offset'],
    colors: 'Offset 4 màu CMYK (+ màu pha theo yêu cầu)',
    finishes: ['can-mang-mo', 'can-mang-bong', 'ep-nhu', 'uv-dinh-hinh', 'dap-noi'],
    moq: 1000,
    lead_time_days: { min: 10, max: 14 },
    certifications: ['ISO 9001:2015'],
    industries: [
      { id: 'my-pham', label: 'Mỹ phẩm', example: 'Hộp set quà serum, nước hoa cao cấp.' },
      { id: 'qua-tang', label: 'Quà tặng', example: 'Hộp quà Tết, hộp quà doanh nghiệp.' },
      { id: 'ruou', label: 'Rượu vang', example: 'Hộp rượu 1–2 chai có lót định vị.' },
    ],
    portfolio: [
      { src: IMG.hero, alt: 'Hộp quà Tết âm dương navy ép nhũ vàng', caption: 'Quà tặng · Ép nhũ + cán màng mờ' },
      { src: IMG.foil, alt: 'Hộp mỹ phẩm ép nhũ vàng', caption: 'Mỹ phẩm · Ép nhũ vàng' },
      { src: IMG.emboss, alt: 'Hộp trang sức dập nổi logo', caption: 'Trang sức · Dập nổi' },
    ],
    faqs: [
      { q: 'MOQ hộp cứng âm dương là bao nhiêu?', a: 'MOQ mẫu là 1.000 hộp cho mỗi mẫu thiết kế. Số lượng ít hơn vui lòng liên hệ để được tư vấn.' },
      { q: 'Thời gian sản xuất bao lâu?', a: 'Khoảng 10–14 ngày làm việc sau khi duyệt mẫu, tuỳ số lượng và gia công.' },
      COMMON_FAQS.sample,
      COMMON_FAQS.file,
    ],
    downloads: dl('hop-giay', 46, 45),
    related: ['hop-carton-song-e', 'tui-couche-quai-day'],
    seo: {
      description:
        'In hộp cứng âm dương bồi carton 2mm, giấy Ivory 350gsm, in offset 4 màu, ép nhũ, UV định hình. MOQ 1.000 hộp, sản xuất 10–14 ngày. Nhận báo giá mẫu nhanh.',
    },
    sort_order: 1,
  },
  {
    slug: 'hop-carton-song-e',
    name: 'Hộp carton sóng E',
    packaging_type: 'hop-giay',
    short_description: 'Hộp carton sóng E in offset trực tiếp, nhẹ mà cứng, hợp ship hàng TMĐT và F&B.',
    description:
      'Hộp carton sóng E (1,5mm) cán sóng với mặt giấy in offset, cho bề mặt in sắc nét mà vẫn chịu nén tốt. Thường dùng làm hộp ship hàng thương mại điện tử, hộp bánh, hộp đồ điện tử nhỏ.',
    images: [
      img(IMG.diecut, 'Hộp carton sóng E sau khi bế tại xưởng (ảnh minh hoạ)'),
      img(IMG.offset, 'In offset mặt giấy cho hộp carton sóng E (ảnh minh hoạ)'),
      img(IMG.hero, 'Bộ hộp carton in logo thương hiệu (ảnh minh hoạ)'),
    ],
    materials: ['duplex', 'kraft', 'ivory'],
    sizes: [
      { id: 's-150x100x50', label: '150 × 100 × 50 mm', w_mm: 150, h_mm: 100, d_mm: 50 },
      { id: 's-250x180x80', label: '250 × 180 × 80 mm', w_mm: 250, h_mm: 180, d_mm: 80 },
      { id: 's-350x250x120', label: '350 × 250 × 120 mm', w_mm: 350, h_mm: 250, d_mm: 120 },
    ],
    gsm: 'Mặt Duplex/Kraft 250–300gsm + sóng E',
    print_methods: ['offset', 'flexo'],
    colors: 'CMYK + 1 màu pha',
    finishes: ['can-mang-bong', 'can-mang-mo', 'phu-uv', 'be-cua-so'],
    moq: 1000,
    lead_time_days: { min: 7, max: 12 },
    certifications: ['ISO 9001:2015'],
    industries: [
      { id: 'tmdt', label: 'Thương mại điện tử', example: 'Hộp ship hàng in logo cho shop online.' },
      { id: 'thuc-pham', label: 'Thực phẩm', example: 'Hộp bánh trung thu, hộp bánh quy.' },
      { id: 'dien-tu', label: 'Điện tử', example: 'Hộp tai nghe, phụ kiện điện thoại.' },
    ],
    portfolio: [
      { src: IMG.diecut, alt: 'Hộp ship hàng carton sóng E in 1 màu', caption: 'TMĐT · In flexo 1 màu' },
      { src: IMG.hero, alt: 'Hộp bánh carton sóng E in 4 màu', caption: 'Thực phẩm · Cán màng bóng' },
      { src: IMG.uv, alt: 'Hộp phụ kiện điện tử phủ UV', caption: 'Điện tử · Phủ UV' },
    ],
    faqs: [
      { q: 'Sóng E khác sóng B thế nào?', a: 'Sóng E mỏng (~1,5mm), bề mặt phẳng in đẹp; sóng B dày (~3mm) chịu lực hơn cho thùng vận chuyển.' },
      { q: 'Thời gian sản xuất bao lâu?', a: 'Khoảng 7–12 ngày làm việc sau khi duyệt mẫu.' },
      COMMON_FAQS.ship,
      COMMON_FAQS.file,
    ],
    downloads: dl('hop-giay', 46, 45),
    related: ['hop-cung-am-duong', 'tui-kraft-quai-giay'],
    seo: {
      description:
        'In hộp carton sóng E in offset/flexo cho TMĐT, thực phẩm, điện tử. Mặt Duplex/Kraft, cán màng, phủ UV, bế cửa sổ. MOQ 1.000 hộp, 7–12 ngày. Báo giá mẫu nhanh.',
    },
    sort_order: 2,
  },
  {
    slug: 'tui-kraft-quai-giay',
    name: 'Túi kraft quai giấy',
    packaging_type: 'tui-giay',
    short_description: 'Túi giấy kraft quai xoắn thân thiện môi trường cho chuỗi F&B, bán lẻ, thời trang.',
    description:
      'Túi giấy kraft nâu hoặc trắng, quai giấy xoắn dán máy, in flexo 1–2 màu hoặc offset. Giải pháp thay thế túi nilon cho cửa hàng thời trang, chuỗi cà phê, bánh mì và siêu thị.',
    images: [
      img(IMG.hero, 'Túi giấy kraft quai giấy in logo (ảnh minh hoạ)'),
      img(IMG.offset, 'In túi kraft trên máy in tại xưởng (ảnh minh hoạ)'),
      img(IMG.diecut, 'Công đoạn bế và dán túi giấy (ảnh minh hoạ)'),
    ],
    materials: ['kraft'],
    sizes: [
      { id: 's-180x80x220', label: '180 × 80 × 220 mm', w_mm: 180, h_mm: 220, d_mm: 80 },
      { id: 's-260x120x320', label: '260 × 120 × 320 mm', w_mm: 260, h_mm: 320, d_mm: 120 },
      { id: 's-320x110x420', label: '320 × 110 × 420 mm', w_mm: 320, h_mm: 420, d_mm: 110 },
    ],
    gsm: 'Kraft 100–150gsm',
    print_methods: ['flexo', 'offset'],
    colors: '1–2 màu pha (flexo) hoặc CMYK (offset)',
    finishes: ['can-mang-mo', 'phu-uv'],
    moq: 1000,
    lead_time_days: { min: 7, max: 10 },
    certifications: ['ISO 9001:2015', 'Giấy có chứng nhận FSC (mẫu)'],
    industries: [
      { id: 'fnb', label: 'F&B', example: 'Túi mang đi cho chuỗi cà phê, bánh mì.' },
      { id: 'thoi-trang', label: 'Thời trang', example: 'Túi shopping cho shop quần áo.' },
    ],
    portfolio: [
      { src: IMG.hero, alt: 'Túi kraft quai giấy in logo chuỗi cà phê', caption: 'F&B · In flexo 1 màu' },
      { src: IMG.offset, alt: 'Túi kraft trắng in offset 4 màu', caption: 'Bán lẻ · In offset' },
      { src: IMG.diecut, alt: 'Túi kraft quai giấy cho shop thời trang', caption: 'Thời trang · Phủ UV' },
    ],
    faqs: [
      { q: 'MOQ túi kraft là bao nhiêu?', a: 'MOQ mẫu là 1.000 túi mỗi kích thước/thiết kế.' },
      { q: 'Túi chịu được bao nhiêu kg?', a: 'Túi kraft 120gsm quai xoắn chịu khoảng 3–5kg tuỳ kích thước (số liệu tham khảo).' },
      COMMON_FAQS.sample,
      COMMON_FAQS.pay,
    ],
    downloads: dl('tui-giay', 46, 46),
    related: ['tui-couche-quai-day', 'hop-carton-song-e'],
    seo: {
      description:
        'In túi giấy kraft quai giấy xoắn cho F&B, thời trang, bán lẻ. Kraft 100–150gsm, in flexo hoặc offset, thân thiện môi trường. MOQ 1.000 túi. Nhận báo giá mẫu.',
    },
    sort_order: 3,
  },
  {
    slug: 'tui-couche-quai-day',
    name: 'Túi couche quai dây',
    packaging_type: 'tui-giay',
    short_description: 'Túi giấy couche cán màng, quai dây dù/ruy băng, in offset sắc nét cho thương hiệu cao cấp.',
    description:
      'Túi giấy couche/Ivory 250–300gsm in offset 4 màu, cán màng mờ hoặc bóng, gia cố đáy và miệng túi, quai dây dù hoặc ruy băng. Dành cho thương hiệu mỹ phẩm, trang sức, quà tặng sự kiện.',
    images: [
      img(IMG.lam, 'Túi couche cán màng mờ quai dây (ảnh minh hoạ)'),
      img(IMG.foil, 'Logo ép nhũ vàng trên túi couche (ảnh minh hoạ)'),
      img(IMG.hero, 'Bộ túi và hộp quà đồng bộ thương hiệu (ảnh minh hoạ)'),
      img(IMG.uv, 'Túi couche phủ UV định hình (ảnh minh hoạ)'),
    ],
    materials: ['ivory'],
    sizes: [
      { id: 's-200x80x250', label: '200 × 80 × 250 mm', w_mm: 200, h_mm: 250, d_mm: 80 },
      { id: 's-300x100x350', label: '300 × 100 × 350 mm', w_mm: 300, h_mm: 350, d_mm: 100 },
    ],
    gsm: 'Couche / Ivory 250–300gsm',
    print_methods: ['offset'],
    colors: 'CMYK + 1–2 màu pha',
    finishes: ['can-mang-mo', 'can-mang-bong', 'ep-nhu', 'uv-dinh-hinh', 'dap-noi'],
    moq: 1000,
    lead_time_days: { min: 10, max: 14 },
    certifications: ['ISO 9001:2015'],
    industries: [
      { id: 'my-pham', label: 'Mỹ phẩm', example: 'Túi đựng sản phẩm tại quầy mỹ phẩm.' },
      { id: 'su-kien', label: 'Sự kiện', example: 'Túi quà tặng hội nghị, ra mắt sản phẩm.' },
      { id: 'trang-suc', label: 'Trang sức', example: 'Túi nhỏ quai ruy băng cho cửa hàng trang sức.' },
    ],
    portfolio: [
      { src: IMG.lam, alt: 'Túi couche cán mờ cho thương hiệu mỹ phẩm', caption: 'Mỹ phẩm · Cán màng mờ' },
      { src: IMG.foil, alt: 'Túi quà sự kiện ép nhũ vàng', caption: 'Sự kiện · Ép nhũ' },
      { src: IMG.uv, alt: 'Túi trang sức phủ UV định hình', caption: 'Trang sức · UV định hình' },
    ],
    faqs: [
      { q: 'Có thể chọn loại quai nào?', a: 'Quai dây dù, dây cotton hoặc ruy băng satin; màu quai theo bảng màu có sẵn (dữ liệu mẫu).' },
      { q: 'Thời gian sản xuất bao lâu?', a: 'Khoảng 10–14 ngày làm việc sau khi duyệt mẫu, do có công đoạn dán và xỏ quai.' },
      COMMON_FAQS.file,
      COMMON_FAQS.ship,
    ],
    downloads: dl('tui-giay', 46, 46),
    related: ['tui-kraft-quai-giay', 'hop-cung-am-duong'],
    seo: {
      description:
        'In túi giấy couche quai dây cao cấp, Ivory 250–300gsm, in offset 4 màu, cán màng, ép nhũ, UV định hình. Cho mỹ phẩm, sự kiện, trang sức. MOQ 1.000 túi.',
    },
    sort_order: 4,
  },
  {
    slug: 'decal-cuon-giay',
    name: 'Decal cuộn giấy',
    packaging_type: 'tem-nhan',
    short_description: 'Tem nhãn decal giấy dạng cuộn, bế sẵn, dán tay hoặc dán máy tự động tốc độ cao.',
    description:
      'Decal giấy couche/kraft dạng cuộn in flexo hoặc digital, bế demi theo khuôn, lõi 76mm tương thích máy dán nhãn tự động. Dùng làm nhãn chai, nhãn hũ, tem niêm phong và tem giá.',
    images: [
      img(IMG.diecut, 'Cuộn decal giấy sau khi bế demi (ảnh minh hoạ)'),
      img(IMG.offset, 'In tem nhãn cuộn tại xưởng (ảnh minh hoạ)'),
      img(IMG.uv, 'Tem nhãn phủ UV định hình (ảnh minh hoạ)'),
    ],
    materials: ['ivory', 'kraft'],
    sizes: [
      { id: 's-30x50', label: '30 × 50 mm', w_mm: 30, h_mm: 50 },
      { id: 's-50x80', label: '50 × 80 mm', w_mm: 50, h_mm: 80 },
      { id: 's-80x120', label: '80 × 120 mm', w_mm: 80, h_mm: 120 },
    ],
    gsm: 'Decal giấy couche/kraft 80gsm + đế glassine',
    print_methods: ['flexo', 'digital'],
    colors: 'CMYK + màu pha',
    finishes: ['can-mang-bong', 'can-mang-mo', 'ep-nhu', 'phu-uv'],
    moq: 5000,
    lead_time_days: { min: 5, max: 7 },
    industries: [
      { id: 'thuc-pham', label: 'Thực phẩm', example: 'Nhãn hũ mứt, chai nước sốt.' },
      { id: 'my-pham', label: 'Mỹ phẩm', example: 'Nhãn chai dầu gội, lọ kem.' },
    ],
    portfolio: [
      { src: IMG.diecut, alt: 'Nhãn hũ thực phẩm decal giấy kraft', caption: 'Thực phẩm · Decal kraft' },
      { src: IMG.uv, alt: 'Nhãn chai mỹ phẩm phủ UV', caption: 'Mỹ phẩm · Phủ UV' },
      { src: IMG.foil, alt: 'Tem niêm phong ép nhũ', caption: 'Quà tặng · Ép nhũ' },
    ],
    faqs: [
      { q: 'MOQ decal cuộn là bao nhiêu?', a: 'MOQ mẫu là 5.000 tem cho mỗi mẫu thiết kế.' },
      { q: 'Lõi cuộn và chiều cuộn thế nào?', a: 'Lõi tiêu chuẩn 76mm, chiều ra nhãn theo máy dán của bạn; vui lòng gửi thông số máy khi đặt hàng.' },
      { q: 'Thời gian sản xuất bao lâu?', a: 'Khoảng 5–7 ngày làm việc sau khi duyệt mẫu.' },
    ],
    downloads: dl('tem-nhan', 46, 45),
    related: ['decal-nhua-pp', 'tui-zipper-day-dung'],
    seo: {
      description:
        'In decal cuộn giấy couche/kraft, in flexo hoặc digital, bế demi, lõi 76mm cho máy dán nhãn tự động. Nhãn chai, hũ, tem niêm phong. MOQ 5.000 tem, 5–7 ngày.',
    },
    sort_order: 5,
  },
  {
    slug: 'decal-nhua-pp',
    name: 'Decal nhựa PP',
    packaging_type: 'tem-nhan',
    short_description: 'Tem nhãn decal nhựa PP chống nước, chống dầu cho chai lọ hoá mỹ phẩm và đồ uống lạnh.',
    description:
      'Decal nhựa PP trắng sữa, trong hoặc xi bạc, chịu nước, dầu và nhiệt độ lạnh. In flexo/digital, có thể cán màng hoặc phủ UV để tăng độ bền. Phù hợp nhãn chai nước, nhãn hoá mỹ phẩm, nhãn đông lạnh.',
    images: [
      img(IMG.uv, 'Tem nhãn decal nhựa PP phủ UV (ảnh minh hoạ)'),
      img(IMG.diecut, 'Cuộn decal nhựa PP bế sẵn (ảnh minh hoạ)'),
      img(IMG.lam, 'Decal PP cán màng bóng (ảnh minh hoạ)'),
    ],
    materials: ['pet-pe'],
    sizes: [
      { id: 's-40x60', label: '40 × 60 mm', w_mm: 40, h_mm: 60 },
      { id: 's-60x100', label: '60 × 100 mm', w_mm: 60, h_mm: 100 },
      { id: 's-100x150', label: '100 × 150 mm', w_mm: 100, h_mm: 150 },
    ],
    gsm: 'PP 60–80 micron (trắng sữa / trong / xi bạc)',
    print_methods: ['flexo', 'digital'],
    colors: 'CMYK + trắng lót + màu pha',
    finishes: ['can-mang-bong', 'can-mang-mo', 'phu-uv', 'ep-nhu'],
    moq: 5000,
    lead_time_days: { min: 5, max: 8 },
    industries: [
      { id: 'do-uong', label: 'Đồ uống', example: 'Nhãn chai nước, chai trà sữa.' },
      { id: 'hoa-my-pham', label: 'Hoá mỹ phẩm', example: 'Nhãn chai dầu gội, nước giặt.' },
      { id: 'dong-lanh', label: 'Đông lạnh', example: 'Nhãn khay thịt cá đông lạnh.' },
    ],
    faqs: [
      { q: 'Decal PP có chịu nước không?', a: 'Có. Decal PP chịu nước và dầu, phù hợp chai lọ để trong tủ lạnh hoặc tiếp xúc ẩm.' },
      { q: 'MOQ decal PP là bao nhiêu?', a: 'MOQ mẫu là 5.000 tem cho mỗi mẫu thiết kế.' },
      COMMON_FAQS.file,
    ],
    downloads: dl('tem-nhan', 46, 45),
    related: ['decal-cuon-giay', 'tui-mang-nhom-3-bien'],
    seo: {
      description:
        'In decal nhựa PP chống nước, chống dầu cho nhãn chai đồ uống, hoá mỹ phẩm, hàng đông lạnh. PP 60–80 micron, in flexo/digital, phủ UV. MOQ 5.000 tem.',
    },
    sort_order: 6,
  },
  {
    slug: 'tui-zipper-day-dung',
    name: 'Túi zipper đáy đứng',
    packaging_type: 'mang-phuc-hop',
    short_description: 'Túi màng phức hợp đáy đứng có khoá zipper, in ống đồng, đạt chuẩn an toàn thực phẩm.',
    description:
      'Túi đáy đứng (doypack) màng phức hợp PET/PE hoặc OPP/CPP, có khoá zipper mở đóng nhiều lần, tuỳ chọn van một chiều và cửa sổ trong. Phù hợp hạt, cà phê, snack, bột và thực phẩm khô.',
    images: [
      img(IMG.hero, 'Túi zipper đáy đứng in thương hiệu (ảnh minh hoạ)'),
      img(IMG.lam, 'Bề mặt túi màng phức hợp mờ (ảnh minh hoạ)'),
      img(IMG.offset, 'Dây chuyền in màng tại xưởng (ảnh minh hoạ)'),
    ],
    materials: ['pet-pe', 'kraft'],
    sizes: [
      { id: 's-120x200x70', label: '120 × 200 × 70 mm', w_mm: 120, h_mm: 200, d_mm: 70 },
      { id: 's-160x240x90', label: '160 × 240 × 90 mm', w_mm: 160, h_mm: 240, d_mm: 90 },
      { id: 's-200x300x110', label: '200 × 300 × 110 mm', w_mm: 200, h_mm: 300, d_mm: 110 },
    ],
    gsm: '80–120 micron (PET/PE, Kraft/PE)',
    print_methods: ['gravure', 'digital'],
    colors: 'Ống đồng đến 9 màu',
    finishes: ['can-mang-mo', 'be-cua-so'],
    moq: 5000,
    lead_time_days: { min: 12, max: 18 },
    certifications: ['Màng đạt tiêu chuẩn an toàn thực phẩm (mẫu)'],
    industries: [
      { id: 'thuc-pham', label: 'Thực phẩm khô', example: 'Túi hạt điều, granola, snack.' },
      { id: 'ca-phe', label: 'Cà phê', example: 'Túi cà phê hạt có van một chiều.' },
    ],
    portfolio: [
      { src: IMG.hero, alt: 'Túi zipper đựng hạt dinh dưỡng', caption: 'Thực phẩm · Màng mờ + cửa sổ' },
      { src: IMG.lam, alt: 'Túi cà phê kraft đáy đứng có van', caption: 'Cà phê · Kraft/PE' },
      { src: IMG.offset, alt: 'Túi snack in ống đồng 8 màu', caption: 'Snack · In ống đồng' },
    ],
    faqs: [
      { q: 'Vì sao MOQ màng phức hợp cao hơn?', a: 'In ống đồng cần làm trục in riêng cho mỗi màu, nên MOQ mẫu là 5.000 túi để tối ưu chi phí.' },
      { q: 'Có thêm van một chiều được không?', a: 'Được, van một chiều thường dùng cho cà phê rang; sales sẽ báo giá phụ phí cụ thể.' },
      { q: 'Thời gian sản xuất bao lâu?', a: 'Khoảng 12–18 ngày làm việc sau khi duyệt mẫu (gồm thời gian làm trục).' },
      COMMON_FAQS.ship,
    ],
    downloads: dl('mang-phuc-hop', 46, 45),
    related: ['tui-mang-nhom-3-bien', 'tui-kraft-quai-giay'],
    seo: {
      description:
        'In túi zipper đáy đứng màng phức hợp PET/PE, Kraft/PE, in ống đồng, có van và cửa sổ. Cho hạt, cà phê, snack. Màng an toàn thực phẩm. MOQ 5.000 túi.',
    },
    sort_order: 7,
  },
  {
    slug: 'tui-mang-nhom-3-bien',
    name: 'Túi màng nhôm 3 biên',
    packaging_type: 'mang-phuc-hop',
    short_description: 'Túi ghép màng nhôm hàn 3 biên, cản sáng và cản ẩm tốt cho bột, gia vị, dược phẩm.',
    description:
      'Túi 3 biên ghép PET/AL/PE với lớp màng nhôm cản sáng, cản ẩm và oxy, giúp kéo dài hạn sử dụng. Có thể thêm khía xé và lỗ treo. Dùng cho gói bột, gia vị, mặt nạ, thực phẩm chức năng.',
    images: [
      img(IMG.foil, 'Túi màng nhôm 3 biên ánh kim (ảnh minh hoạ)'),
      img(IMG.uv, 'Túi màng nhôm in thương hiệu (ảnh minh hoạ)'),
      img(IMG.offset, 'Máy in màng phức hợp (ảnh minh hoạ)'),
    ],
    materials: ['pet-pe'],
    sizes: [
      { id: 's-70x100', label: '70 × 100 mm', w_mm: 70, h_mm: 100 },
      { id: 's-100x150', label: '100 × 150 mm', w_mm: 100, h_mm: 150 },
      { id: 's-150x220', label: '150 × 220 mm', w_mm: 150, h_mm: 220 },
    ],
    gsm: 'PET12/AL7/PE 80–100 micron',
    print_methods: ['gravure'],
    colors: 'Ống đồng đến 9 màu',
    finishes: ['can-mang-mo', 'phu-uv'],
    moq: 20000,
    lead_time_days: { min: 14, max: 20 },
    certifications: ['Màng đạt tiêu chuẩn an toàn thực phẩm (mẫu)'],
    industries: [
      { id: 'gia-vi', label: 'Gia vị', example: 'Gói bột nêm, hạt tiêu, bột ớt.' },
      { id: 'duoc-pham', label: 'Dược phẩm / TPCN', example: 'Gói bột thực phẩm chức năng.' },
      { id: 'my-pham', label: 'Mỹ phẩm', example: 'Túi mặt nạ giấy.' },
    ],
    faqs: [
      { q: 'Túi màng nhôm có in được bề mặt mờ không?', a: 'Có, có thể dùng lớp PET mờ hoặc phủ UV cục bộ để tạo hiệu ứng bóng/mờ.' },
      { q: 'MOQ túi màng nhôm là bao nhiêu?', a: 'MOQ mẫu là 20.000 túi do chi phí làm trục in ống đồng.' },
      COMMON_FAQS.pay,
    ],
    downloads: dl('mang-phuc-hop', 46, 45),
    related: ['tui-zipper-day-dung', 'decal-nhua-pp'],
    seo: {
      description:
        'In túi màng nhôm 3 biên PET/AL/PE cản sáng, cản ẩm cho gia vị, bột, dược phẩm, mặt nạ. In ống đồng đến 9 màu, khía xé, lỗ treo. MOQ 20.000 túi.',
    },
    sort_order: 8,
  },
]

export const PRODUCTS: readonly Product[] = [...PRODUCT_LIST].sort((a, b) => a.sort_order - b.sort_order)

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

/** Bậc số lượng nhỏ nhất ≥ MOQ (PD-08 AC2). */
export function defaultQuantity(p: Pick<Product, 'moq'>): string {
  return (QUANTITY_TIERS.find((q) => Number(q.value) >= p.moq) ?? QUANTITY_TIERS[QUANTITY_TIERS.length - 1]).value
}

/** "Giá mẫu từ Y đ/sp" ở card (PD-02 AC1): bậc 100.000 + chất liệu rẻ nhất. */
export function fromPrice(p: Product): PriceEstimate | null {
  const ests = p.materials.map((m) => estimateUnitPrice(p.packaging_type, '100000', m)).filter((e): e is PriceEstimate => !!e)
  return ests.sort((a, b) => a.min - b.min)[0] ?? null
}

/** PD-16: related[] → cùng packaging_type → còn lại; không gồm chính nó; tối đa n. */
export function getRelated(p: Product, n = 3): Product[] {
  const out: Product[] = []
  const push = (x?: Product) => {
    if (x && x.slug !== p.slug && !out.includes(x) && out.length < n) out.push(x)
  }
  p.related?.forEach((s) => push(getProduct(s)))
  PRODUCTS.filter((x) => x.packaging_type === p.packaging_type).forEach(push)
  PRODUCTS.forEach(push)
  return out
}

/** PD-01 AC1/AC2: kiểm tra dữ liệu; trả về danh sách lỗi (rỗng = hợp lệ). Gọi ở build (sitemap) và trong test. */
export function validateProducts(list: readonly Product[] = PRODUCTS): string[] {
  const errs: string[] = []
  const slugs = new Set<string>()
  for (const p of list) {
    const at = `[${p.slug}]`
    if (!/^[a-z0-9-]+$/.test(p.slug)) errs.push(`${at} slug không hợp lệ`)
    if (slugs.has(p.slug)) errs.push(`${at} trùng slug`)
    slugs.add(p.slug)
    if (!p.name || !p.description || !p.gsm) errs.push(`${at} thiếu name/description/gsm`)
    if (!PACKAGING_TYPES.some((t) => t.value === p.packaging_type)) errs.push(`${at} packaging_type không hợp lệ`)
    if (!p.short_description || p.short_description.length > 120) errs.push(`${at} short_description phải 1–120 ký tự`)
    if (p.images.length < 3 || p.images.length > 5) errs.push(`${at} cần 3–5 ảnh`)
    if (p.images.some((i) => !i.alt)) errs.push(`${at} ảnh thiếu alt`)
    if (p.materials.length < 1 || p.materials.some((m) => !MATERIALS.some((x) => x.value === m))) errs.push(`${at} materials không hợp lệ`)
    if (p.sizes.length < 1 || new Set(p.sizes.map((s) => s.id)).size !== p.sizes.length || p.sizes.some((s) => s.id === 'custom'))
      errs.push(`${at} sizes không hợp lệ`)
    if (p.print_methods.length < 1) errs.push(`${at} thiếu print_methods`)
    if (p.finishes.some((f) => !finishById(f))) errs.push(`${at} finish không có trong FINISHES`)
    if (!(p.moq > 0) || p.moq > Number(QUANTITY_TIERS[QUANTITY_TIERS.length - 1].value)) errs.push(`${at} moq không hợp lệ`)
    if (!(p.lead_time_days.min > 0 && p.lead_time_days.max >= p.lead_time_days.min)) errs.push(`${at} lead_time_days không hợp lệ`)
    if (p.industries.length < 2) errs.push(`${at} cần ≥2 ứng dụng`)
    if (p.faqs.length < 3) errs.push(`${at} cần ≥3 FAQ`)
    const sd = p.seo?.description ?? ''
    if (sd.length < 140 || sd.length > 160) errs.push(`${at} seo.description phải 140–160 ký tự`)
    if ((p.seo?.title ?? `${p.name} | PML PrintTech`).length > 60) errs.push(`${at} title > 60 ký tự`)
    if (p.related?.some((s) => s === p.slug || !list.some((x) => x.slug === s))) errs.push(`${at} related không hợp lệ`)
  }
  return errs
}
