import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@web-client/lib/utils';

const buttonVariants = cva(
  cn(
    'tw:cursor-pointer tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:whitespace-normal tw:rounded-md tw:transition-all tw:disabled:pointer-events-none tw:disabled:opacity-50',
    'tw:[&_svg]:pointer-events-none tw:[&_svg]:shrink-0 tw:[&_svg]:w-4 tw:[&_svg]:h-4 tw:shrink-0',
    'tw:focus-visible:ring-[3px] tw:focus-visible:ring-ring focus-visible:ring-4 tw:focus-visible:border-ring',
    'tw:aria-invalid:ring-destructive/20 tw:aria-invalid:border-destructive',
    'tw:w-full tw:xs:w-auto',
  ),
  {
    variants: {
      variant: {
        primary: cn(
          'tw:bg-primary tw:text-primary-foreground tw:shadow-xs tw:outline-none tw:border-2 tw:border-primary',
          'tw:hover:bg-primary-darker tw:hover:border-primary-darker',
          'tw:focus-visible:ring-offset-[4px] tw:focus-visible:ring-[4px]',
          'tw:active:bg-primary-active tw:active:border-primary-active',
          'tw:invalid:bg-primary-invalid tw:invalid:border-primary-invalid',
        ),
        destructive: cn(
          'tw:bg-destructive tw:text-white tw:shadow-xs tw:outline-none tw:border-2 tw:border-destructive',
          'tw:hover:bg-destructive-darker tw:hover:border-destructive-darker',
          'tw:focus-visible:ring-offset-4',
          'tw:active:bg-destructive-active tw:active:border-destructive-active',
          'tw:invalid:bg-destructive-invalid tw:invalid:border-destructive-invalid',
        ),
        secondary: cn(
          'tw:shadow-none tw:bg-background tw:outline-primary tw:outline-2 tw:text-primary',
          'tw:hover:text-primary-darker tw:hover:outline-primary-darker',
          'tw:focus-visible:ring-offset-[6px] tw:focus-visible:ring-[4px]',
          'tw:active:text-secondary-active tw:active:outline-secondary-active',
          'tw:invalid:text-secondary-invalid tw:invalid:outline-secondary-invalid',
        ),
        destructiveTertiary: cn(
          'tw:bg-transparent tw:text-destructive tw:font-[400] tw:underline tw:underline-offset-4 tw:outline-none tw:border-2 tw:border-transparent',
          'tw:hover:underline tw:hover:text-destructive-darker tw:hover:border-destructive-darker',
          'tw:has-[>svg]:p-0 tw:focus-visible:ring-offset-[3px]',
          'tw:active:text-tertiary-active tw:active:border-tertiary-active',
          'tw:invalid:text-tertiary-invalid tw:invalid:border-tertiary-invalid',
        ),
        primaryTertiary: cn(
          'tw:bg-transparent tw:text-primary tw:font-[400] tw:underline tw:underline-offset-4 tw:outline-none tw:border-2 tw:border-transparent',
          'tw:hover:underline tw:hover:text-primary-darker tw:hover:border-primary-darker',
          'tw:has-[>svg]:px-[4px] tw:has-[>svg]:py-[2px] h-[24px]',
          'tw:active:text-primary-active tw:active:border-primary-active',
          'tw:invalid:text-tertiary-invalid tw:invalid:border-tertiary-invalid',
          'tw:block tw:ml-0 tw:mr-auto tw:text-left',
        ),
      },
      size: {
        default: 'tw:px-4 tw:h-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  isFirst = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isFirst?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const captionRef = React.useRef<HTMLSpanElement>(null);
  const [isWrapped, setIsWrapped] = React.useState(false);

  React.useEffect(() => {
    const checkWrap = () => {
      if (!buttonRef.current || !captionRef.current) return;
      const caption = captionRef.current;

      // Does the text span over multiple lines?
      const wrapped = caption.scrollWidth > caption.clientWidth;
      setIsWrapped(wrapped);
    };

    const resizeObserver = new ResizeObserver(checkWrap);
    if (buttonRef.current) resizeObserver.observe(buttonRef.current);
    window.addEventListener('resize', checkWrap);

    checkWrap();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', checkWrap);
    };
  }, []);

  const fontSizeClass = isWrapped ? 'tw:text-[16px]' : 'tw:text-[18px]';
  const fontSizeLabel = isWrapped ? '16px' : '18px';

  return (
    <Comp
      ref={buttonRef}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {React.Children.map(children, child => {
        if (typeof child === 'string') {
          return (
            <span ref={captionRef} className={cn(fontSizeClass)}>
              {child}
              {isFirst && ` (${fontSizeLabel})`}
            </span>
          );
        }
        return child;
      })}
    </Comp>
  );
}

export { Button, buttonVariants };
