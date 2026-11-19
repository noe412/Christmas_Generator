import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-11 w-full rounded-full border border-white/15 bg-white/[0.07] px-5 text-[0.95rem] text-snow transition-colors outline-none placeholder:text-snow/40 focus:border-ember-300/70 focus:bg-white/10",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
