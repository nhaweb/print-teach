'use client'

import { useState } from 'react'
import Image, { type ImageProps } from 'next/image'
import { Logo } from '@/components/landing/logo'
import { cn } from '@/lib/utils'

/** PD-06 AC4 / PD-19: ảnh lỗi → placeholder có logo, giữ nguyên khung (không vỡ layout). */
export function SafeImage({ className, alt, ...props }: ImageProps) {
  const [failed, setFailed] = useState(false)
  if (failed)
    return (
      <span role="img" aria-label={alt} className={cn('grid size-full place-items-center bg-muted', className)}>
        <span className="opacity-40" aria-hidden="true">
          <Logo />
        </span>
      </span>
    )
  return <Image {...props} alt={alt} className={className} onError={() => setFailed(true)} />
}
