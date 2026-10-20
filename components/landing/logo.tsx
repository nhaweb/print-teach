import { cn } from '@/lib/utils'

export function Logo({ tone = 'dark', className }: { tone?: 'dark' | 'light'; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        aria-hidden="true"
        className="grid size-9 place-items-center rounded-md bg-cta font-extrabold text-cta-foreground"
      >
        P
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'text-base font-extrabold tracking-tight',
            tone === 'dark' ? 'text-foreground' : 'text-white',
          )}
        >
          PML PrintTech
        </span>
        <span
          className={cn(
            'mt-1 text-[10px] font-semibold uppercase tracking-[0.2em]',
            tone === 'dark' ? 'text-muted-foreground' : 'text-slate-400',
          )}
        >
          Packaging & Print
        </span>
      </span>
    </span>
  )
}
