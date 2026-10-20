'use server'

import { createHash, randomInt } from 'node:crypto'
import { headers } from 'next/headers'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import {
  MATERIALS,
  PACKAGING_TYPES,
  QUANTITY_TIERS,
  SAMPLE_HOTLINE,
  estimateUnitPrice,
  normalizePhone,
} from '@/lib/quote'

export type QuoteErrorCode = 'INVALID_PRODUCT' | 'INVALID_PHONE' | 'INVALID_INPUT' | 'SERVER_ERROR'

export type QuoteState =
  | { status: 'idle' }
  | { status: 'error'; code: QuoteErrorCode; message: string; field?: 'phone' | 'form' }
  | {
      status: 'success'
      reference: string
      estimate: { min: number; max: number; currency: 'VND'; unit: 'sp' } | null
      demo?: boolean
    }

const REF_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const DEDUPE_WINDOW_MS = 5 * 60 * 1000

function newReference() {
  let s = ''
  for (let i = 0; i < 6; i++) s += REF_ALPHABET[randomInt(REF_ALPHABET.length)]
  return `PML-${s}`
}

function str(fd: FormData, key: string, max: number): string | null | undefined {
  const v = fd.get(key)
  if (v === null) return null
  if (typeof v !== 'string') return undefined
  const t = v.trim()
  if (t.length > max) return undefined
  return t === '' ? null : t
}

const serverError = (): QuoteState => ({
  status: 'error',
  code: 'SERVER_ERROR',
  field: 'form',
  message: `Hệ thống đang bận, vui lòng gọi hotline ${SAMPLE_HOTLINE}.`,
})

export async function submitQuoteRequest(_prev: QuoteState, formData: FormData): Promise<QuoteState> {
  const type = String(formData.get('type') ?? '')
  const quantity = String(formData.get('quantity') ?? '')
  const material = String(formData.get('material') ?? '')

  const validProduct =
    PACKAGING_TYPES.some((t) => t.value === type) &&
    QUANTITY_TIERS.some((q) => q.value === quantity) &&
    MATERIALS.some((m) => m.value === material)
  if (!validProduct) {
    return { status: 'error', code: 'INVALID_PRODUCT', field: 'form', message: 'Vui lòng chọn đầy đủ thông tin sản phẩm.' }
  }

  const phone = normalizePhone(String(formData.get('phone') ?? ''))
  if (!phone) {
    return {
      status: 'error',
      code: 'INVALID_PHONE',
      field: 'phone',
      message: 'Số điện thoại/Zalo chưa hợp lệ (VD: 0901 234 567).',
    }
  }

  const name = str(formData, 'name', 100)
  const company = str(formData, 'company', 150)
  const note = str(formData, 'note', 1000)
  const utmSource = str(formData, 'utm_source', 200)
  const utmMedium = str(formData, 'utm_medium', 200)
  const utmCampaign = str(formData, 'utm_campaign', 200)
  if ([name, company, note, utmSource, utmMedium, utmCampaign].some((v) => v === undefined)) {
    return { status: 'error', code: 'INVALID_INPUT', field: 'form', message: 'Thông tin nhập quá dài hoặc không hợp lệ.' }
  }

  const est = estimateUnitPrice(type, quantity, material)
  const estimate = est ? { ...est, currency: 'VND' as const, unit: 'sp' as const } : null

  // Honeypot: trả success giả, không lưu.
  const honeypot = formData.get('website')
  if (typeof honeypot === 'string' && honeypot.trim() !== '') {
    return { status: 'success', reference: newReference(), estimate }
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    console.warn('[quote] Supabase env missing — demo mode, lead NOT saved.')
    return { status: 'success', reference: newReference(), estimate, demo: true }
  }

  try {
    const h = await headers()
    const ip = (h.get('x-forwarded-for') ?? '').split(',')[0].trim() || h.get('x-real-ip') || ''
    const ipHash = ip ? createHash('sha256').update(ip).digest('hex') : null

    // Dedupe: cùng SĐT + cùng sản phẩm trong 5 phút → trả mã cũ.
    const since = new Date(Date.now() - DEDUPE_WINDOW_MS).toISOString()
    const { data: existing, error: dupErr } = await supabase
      .from('quote_requests')
      .select('reference')
      .eq('phone', phone)
      .eq('packaging_type', type)
      .eq('quantity_tier', quantity)
      .eq('material', material)
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (dupErr) throw dupErr
    if (existing) return { status: 'success', reference: existing.reference as string, estimate }

    for (let attempt = 0; attempt < 3; attempt++) {
      const reference = newReference()
      const { error } = await supabase.from('quote_requests').insert({
        reference,
        packaging_type: type,
        quantity_tier: quantity,
        material,
        phone,
        name,
        company,
        note,
        est_min_vnd: est?.min ?? null,
        est_max_vnd: est?.max ?? null,
        consent: formData.get('consent') === 'on' || formData.get('consent') === 'true',
        status: 'new',
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        referrer: (h.get('referer') ?? '').slice(0, 500) || null,
        ip_hash: ipHash,
        user_agent: (h.get('user-agent') ?? '').slice(0, 500) || null,
      })
      if (!error) return { status: 'success', reference, estimate }
      if (error.code !== '23505') throw error // 23505 = trùng reference → thử mã khác
    }
    throw new Error('Could not generate unique reference')
  } catch (err) {
    // Không log SĐT; chỉ log mã/thông điệp lỗi.
    const e = err as { code?: string; message?: string }
    console.error('[quote] save failed:', e?.code ?? '', e?.message ?? String(err))
    return serverError()
  }
}
