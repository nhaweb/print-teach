'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { MATERIALS, PACKAGING_TYPES } from '@/lib/quote'
import { PRODUCTS } from '@/content/products'
import { cn } from '@/lib/utils'
import { ProductCard } from './product-card'

type Filters = { loai: string[]; chatLieu: string[] }
const TYPE_VALUES = PACKAGING_TYPES.map((t) => t.value as string)
const MAT_VALUES = MATERIALS.map((m) => m.value as string)

function readFilters(): Filters {
  const q = new URLSearchParams(window.location.search)
  const list = (k: string, allowed: string[]) =>
    q.getAll(k).flatMap((v) => v.split(',')).filter((v, i, a) => allowed.includes(v) && a.indexOf(v) === i)
  return { loai: list('loai', TYPE_VALUES), chatLieu: list('chat-lieu', MAT_VALUES) }
}

function writeFilters(f: Filters) {
  const q = new URLSearchParams()
  if (f.loai.length) q.set('loai', f.loai.join(','))
  if (f.chatLieu.length) q.set('chat-lieu', f.chatLieu.join(','))
  const qs = q.toString()
  window.history.replaceState(window.history.state, '', `${window.location.pathname}${qs ? `?${qs}` : ''}`)
}

const chip =
  'inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

/** PD-02/PD-03: lưới sản phẩm + lọc Loại (OR) AND Chất liệu (OR), đồng bộ query URL, không reload. */
export function Catalog() {
  const [f, setF] = useState<Filters>({ loai: [], chatLieu: [] })

  useEffect(() => {
    const sync = () => setF(readFilters())
    sync()
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  const update = useCallback((next: Filters) => {
    setF(next)
    writeFilters(next)
  }, [])

  const toggle = (key: keyof Filters, v: string) => {
    const cur = f[key]
    update({ ...f, [key]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] })
  }

  const items = useMemo(
    () =>
      PRODUCTS.filter(
        (p) =>
          (!f.loai.length || f.loai.includes(p.packaging_type)) &&
          (!f.chatLieu.length || p.materials.some((m) => f.chatLieu.includes(m))),
      ),
    [f],
  )

  const groups = [
    { key: 'loai' as const, label: 'Loại bao bì', options: PACKAGING_TYPES },
    { key: 'chatLieu' as const, label: 'Chất liệu', options: MATERIALS },
  ]

  return (
    <div>
      <div className="grid gap-5 rounded-xl border border-border bg-white p-4 md:p-6">
        {groups.map((g) => (
          <fieldset key={g.key} className="min-w-0">
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">{g.label}</legend>
            <div className="flex flex-wrap gap-2">
              {g.options.map((o) => {
                const on = f[g.key].includes(o.value)
                return (
                  <button
                    key={o.value}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(g.key, o.value)}
                    className={cn(
                      chip,
                      on ? 'border-navy bg-navy text-white' : 'border-border bg-white text-slate-700 hover:border-slate-400',
                    )}
                  >
                    {o.label}
                  </button>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-700" aria-live="polite">
          {items.length} sản phẩm
        </p>
        {(f.loai.length > 0 || f.chatLieu.length > 0) && (
          <button
            type="button"
            onClick={() => update({ loai: [], chatLieu: [] })}
            className="min-h-11 text-sm font-semibold text-foreground underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Xoá bộ lọc
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-border bg-white p-10 text-center">
          <p className="text-lg font-semibold text-foreground">Chưa có sản phẩm phù hợp</p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => update({ loai: [], chatLieu: [] })}
              className="inline-flex min-h-11 items-center rounded-md border border-navy px-5 text-sm font-semibold text-foreground hover:bg-navy hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Xoá bộ lọc
            </button>
            <Link
              href="/#bao-gia"
              className="inline-flex min-h-11 items-center rounded-md bg-cta px-5 text-sm font-semibold text-cta-foreground hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Yêu cầu báo giá theo yêu cầu riêng
            </Link>
          </div>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
