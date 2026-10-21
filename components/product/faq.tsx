'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

/** PD-14: accordion, mặc định đóng, mở độc lập; button + aria-expanded + aria-controls. */
export function Faq({ items }: { items: readonly { q: string; a: string }[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set())
  return (
    <ul className="divide-y divide-border rounded-xl border border-border bg-white">
      {items.map((it, i) => {
        const on = open.has(i)
        return (
          <li key={it.q}>
            <h3>
              <button
                type="button"
                id={`faq-q-${i}`}
                aria-expanded={on}
                aria-controls={`faq-a-${i}`}
                onClick={() =>
                  setOpen((s) => {
                    const n = new Set(s)
                    if (n.has(i)) n.delete(i)
                    else n.add(i)
                    return n
                  })
                }
                className="flex min-h-11 w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-foreground hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                {it.q}
                <ChevronDown className={cn('size-5 shrink-0 transition-transform motion-reduce:transition-none', on && 'rotate-180')} aria-hidden="true" />
              </button>
            </h3>
            <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} hidden={!on} className="px-5 pb-4 text-sm leading-relaxed text-slate-600">
              {it.a}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
