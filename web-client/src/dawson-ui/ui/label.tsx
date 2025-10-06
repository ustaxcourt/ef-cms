import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@web-client/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "tw:flex tw:items-center tw:gap-2 tw:text-sm tw:leading-none tw:font-semibold tw:select-none tw:group-data-[disabled=true]:pointer-events-none tw:group-data-[disabled=true]:opacity-50 tw:peer-disabled:cursor-not-allowed tw:peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
