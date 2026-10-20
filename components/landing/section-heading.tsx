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
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
      <p
        className={cn(
          'inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]',
          tone === 'dark' ? 'text-cta' : 'text-cta-hover',
        )}
      >
        <span aria-hidden="true" className="h-px w-6 bg-current" />
        {eyebrow}
      </p>
      <h2
        id={id}
        className={cn(
          'mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl',
          tone === 'dark' ? 'text-white' : 'text-foreground',
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-4 text-pretty leading-relaxed md:text-lg',
            tone === 'dark' ? 'text-slate-300' : 'text-muted-foreground',
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
