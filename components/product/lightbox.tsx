'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react'
import { SafeImage } from './safe-image'
import { cn } from '@/lib/utils'

export type LightboxImage = { src: string; alt: string; caption?: string }

/**
 * PD-06 AC2 / PD-18: lightbox toàn màn hình. ←/→, nút trước/sau, vuốt; zoom 2x; đóng Esc / X / bấm nền;
 * focus trap; trả focus về phần tử mở (do caller truyền returnFocus).
 */
export function Lightbox({
  images,
  index,
  onIndex,
  onClose,
  label,
}: {
  images: readonly LightboxImage[]
  index: number
  onIndex: (i: number) => void
  onClose: () => void
  label: string
}) {
  const [zoom, setZoom] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const touchX = useRef<number | null>(null)
  const n = images.length
  const go = (d: number) => {
    setZoom(false)
    onIndex((index + d + n) % n)
  }

  useEffect(() => {
    closeRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'Tab') {
        const els = dialogRef.current?.querySelectorAll<HTMLElement>('button')
        if (!els?.length) return
        const first = els[0]
        const last = els[els.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const img = images[index]
  const btn =
    'grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="flex items-center justify-between gap-2 p-3 text-white">
        <p className="text-sm tabular-nums" aria-live="polite">
          {index + 1} / {n}
        </p>
        <div className="flex gap-2">
          <button type="button" className={btn} onClick={() => setZoom((z) => !z)} aria-pressed={zoom}>
            {zoom ? <ZoomOut className="size-5" aria-hidden="true" /> : <ZoomIn className="size-5" aria-hidden="true" />}
            <span className="sr-only">{zoom ? 'Thu nhỏ' : 'Phóng to 2x'}</span>
          </button>
          <button ref={closeRef} type="button" className={btn} onClick={onClose}>
            <X className="size-5" aria-hidden="true" />
            <span className="sr-only">Đóng</span>
          </button>
        </div>
      </div>
      <div
        className="relative flex-1 overflow-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
        onTouchStart={(e) => {
          touchX.current = e.touches[0]?.clientX ?? null
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null || zoom) return
          const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current
          touchX.current = null
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
        }}
      >
        <div
          className={cn('relative mx-auto h-full w-full', zoom && 'h-[200%] w-[200%] max-w-none')}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <SafeImage src={img.src} alt={img.alt} fill sizes={zoom ? '200vw' : '100vw'} className="object-contain" />
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 p-3 text-white">
        <button type="button" className={btn} onClick={() => go(-1)}>
          <ChevronLeft className="size-6" aria-hidden="true" />
          <span className="sr-only">Ảnh trước</span>
        </button>
        <p className="line-clamp-2 text-center text-sm text-slate-200">{img.caption ?? img.alt}</p>
        <button type="button" className={btn} onClick={() => go(1)}>
          <ChevronRight className="size-6" aria-hidden="true" />
          <span className="sr-only">Ảnh sau</span>
        </button>
      </div>
    </div>,
    document.body,
  )
}
