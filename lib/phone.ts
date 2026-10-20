export const VN_PHONE_PATTERN = /^0(?:3|5|7|8|9)\d{8}$/

/**
 * Chuẩn hóa SĐT di động VN về dạng `0xxxxxxxxx`.
 * Chấp nhận dấu cách, chấm, gạch và tiền tố `+84`. Trả `null` nếu không hợp lệ.
 */
export function normalizeVnPhone(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  let p = raw.trim().replace(/[\s.-]/g, '')
  if (p.startsWith('+84')) p = '0' + p.slice(3)
  return VN_PHONE_PATTERN.test(p) ? p : null
}

/** Alias cho QA automation (PHONE_FN mặc định). */
export const normalizePhone = normalizeVnPhone
