export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://print-teach.vercel.app').replace(/\/+$/, '')

/** Liên hệ mẫu (PD-11 AC3, Q3): đổi ở một chỗ duy nhất. */
export const HOTLINE_DISPLAY = '0901 234 567'
export const HOTLINE_TEL = `tel:${HOTLINE_DISPLAY.replace(/\s+/g, '')}`
export const ZALO_URL = `https://zalo.me/${HOTLINE_DISPLAY.replace(/\s+/g, '')}`
