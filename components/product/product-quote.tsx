'use client'

import { createContext, useActionState, useContext, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Loader2, MessageCircle, Phone, ShieldCheck } from 'lucide-react'
import { submitQuoteRequest, type QuoteState } from '@/app/actions'
import { QUANTITY_TIERS, estimateUnitPrice, formatVnd } from '@/lib/quote'
import { normalizeVnPhone } from '@/lib/phone'
import { HOTLINE_DISPLAY, HOTLINE_TEL, ZALO_URL } from '@/lib/site'
import { defaultQuantity, finishById, getProduct, materialLabel, type Product } from '@/content/products'
import { cn } from '@/lib/utils'

type Config = { size: string; customSize: string; material: string; qty: string; finishes: string[] }
type Ctx = { product: Product; config: Config; set: (patch: Partial<Config>) => void; toggleFinish: (id: string, force?: boolean) => void }
const QuoteCtx = createContext<Ctx | null>(null)
const useQuote = () => {
  const c = useContext(QuoteCtx)
  if (!c) throw new Error('useQuote outside ProductQuoteProvider')
  return c
}

const defaults = (p: Product): Config => ({
  size: p.sizes[0].id,
  customSize: '',
  material: p.materials[0],
  qty: defaultQuantity(p),
  finishes: [],
})

/** PD-08 AC7: đọc cấu hình từ URL; giá trị không hợp lệ → mặc định, không báo lỗi. */
function fromUrl(p: Product): Config {
  const d = defaults(p)
  const q = new URLSearchParams(window.location.search)
  const size = q.get('size')
  const material = q.get('material')
  const qty = q.get('qty')
  const tier = QUANTITY_TIERS.find((t) => t.value === qty)
  return {
    ...d,
    size: size && (size === 'custom' || p.sizes.some((s) => s.id === size)) ? size : d.size,
    material: material && (p.materials as readonly string[]).includes(material) ? material : d.material,
    qty: tier && Number(tier.value) >= p.moq ? tier.value : d.qty,
    finishes: (q.get('finish') ?? '')
      .split(',')
      .filter((f, i, a) => (p.finishes as readonly string[]).includes(f) && a.indexOf(f) === i),
  }
}

function toUrl(c: Config) {
  const q = new URLSearchParams(window.location.search)
  q.set('size', c.size)
  q.set('material', c.material)
  q.set('qty', c.qty)
  if (c.finishes.length) q.set('finish', c.finishes.join(','))
  else q.delete('finish')
  window.history.replaceState(window.history.state, '', `${window.location.pathname}?${q.toString()}${window.location.hash}`)
}

export function ProductQuoteProvider({ slug, children }: { slug: string; children: React.ReactNode }) {
  const product = getProduct(slug)!
  const [config, setConfig] = useState<Config>(() => defaults(product))
  const hydrated = useRef(false)

  useEffect(() => {
    setConfig(fromUrl(product))
    hydrated.current = true
  }, [product])

  useEffect(() => {
    if (hydrated.current) toUrl(config)
  }, [config])

  const set = (patch: Partial<Config>) => setConfig((c) => ({ ...c, ...patch }))
  const toggleFinish = (id: string, force?: boolean) =>
    setConfig((c) => {
      const has = c.finishes.includes(id)
      const on = force ?? !has
      if (on === has) return c
      return { ...c, finishes: on ? [...c.finishes, id] : c.finishes.filter((f) => f !== id) }
    })

  return <QuoteCtx.Provider value={{ product, config, set, toggleFinish }}>{children}</QuoteCtx.Provider>
}

const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600'
const fieldClass =
  'h-11 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground focus-visible:border-cta focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cta/25 aria-invalid:border-destructive'
const nf = new Intl.NumberFormat('vi-VN')
const millions = (n: number) => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(n / 1_000_000)

