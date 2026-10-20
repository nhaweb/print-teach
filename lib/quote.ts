export const PACKAGING_TYPES = [
  { value: 'hop-giay', label: 'Hộp giấy / Carton', base: 3200 },
  { value: 'tui-giay', label: 'Túi giấy thương hiệu', base: 4500 },
  { value: 'tem-nhan', label: 'Tem nhãn / Decal cuộn', base: 180 },
  { value: 'mang-phuc-hop', label: 'Túi màng phức hợp', base: 1400 },
] as const

export const QUANTITY_TIERS = [
  { value: '1000', label: '1.000 – 4.999 sp', factor: 1 },
  { value: '5000', label: '5.000 – 19.999 sp', factor: 0.78 },
  { value: '20000', label: '20.000 – 99.999 sp', factor: 0.62 },
  { value: '100000', label: '100.000+ sp', factor: 0.5 },
] as const

export const MATERIALS = [
  { value: 'ivory', label: 'Giấy Ivory 300–400gsm', factor: 1 },
  { value: 'kraft', label: 'Giấy Kraft', factor: 0.92 },
  { value: 'duplex', label: 'Duplex / Carton sóng', factor: 1.1 },
  { value: 'pet-pe', label: 'Màng PET/PE, OPP/CPP', factor: 1.05 },
] as const

/** Hệ số dạng số nguyên (×100) để tránh sai số dấu phẩy động. */
const pct = (f: number) => Math.round(f * 100)

export type PriceEstimate = { min: number; max: number }

/** Công thức chuẩn (GAP-09): mid = base × factor(số lượng) × factor(chất liệu); min = mid×0,9; max = mid×1,15. */
export function estimateUnitPrice(type: unknown, quantity: unknown, material: unknown): PriceEstimate | null {
  const t = PACKAGING_TYPES.find((x) => x.value === type)
  const q = QUANTITY_TIERS.find((x) => x.value === quantity)
  const m = MATERIALS.find((x) => x.value === material)
  if (!t || !q || !m) return null
  // mid×k tính bằng số nguyên với đơn vị 1e-6 VND; làm tròn half-up đến 10 VND (= 1e7 đơn vị).
  const scaled = t.base * pct(q.factor) * pct(m.factor)
  const round10 = (k: number) => Math.floor((scaled * k + 5_000_000) / 10_000_000) * 10
  return {
    min: round10(90),
    max: round10(115),
  }
}

export const formatVnd = (n: number) => new Intl.NumberFormat('vi-VN').format(n)

export type PackagingType = (typeof PACKAGING_TYPES)[number]['value']
export type QuantityTier = (typeof QUANTITY_TIERS)[number]['value']
export type Material = (typeof MATERIALS)[number]['value']

/** Hotline mẫu (dữ liệu mẫu theo quyết định chốt). */
export const SAMPLE_HOTLINE = '0901 234 567'
