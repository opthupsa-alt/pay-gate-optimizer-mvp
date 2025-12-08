import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'bg-gradient-to-r from-muted via-muted/60 to-muted animate-shimmer rounded-md bg-[length:200%_100%]',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