/** PD-08: bộ chọn cấu hình + giá ước tính (giá chỉ phụ thuộc loại × số lượng × chất liệu). */
export function Configurator() {
  const { product, config, set, toggleFinish } = useQuote()
  const est = estimateUnitPrice(product.packaging_type, config.qty, config.material)
  const qtyNum = Number(config.qty)
  return (
    <div id="cau-hinh" className="scroll-mt-24 rounded-xl border border-border bg-white p-5 md:p-6">
      <h2 className="text-lg font-bold text-foreground">Cấu hình &amp; giá ước tính</h2>
      <div className="mt-4 grid gap-4">
        <div>
          <label htmlFor="cfg-size" className={labelClass}>Kích thước</label>
          <select id="cfg-size" value={config.size} onChange={(e) => set({ size: e.target.value })} className={fieldClass}>
            {product.sizes.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
            <option value="custom">Kích thước khác</option>
          </select>
          {config.size === 'custom' && (
            <div className="mt-2">
              <label htmlFor="cfg-custom" className="sr-only">Kích thước mong muốn</label>
              <input
                id="cfg-custom"
                value={config.customSize}
                maxLength={60}
                onChange={(e) => set({ customSize: e.target.value })}
                placeholder="VD: 220 × 160 × 70 mm"
                className={fieldClass}
              />
            </div>
          )}
        </div>
        <div>
          <label htmlFor="cfg-material" className={labelClass}>Chất liệu</label>
          <select id="cfg-material" value={config.material} onChange={(e) => set({ material: e.target.value })} className={fieldClass}>
            {product.materials.map((m) => (
              <option key={m} value={m}>{materialLabel(m)}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cfg-qty" className={labelClass}>Số lượng</label>
          <select id="cfg-qty" value={config.qty} onChange={(e) => set({ qty: e.target.value })} className={fieldClass}>
            {QUANTITY_TIERS.map((t) => {
              const below = Number(t.value) < product.moq
              return (
                <option key={t.value} value={t.value} disabled={below} title={below ? 'Dưới MOQ' : undefined}>
                  {t.label}{below ? ' (Dưới MOQ)' : ''}
                </option>
              )
            })}
          </select>
        </div>
        <fieldset>
          <legend className={labelClass}>Gia công</legend>
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {product.finishes.map((id) => (
              <label key={id} className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-md px-2 text-sm text-foreground hover:bg-muted">
                <input
                  type="checkbox"
                  checked={config.finishes.includes(id)}
                  onChange={() => toggleFinish(id)}
                  className="size-4 accent-[var(--color-navy,#0f172a)]"
                />
                {finishById(id)?.label ?? id}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <div className="mt-5 rounded-lg border border-dashed border-cta/50 bg-accent/50 px-4 py-3" aria-live="polite">
        <p className="text-xs font-medium text-slate-600">Đơn giá ước tính</p>
        <p className="text-xl font-extrabold tabular-nums text-foreground">
          {est ? `${formatVnd(est.min)} – ${formatVnd(est.max)} đ/sp` : '—'}
          <span className="ml-1 text-xs font-medium text-muted-foreground">chưa VAT</span>
        </p>
        {est && (
          <p className="mt-1 text-sm text-slate-700">
            ≈ {millions(est.min * qtyNum)} – {millions(est.max * qtyNum)} triệu cho {nf.format(qtyNum)} sp (ước tính)
          </p>
        )}
        <p className="mt-2 text-xs text-slate-600">
          Giá mẫu tham khảo, chưa gồm gia công đặc biệt và kích thước ngoài tiêu chuẩn.
        </p>
      </div>
      <a
        href="#bao-gia-san-pham"
        className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-cta px-5 font-bold text-cta-foreground hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
      >
        Báo giá sản phẩm này
        <ArrowRight className="size-4" aria-hidden="true" />
      </a>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <a href={HOTLINE_TEL} className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md border border-border text-sm font-semibold text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Phone className="size-4" aria-hidden="true" /> Gọi hotline
        </a>
        <a href={ZALO_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md border border-border text-sm font-semibold text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <MessageCircle className="size-4" aria-hidden="true" /> Chat Zalo
        </a>
      </div>
    </div>
  )
}

/** PD-12 AC3: bấm gia công → tick checkbox trong bộ chọn + cuộn tới bộ chọn. */
export function FinishPickButton({ id, children }: { id: string; children: React.ReactNode }) {
  const { config, toggleFinish } = useQuote()
  const on = config.finishes.includes(id)
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => {
        toggleFinish(id, true)
        document.getElementById('cau-hinh')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }}
      className={cn(
        'flex h-full w-full flex-col overflow-hidden rounded-xl border bg-white text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        on ? 'border-cta ring-1 ring-cta' : 'border-border hover:border-navy',
      )}
    >
      {children}
    </button>
  )
}

/** PD-09: form rút gọn, gọi cùng server action với form trang chủ + product_slug/options/note. */
export function ProductQuoteForm() {
  const { product, config } = useQuote()
  const [state, formAction, pending] = useActionState<QuoteState, FormData>(submitQuoteRequest, null)
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [clientErr, setClientErr] = useState<Record<string, string>>({})
  const phoneRef = useRef<HTMLInputElement>(null)
  const serverErr = state && !state.ok ? state.fieldErrors ?? {} : {}
  const errs: Record<string, string | undefined> = { ...serverErr, ...clientErr }
  const sizeLabel = config.size === 'custom' ? `Khác: ${config.customSize || '(chưa nhập)'}` : product.sizes.find((s) => s.id === config.size)?.label
  const qtyLabel = QUANTITY_TIERS.find((t) => t.value === config.qty)?.label
  const options = JSON.stringify({
    size: config.size,
    custom_size: config.size === 'custom' ? config.customSize : null,
    finishes: config.finishes,
  })
  const otherErr = state && !state.ok
    ? state.error === 'SERVER_ERROR'
      ? `Chưa gửi được yêu cầu, vui lòng thử lại hoặc gọi hotline ${HOTLINE_DISPLAY}.`
      : errs.options ?? errs.product_slug ?? errs.material ?? errs.quantity ?? errs.packagingType
    : clientErr.options

  if (state?.ok)
    return (
      <div id="bao-gia-san-pham" role="status" className="scroll-mt-24 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <CheckCircle2 className="mx-auto size-10 text-emerald-600" aria-hidden="true" />
        <h2 className="mt-3 text-xl font-bold text-foreground">Đã nhận yêu cầu báo giá</h2>
        <p className="mt-1 text-sm text-slate-700">PML sẽ liên hệ lại sớm nhất.</p>
        <p className="mt-3 inline-block rounded-md bg-white px-3 py-1.5 font-mono text-sm">Mã yêu cầu: {state.ref}</p>
      </div>
    )

  return (
    <form
      id="bao-gia-san-pham"
      action={formAction}
      noValidate
      aria-busy={pending}
      onSubmit={(e) => {
        const ce: Record<string, string> = {}
        if (!normalizeVnPhone(phone)) ce.phone = 'Số điện thoại không hợp lệ'
        if (note.trim().length > 500) ce.note = 'Ghi chú tối đa 500 ký tự'
        if (config.size === 'custom' && !config.customSize.trim()) ce.options = 'Vui lòng nhập kích thước mong muốn'
        setClientErr(ce)
        if (Object.keys(ce).length) {
          e.preventDefault()
          if (ce.phone) phoneRef.current?.focus()
        }
      }}
      className="scroll-mt-24 rounded-xl border border-border bg-white p-5 md:p-6"
    >
      <h2 className="text-xl font-bold text-foreground">Nhận báo giá chi tiết</h2>
      <input type="hidden" name="type" value={product.packaging_type} />
      <input type="hidden" name="quantity" value={config.qty} />
      <input type="hidden" name="material" value={config.material} />
      <input type="hidden" name="product_slug" value={product.slug} />
      <input type="hidden" name="options" value={options} />
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="pq-website">Website</label>
        <input id="pq-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 rounded-lg bg-muted/60 p-4 text-sm">
        <dt className="text-slate-600">Sản phẩm</dt><dd className="font-semibold">{product.name}</dd>
        <dt className="text-slate-600">Kích thước</dt><dd>{sizeLabel}</dd>
        <dt className="text-slate-600">Chất liệu</dt><dd>{materialLabel(config.material)}</dd>
        <dt className="text-slate-600">Số lượng</dt><dd>{qtyLabel}</dd>
        <dt className="text-slate-600">Gia công</dt>
        <dd>{config.finishes.length ? config.finishes.map((f) => finishById(f)?.label ?? f).join(', ') : 'Không'}</dd>
      </dl>
      <a href="#cau-hinh" className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        Sửa cấu hình
      </a>

      <div className="mt-3 grid gap-4">
        <div>
          <label htmlFor="pq-phone" className={labelClass}>Số điện thoại / Zalo</label>
          <input
            id="pq-phone"
            ref={phoneRef}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={20}
            required
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              setClientErr(({ phone: _p, ...r }) => r)
            }}
            placeholder={HOTLINE_DISPLAY}
            aria-invalid={errs.phone ? true : undefined}
            aria-describedby={errs.phone ? 'pq-phone-error' : undefined}
            className={fieldClass}
          />
          {errs.phone && <p id="pq-phone-error" role="alert" className="mt-1.5 text-xs font-medium text-destructive">{errs.phone}</p>}
        </div>
        <div>
          <label htmlFor="pq-note" className={labelClass}>Ghi chú (không bắt buộc)</label>
          <textarea
            id="pq-note"
            name="note"
            rows={3}
            maxLength={500}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            aria-invalid={errs.note ? true : undefined}
            aria-describedby="pq-note-count"
            className={cn(fieldClass, 'h-auto py-2')}
          />
          <p id="pq-note-count" className="mt-1 text-right text-xs text-slate-600">{note.length}/500</p>
          {errs.note && <p role="alert" className="text-xs font-medium text-destructive">{errs.note}</p>}
        </div>
      </div>
      {otherErr && <p role="alert" className="mt-3 text-sm font-medium text-destructive">{otherErr}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-cta px-5 font-bold text-cta-foreground hover:bg-cta-hover disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
      >
        {pending ? <><Loader2 className="size-4 animate-spin" aria-hidden="true" /> Đang gửi...</> : <>Nhận báo giá chi tiết <ArrowRight className="size-4" aria-hidden="true" /></>}
      </button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-600">
        <ShieldCheck className="size-3.5" aria-hidden="true" /> Thông tin được bảo mật. Miễn phí tư vấn &amp; làm mẫu.
      </p>
      <p className="mt-1 text-center text-[11px] leading-relaxed text-slate-600">
        Số điện thoại/Zalo của bạn chỉ được PML dùng để liên hệ tư vấn và báo giá, không chia sẻ cho bên thứ ba.
      </p>
      <p className="mt-2 text-center text-xs">
        <Link href={`/?product=${product.slug}#bao-gia`} className="underline underline-offset-4">Dùng form báo giá ở trang chủ</Link>
      </p>
    </form>
  )
}

/** PD-11 AC2: thanh dưới cố định trên mobile (<768px): Gọi · Zalo · Báo giá. */
export function MobileContactBar() {
  const cls = 'flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white'
  return (
    <nav aria-label="Liên hệ nhanh" className="fixed inset-x-0 bottom-0 z-40 flex border-t border-white/10 bg-navy text-white md:hidden">
      <a href={HOTLINE_TEL} className={cls}><Phone className="size-4" aria-hidden="true" />Gọi</a>
      <a href={ZALO_URL} target="_blank" rel="noopener noreferrer" className={cls}><MessageCircle className="size-4" aria-hidden="true" />Zalo</a>
      <a href="#bao-gia-san-pham" className={cn(cls, 'bg-cta text-cta-foreground')}><ArrowRight className="size-4" aria-hidden="true" />Báo giá</a>
    </nav>
  )
}
