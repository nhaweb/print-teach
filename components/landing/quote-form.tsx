'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Calculator, CheckCircle2, ChevronDown, Loader2, ShieldCheck } from 'lucide-react'
import { submitQuoteRequest, type QuoteState } from '@/app/actions'
import { MATERIALS, PACKAGING_TYPES, QUANTITY_TIERS, estimateUnitPrice, formatVnd } from '@/lib/quote'

const fieldClass =
  'h-11 w-full appearance-none rounded-md border border-input bg-white px-3 pr-9 text-sm text-foreground shadow-xs transition-colors hover:border-slate-400 focus-visible:border-cta focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cta/25 aria-invalid:border-destructive aria-invalid:ring-destructive/15'

const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600'

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  options: readonly { value: string; label: string }[]
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <select id={id} name={id} value={value} onChange={(e) => onChange(e.target.value)} className={fieldClass}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
        />
      </div>
    </div>
  )
}

export function QuoteForm() {
  const [type, setType] = useState<string>(PACKAGING_TYPES[0].value)
  const [quantity, setQuantity] = useState<string>(QUANTITY_TIERS[1].value)
  const [material, setMaterial] = useState<string>(MATERIALS[0].value)
  const [state, formAction, pending] = useActionState<QuoteState, FormData>(submitQuoteRequest, {
    status: 'idle',
  })

  const [phone, setPhone] = useState('')
  const [utm, setUtm] = useState({ utm_source: '', utm_medium: '', utm_campaign: '' })
  const phoneRef = useRef<HTMLInputElement>(null)

  const estimate = estimateUnitPrice(type, quantity, material)
  const phoneError = state.status === 'error' && state.field === 'phone'

  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    setUtm({
      utm_source: q.get('utm_source') ?? '',
      utm_medium: q.get('utm_medium') ?? '',
      utm_campaign: q.get('utm_campaign') ?? '',
    })
  }, [])

  useEffect(() => {
    if (phoneError) phoneRef.current?.focus()
  }, [state, phoneError])

  return (
    <div id="bao-gia" className="relative rounded-xl border border-white/10 bg-white p-6 shadow-2xl shadow-black/40 md:p-8">
      <div className="absolute inset-x-6 -top-px h-px bg-gradient-to-r from-transparent via-cta to-transparent md:inset-x-8" aria-hidden="true" />

      <AnimatePresence mode="wait" initial={false}>
        {state.status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-10 text-center"
            role="status"
          >
            <span className="grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="size-7" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-xl font-bold text-foreground">Đã nhận yêu cầu báo giá</h2>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Chuyên viên PML sẽ liên hệ qua Zalo/điện thoại trong vòng <strong className="text-foreground">15 phút</strong> (giờ hành chính).
            </p>
            <p className="mt-4 rounded-md bg-muted px-3 py-1.5 font-mono text-sm text-foreground">
              Mã yêu cầu: {state.reference}
            </p>
            {state.demo && (
              <p className="mt-3 max-w-xs text-xs text-amber-700">
                Chế độ demo: hệ thống chưa kết nối cơ sở dữ liệu nên yêu cầu chưa được lưu.
              </p>
            )}
          </motion.div>
        ) : (
          <motion.form key="form" action={formAction} exit={{ opacity: 0, y: -8 }} noValidate aria-busy={pending}>
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
            </div>
            {Object.entries(utm).map(([k, v]) => (
              <input key={k} type="hidden" name={k} value={v} />
            ))}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Báo giá nhanh trong 15 phút</h2>
                <p className="mt-1 text-sm text-muted-foreground">Dự toán đơn giá tham khảo tức thì.</p>
              </div>
              <span className="grid size-10 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground">
                <Calculator className="size-5" aria-hidden="true" />
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <SelectField id="type" label="Loại bao bì" value={type} onChange={setType} options={PACKAGING_TYPES} />
              </div>
              <SelectField id="quantity" label="Số lượng" value={quantity} onChange={setQuantity} options={QUANTITY_TIERS} />
              <SelectField id="material" label="Chất liệu giấy/nhựa" value={material} onChange={setMaterial} options={MATERIALS} />
              <div className="sm:col-span-2">
                <label htmlFor="phone" className={labelClass}>
                  Số điện thoại / Zalo
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  ref={phoneRef}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={20}
                  placeholder="0901 234 567"
                  aria-invalid={phoneError || undefined}
                  aria-describedby={phoneError ? 'phone-error' : undefined}
                  className={fieldClass.replace('pr-9', 'pr-3')}
                />
                {phoneError && (
                  <p id="phone-error" role="alert" className="mt-1.5 text-xs font-medium text-destructive">
                    {state.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-dashed border-cta/50 bg-accent/50 px-4 py-3" aria-live="polite">
              <span className="text-xs font-medium text-slate-600">Đơn giá dự kiến</span>
              <span className="text-right">
                <span className="block text-lg font-extrabold tabular-nums text-foreground">
                  {estimate ? `${formatVnd(estimate.min)} – ${formatVnd(estimate.max)}đ` : '—'}
                </span>
                <span className="block text-[11px] text-muted-foreground">/sản phẩm, chưa VAT</span>
              </span>
            </div>

            {state.status === 'error' && state.field === 'form' && (
              <p className="mt-3 text-sm font-medium text-destructive" role="alert">
                {state.message}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-cta px-5 text-base font-bold text-cta-foreground shadow-sm transition-all hover:bg-cta-hover active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
            >
              {pending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Đang gửi...
                </>
              ) : (
                <>
                  Nhận báo giá chi tiết
                  <ArrowRight className="size-4" aria-hidden="true" />
                </>
              )}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Thông tin được bảo mật. Miễn phí tư vấn & làm mẫu.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
