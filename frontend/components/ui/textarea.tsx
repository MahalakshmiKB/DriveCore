import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full rounded-xl border border-border/60 bg-transparent px-3 py-2 text-base transition-all duration-200 ease-out outline-none placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/10 dark:border-border/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 shadow-[0_1px_2px_0_rgba(0,0,0,0.01)]",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
