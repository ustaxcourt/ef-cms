import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@web-client/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const buttonVariants = cva(
  cn(
    'tw:text-[16px] tw:sm:text-[18px] tw:cursor-pointer tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:whitespace-nowrap tw:rounded-md tw:text-base tw:transition-all tw:disabled:pointer-events-none tw:disabled:opacity-50 tw:[&_svg]:pointer-events-none tw:[&_svg:not([class*=size-])]:size-4 tw:shrink-0 tw:[&_svg]:shrink-0 tw:border-none',
    'tw:focus-visible:ring-[3px] tw:focus-visible:ring-ring  focus-visible:ring-4 tw:focus-visible:border-ring', // focus-visible
    'tw:aria-invalid:ring-destructive/20 tw:aria-invalid:border-destructive', // aria
    'tw:w-full tw:xs:w-auto', // small & greater
  ),
  {
    variants: {
      variant: {
        primary: cn(
          'tw:h-[40px] tw:bg-primary tw:text-primary-foreground tw:shadow-xs tw:outline-none tw:font-bold', // standard
          'tw:hover:bg-primary-darker', // hover
          'tw:focus-visible:ring-offset-[4px] tw:focus-visible:ring-[4px]', // focus-visible
          'tw:active:bg-primary-active', // active
          'tw:invalid:bg-primary-invalid', // inactive / invalid
        ),
        destructive: cn(
          'tw:h-[40px] tw:bg-destructive tw:text-white tw:shadow-xs  tw:outline-none tw:border-none tw:font-bold', // standard
          'tw:hover:bg-destructive-darker', // hover
          'tw:focus-visible:ring-offset-4', // focus-visible
          'tw:active:bg-destructive-active', // active
          'tw:invalid:bg-destructive-invalid', // invalid
        ),
        secondary: cn(
          'tw:h-[40px] tw:shadow-none tw:bg-background tw:outline-primary tw:outline-2 tw:text-primary tw:font-bold', // standard
          'tw:hover:text-primary-darker tw:hover:outline-primary-darker', // hover
          'tw:focus-visible:ring-offset-[6px] tw:focus-visible:ring-[4px]', // focus-visible
          'tw:active:text-secondary-active tw:active:outline-secondary-active', // active
          'tw:invalid:text-secondary-invalid tw:invalid:outline-secondary-invalid', // inactive / invalid
        ),
        destructiveTertiary: cn(
          'tw:bg-transparent tw:text-destructive tw:font-[400] tw:underline tw:underline-offset-4 tw:outline-none tw:font-normal ', // standard,
          'tw:hover:underline tw:hover:text-destructive-darker', // hover
          'tw:has-[>svg]:p-0 tw:focus-visible:ring-offset-[3px]', // focus-visible
          'tw:active:text-tertiary-active', // active
          'tw:invalid:text-tertiary-invalid', // invalid
        ),
        primaryTertiary: cn(
          'tw:bg-transparent tw:text-primary tw:font-[400] tw:underline tw:underline-offset-4  tw:outline-none tw:font-normal', // standard
          'tw:hover:underline tw:hover:text-primary-darker', // hover,
          'tw:has-[>svg]:px-[4px] tw:has-[>svg]:py-[2px] h-[24px]', // focus-visible
          'tw:active:text-primary-active', // active
          'tw:invalid:text-tertiary-invalid', // active
          'tw:ml-0 tw:mr-auto tw:text-left', // left alignment
        ),
      },
      size: {
        default: 'tw:px-4 tw:py-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);
export function Button({
  className,
  variant,
  iconHeight = 16,
  iconWidth = 16,
  asChild = false,
  icon,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    icon?: IconProp;
    iconHeight?: number;
    iconWidth?: number;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, className }))
      }
      {...props}
    >
      {icon ? <FontAwesomeIcon className={`mr-1 tw:!h-[${iconHeight}px] tw:!w-[${iconWidth}px]`} icon={icon} /> : ''}
      {children}
    </Comp>
  );
}
