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

export function estimateUnitPrice(type: string, quantity: string, material: string) {
  const t = PACKAGING_TYPES.find((x) => x.value === type)
  const q = QUANTITY_TIERS.find((x) => x.value === quantity)
  const m = MATERIALS.find((x) => x.value === material)
  if (!t || !q || !m) return null
  const mid = t.base * q.factor * m.factor
  return {
    min: Math.round((mid * 0.9) / 10) * 10,
    max: Math.round((mid * 1.15) / 10) * 10,
  }
}

export const formatVnd = (n: number) => new Intl.NumberFormat('vi-VN').format(n)

export type PackagingType = (typeof PACKAGING_TYPES)[number]['value']
export type QuantityTier = (typeof QUANTITY_TIERS)[number]['value']
export type Material = (typeof MATERIALS)[number]['value']

/** Hotline mẫu (dữ liệu mẫu theo quyết định chốt). */
export const SAMPLE_HOTLINE = '0901 234 567'

export const PHONE_PATTERN = /^0(?:3|5|7|8|9)\d{8}$/

/** Chuẩn hóa SĐT VN về dạng 0xxxxxxxxx; trả null nếu không hợp lệ. */
export function normalizePhone(raw: string): string | null {
  let p = raw.replace(/[\s.\-()]/g, '')
  if (p.startsWith('+84')) p = '0' + p.slice(3)
  else if (p.startsWith('84') && p.length === 11) p = '0' + p.slice(2)
  return PHONE_PATTERN.test(p) ? p : null
}
