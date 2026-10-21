import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  id?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'light',
  id,
}: SectionHeadingProps) {
  return (
    <div className={cn('min-w-0 max-w-full', align === 'center' && 'mx-auto text-center')}>
      <p
        className={cn(
          'inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]',
          tone === 'dark' ? 'text-cta' : 'text-cta-text',
        )}
      >
        <span aria-hidden="true" className="h-px w-6 bg-current" />
        {eyebrow}
      </p>
      <h2
        id={id}
        className={cn(
          // Review KH: tiêu đề 1 dòng ở md+ (clamp để vừa khung); mobile nhỏ cho phép xuống dòng.
          'mt-3 text-balance text-[clamp(1.5rem,5.5vw,1.875rem)] font-bold tracking-tight md:whitespace-nowrap md:text-[clamp(1.5rem,3.4vw,2.25rem)]',
          tone === 'dark' ? 'text-white' : 'text-foreground',
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-4 max-w-2xl text-pretty leading-relaxed md:text-lg',
            tone === 'dark' ? 'text-slate-300' : 'text-muted-foreground',
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
