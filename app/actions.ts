'use server'

import { randomInt } from 'node:crypto'
import { MATERIALS, PACKAGING_TYPES, QUANTITY_TIERS, estimateUnitPrice } from '@/lib/quote'
import { normalizeVnPhone } from '@/lib/phone'
import { getProduct } from '@/content/products'

export type QuoteFieldErrors = Partial<
  Record<'packagingType' | 'quantity' | 'material' | 'phone' | 'productSlug' | 'options' | 'note', string>
>

/** Tuỳ chọn sản phẩm (spec US-product-detail §6). */
export type QuoteOptions = { size: string; customSize: string | null; finishes: string[] }

const NOTE_MAX = 500
const CUSTOM_SIZE_MAX = 60

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
  // PD-G03: tên trường camelCase.
  const type = formData.get('packagingType')
  const quantity = formData.get('quantity')
  const material = formData.get('material')
  const fieldErrors: QuoteFieldErrors = {}

  if (!PACKAGING_TYPES.some((t) => t.value === type)) fieldErrors.packagingType = 'Vui lòng chọn loại bao bì'
  if (!QUANTITY_TIERS.some((q) => q.value === quantity)) fieldErrors.quantity = 'Số lượng không hợp lệ'
  if (!MATERIALS.some((m) => m.value === material)) fieldErrors.material = 'Vui lòng chọn chất liệu'
  const phone = normalizeVnPhone(formData.get('phone'))
  if (!phone) fieldErrors.phone = 'Số điện thoại không hợp lệ'

  // PD-10: trường mới tuỳ chọn. Form trang chủ không gửi productSlug → hành vi như cũ.
  const rawSlug = formData.get('productSlug')
  const hasProduct = typeof rawSlug === 'string' && rawSlug.trim() !== ''
  let productExtras: { product_slug: string; options: QuoteOptions | null; note: string | null; source: 'product' } | null = null
  if (hasProduct) {
    const product = getProduct(rawSlug.trim())
    const rawNote = formData.get('note')
    const note = typeof rawNote === 'string' ? rawNote.trim() : ''
    if (note.length > NOTE_MAX) fieldErrors.note = `Ghi chú tối đa ${NOTE_MAX} ký tự`
    if (!product) {
      fieldErrors.productSlug = 'Sản phẩm không tồn tại'
    } else {
      if (type !== product.packaging_type) fieldErrors.productSlug = 'Loại bao bì không khớp với sản phẩm'
      // PD-G05
      if (typeof material === 'string' && MATERIALS.some((m) => m.value === material) && !(product.materials as readonly string[]).includes(material))
        fieldErrors.material = 'Chất liệu không áp dụng cho sản phẩm này'
      // PD-G07: dưới MOQ của sản phẩm.
      if (typeof quantity === 'string' && QUANTITY_TIERS.some((q) => q.value === quantity) && Number(quantity) < product.moq)
        fieldErrors.quantity = `Số lượng tối thiểu là ${new Intl.NumberFormat('vi-VN').format(product.moq)}`
      // PD-G04/G06: options là chuỗi JSON, không bắt buộc; có gửi thì phải hợp lệ.
      const rawOptions = formData.get('options')
      const hasOptions = typeof rawOptions === 'string' && rawOptions.trim() !== ''
      const options = hasOptions ? parseOptions(rawOptions, product) : null
      if (hasOptions && !options) fieldErrors.options = 'Tuỳ chọn không hợp lệ'
      else productExtras = { product_slug: product.slug, options, note: note || null, source: 'product' }
    }
  }

  const est = estimateUnitPrice(type, quantity, material)
  if (Object.keys(fieldErrors).length > 0 || !phone || !est) return { ok: false, error: 'VALIDATION', fieldErrors }

  // Honeypot (GAP-04): trả ok giả, không lưu.
  const honeypot = formData.get('website')
  if (typeof honeypot === 'string' && honeypot.trim() !== '') return { ok: true, ref: newRef() }

  // MVP (quyết định của Nhat 21/10/2026): KHÔNG dùng Supabase, không lưu lead; chỉ trả mã tham chiếu mẫu.
  // TODO(backend): lưu lead tại đây. Payload đã chuẩn hoá sẵn:
  //   { ref, packaging_type: type, quantity: Number(quantity), material, phone, price_min: est.min, price_max: est.max,
  //     ...productExtras /* product_slug, options, note, source='product' */ }
  // Khi nối backend: insert, retry ref khi trùng (23505, tối đa MAX_REF_ATTEMPTS), lỗi → { ok: false, error: 'SERVER_ERROR' }.
  void productExtras
  void MAX_REF_ATTEMPTS
  return { ok: true, ref: newRef() }
}

/** options: JSON {size, customSize, finishes[]}; size ∈ sizes[].id | "custom"; finishes ⊂ product.finishes. */
function parseOptions(raw: FormDataEntryValue | null, product: { sizes: readonly { id: string }[]; finishes: readonly string[] }): QuoteOptions | null {
  if (typeof raw !== 'string' || raw.length > 2000) return null
  let o: unknown
  try {
    o = JSON.parse(raw)
  } catch {
    return null
  }
  if (!o || typeof o !== 'object' || Array.isArray(o)) return null
  const { size, customSize: custom_size, finishes } = o as Record<string, unknown>
  if (typeof size !== 'string') return null
  let custom: string | null = null
  if (size === 'custom') {
    if (typeof custom_size !== 'string') return null
    custom = custom_size.trim()
    if (!custom || custom.length > CUSTOM_SIZE_MAX) return null
  } else if (!product.sizes.some((s) => s.id === size)) return null
  const fin = finishes ?? []
  if (!Array.isArray(fin) || fin.some((f) => typeof f !== 'string' || !product.finishes.includes(f))) return null
  return { size, customSize: custom, finishes: [...new Set(fin as string[])] }
}
