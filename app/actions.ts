'use server'

import { randomInt } from 'node:crypto'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { MATERIALS, PACKAGING_TYPES, QUANTITY_TIERS, estimateUnitPrice } from '@/lib/quote'
import { normalizeVnPhone } from '@/lib/phone'

export type QuoteFieldErrors = Partial<Record<'packagingType' | 'quantity' | 'material' | 'phone', string>>

export type QuoteResult =
  | { ok: true; ref: string }
  | { ok: false; error: 'VALIDATION' | 'SERVER_ERROR'; fieldErrors?: QuoteFieldErrors }

/** Trạng thái form: `null` = chưa gửi. */
export type QuoteState = QuoteResult | null

/** A-Z bỏ I, O + 2-9 = 32 ký tự (OPEN-5). */
const REF_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const MAX_REF_ATTEMPTS = 3

function newRef() {
  let s = ''
  for (let i = 0; i < 6; i++) s += REF_ALPHABET[randomInt(REF_ALPHABET.length)]
  return `PML-${s}`
}

export async function submitQuoteRequest(_prev: QuoteState, formData: FormData): Promise<QuoteResult> {
  const type = formData.get('type')
  const quantity = formData.get('quantity')
  const material = formData.get('material')
  const fieldErrors: QuoteFieldErrors = {}

  if (!PACKAGING_TYPES.some((t) => t.value === type)) fieldErrors.packagingType = 'Vui lòng chọn loại bao bì'
  if (!QUANTITY_TIERS.some((q) => q.value === quantity)) fieldErrors.quantity = 'Số lượng không hợp lệ'
  if (!MATERIALS.some((m) => m.value === material)) fieldErrors.material = 'Vui lòng chọn chất liệu'
  const phone = normalizeVnPhone(formData.get('phone'))
  if (!phone) fieldErrors.phone = 'Số điện thoại không hợp lệ'

  const est = estimateUnitPrice(type, quantity, material)
  if (Object.keys(fieldErrors).length > 0 || !phone || !est) return { ok: false, error: 'VALIDATION', fieldErrors }

  // Honeypot (GAP-04): trả ok giả, không lưu.
  const honeypot = formData.get('website')
  if (typeof honeypot === 'string' && honeypot.trim() !== '') return { ok: true, ref: newRef() }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    console.error('[quote] NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing: lead cannot be saved.')
    return { ok: false, error: 'SERVER_ERROR' }
  }

  try {
    for (let attempt = 0; attempt < MAX_REF_ATTEMPTS; attempt++) {
      const ref = newRef()
      const { error } = await supabase.from('quote_requests').insert({
        ref,
        packaging_type: type,
        quantity: Number(quantity),
        material,
        phone,
        price_min: est.min,
        price_max: est.max,
      })
      if (!error) return { ok: true, ref }
      if (error.code !== '23505') throw error // 23505 unique_violation trên ref → sinh mã khác
    }
    throw new Error(`ref collision after ${MAX_REF_ATTEMPTS} attempts`)
  } catch (err) {
    // Không log SĐT; chỉ log mã/thông điệp lỗi.
    const e = err as { code?: string; message?: string }
    console.error('[quote] save failed:', e?.code ?? '', e?.message ?? String(err))
    return { ok: false, error: 'SERVER_ERROR' }
  }
}
