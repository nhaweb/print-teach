'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Menu, Phone, X } from 'lucide-react'
import { Logo } from './logo'

const NAV_ITEMS = [
  { label: 'Dịch vụ', href: '#dich-vu' },
  { label: 'Sản phẩm', href: '/san-pham' },
  { label: 'Năng lực sản xuất', href: '#nang-luc' },
  { label: 'Sản phẩm mẫu', href: '#san-pham-mau' },
  { label: 'Bảng giá', href: '#bao-gia' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'
  // PD-04 AC3: ở trang khác, anchor trỏ về trang chủ (/#bao-gia…).
  const href = (h: string) => (h.startsWith('#') && !isHome ? `/${h}` : h)
  const isActive = (h: string) => h.startsWith('/') && (pathname === h || pathname.startsWith(`${h}/`))

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 md:px-6 lg:h-[72px]">
        <Link
          href={isHome ? '#' : '/'}
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="PML PrintTech — Trang chủ"
        >
          <Logo />
        </Link>

        <nav aria-label="Điều hướng chính" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={href(item.href)}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:bg-muted aria-[current=page]:font-semibold aria-[current=page]:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="tel:0901234567"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-white py-1.5 pl-1.5 pr-3.5 transition-colors hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="grid size-7 place-items-center rounded-full bg-navy text-white">
              <Phone className="size-3.5" aria-hidden="true" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Hotline 24/7
              </span>
              <span className="text-sm font-bold tabular-nums text-foreground">0901 234 567</span>
            </span>
          </a>
          <a
            href={href('#bao-gia')}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-cta px-4 text-sm font-semibold text-cta-foreground shadow-sm transition-all hover:bg-cta-hover active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
          >
            Yêu cầu Báo giá Nhanh
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="grid size-10 place-items-center rounded-md border border-border text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        >
          {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          <span className="sr-only">{open ? 'Đóng menu' : 'Mở menu'}</span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Điều hướng di động"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden border-t border-border bg-white lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-4">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={href(item.href)}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className="block rounded-md px-3 py-3 text-base font-medium text-foreground hover:bg-muted aria-[current=page]:bg-muted aria-[current=page]:font-semibold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mt-3 grid gap-2 sm:grid-cols-2">
                <a
                  href="tel:0901234567"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border font-semibold text-foreground hover:bg-muted"
                >
                  <Phone className="size-4" aria-hidden="true" />
                  0901 234 567
                </a>
                <a
                  href={href('#bao-gia')}
                  onClick={() => setOpen(false)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-cta font-semibold text-cta-foreground hover:bg-cta-hover"
                >
                  Yêu cầu Báo giá Nhanh
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
