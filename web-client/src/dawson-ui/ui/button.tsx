import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@web-client/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const buttonVariants = cva(
  cn(
    'tw:text-[16px] tw:sm:text-[18px] tw:cursor-pointer tw:inline-flex tw:items-center tw:justify-center tw:whitespace-nowrap tw:rounded-md tw:text-base tw:transition-all tw:disabled:pointer-events-none tw:disabled:opacity-50 tw:[&_svg]:pointer-events-none tw:[&_svg:not([class*=size-])]:size-4 tw:shrink-0 tw:[&_svg]:shrink-0 tw:border-none',
    'tw:focus-visible:ring-[4px] tw:focus-visible:ring-ring', // focus-visible
    'tw:aria-invalid:ring-destructive/20 tw:aria-invalid:border-destructive', // aria
    'tw:w-full tw:xs:w-auto tw:px-4 tw:py-2', // small & greater
  ),
  {
    variants: {
      variant: {
        primary: cn(
          'tw:h-[40px] tw:bg-primary tw:text-primary-foreground tw:shadow-xs tw:outline-none tw:font-bold', // standard
          'tw:hover:bg-primary-darker', // hover
          'tw:focus-visible:ring-offset-[4px]', // focus-visible
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
          'tw:h-[40px] tw:shadow-none tw:bg-background tw:border-primary tw:border-2 tw:border-solid tw:text-primary tw:font-bold', // standard
          'tw:hover:text-primary-darker tw:hover:border-primary-darker', // hover
          'tw:focus:outline-none tw:focus:border-primary', // focus
          'tw:focus-visible:ring-offset-[4px] tw:focus-visible:border-primary tw:focus-visible:outline-none', // focus-visible
          'tw:active:text-secondary-active tw:active:border-secondary-active', // active
          'tw:invalid:text-secondary-invalid tw:invalid:border-secondary-invalid', // inactive / invalid
        ),
        destructiveTertiary: cn(
          'tw:px-0 tw:py-0 tw:bg-transparent tw:text-destructive tw:font-[400] tw:underline tw:underline-offset-4 tw:outline-none tw:font-normal', // standard,
          'tw:hover:underline tw:hover:text-destructive-darker', // hover
          'tw:focus-visible:ring-offset-[4px]', // focus-visible
          'tw:active:text-tertiary-active', // active
          'tw:invalid:text-tertiary-invalid', // invalid
        ),
        primaryTertiary: cn(
          'tw:px-0 tw:py-0 tw:bg-transparent tw:text-primary tw:font-[400] tw:underline tw:underline-offset-4  tw:outline-none tw:font-normal', // standard
          'tw:hover:underline tw:hover:text-primary-darker', // hover,
          'tw:focus-visible:ring-offset-[4px]', // focus-visible
          'tw:active:text-primary-active', // active
          'tw:invalid:text-tertiary-invalid', // active
          'tw:ml-0 tw:mr-auto tw:text-left', // left alignment
        ),
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);
export function Button({
  className,
  variant,
  iconPosition = 'left',
  asChild = false,
  icon,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    icon?: IconProp;
    iconPosition?: 'left' | 'right';
  }) {
  const Comp = asChild ? Slot : 'button';

  const Icon = icon ? (
    <FontAwesomeIcon
      className={`${iconPosition === 'left' ? 'tw:mr-[8px]' : 'tw:flex-row-reverse tw:ml-[8px]'} tw:xs:!w-[18px] tw:!w-[16px] tw:xs:!h-[18px] tw:!h-[16px]`}
      icon={icon}
      role="img"
      aria-label={'icon'}
    />
  ) : null;

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, className }))}
      {...props}
      role="button"
    >
      {iconPosition === 'left' && Icon}
      {children}
      {iconPosition === 'right' && Icon}
    </Comp>
  );
}
