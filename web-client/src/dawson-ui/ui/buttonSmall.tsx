import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@web-client/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const tertiaryBaseStyles = cn(
  'tw:px-0 tw:py-0 tw:bg-transparent tw:font-[400] tw:underline', // standard
  'tw:focus-visible:bg-white', // focus-visible
);

const primaryColors = cn(
  'tw:text-blue-primary tw:fill-blue-primary', // standard
  'tw:hover:text-blue-dark tw:hover:fill-blue-dark', // hover
  'tw:active:text-blue-darker tw:active:fill-blue-darker', // active
  'tw:invalid:text-grey-light tw:invalid:fill-grey-light', // invalid
);

const buttonVariants = cva(
  cn(
    'tw:text-[14px] tw:xs:text-[16px] tw:font-normal tw:outline-none tw:border-none tw:cursor-pointer tw:inline-flex tw:items-center tw:justify-center tw:whitespace-nowrap tw:rounded-[8px] tw:transition-all tw:disabled:pointer-events-none tw:disabled:opacity-50 tw:[&_svg]:pointer-events-none tw:[&_svg:not([class*=size-])]:size-4 tw:shrink-0 tw:[&_svg]:shrink-0',
    'tw:focus-visible:ring-[4px] tw:focus-visible:ring-offset-[4px] tw:focus-visible:ring-ring tw:focus-visible:outline-none', // focus-visible
    'tw:aria-invalid:ring-red-primary/20 tw:aria-invalid:border-red-primary', // aria
    'tw:w-full tw:xs:w-auto tw:px-[16px] tw:py-[8px]', // small & greater
  ),
  {
    variants: {
      variant: {
        destructiveTertiary: cn(
          'tw:px-0 tw:py-0 tw:bg-transparent tw:text-red-primary tw:fill-red-primary tw:font-[400] tw:underline', // standard,
          'tw:hover:text-red-dark', // hover
          'tw:focus-visible:bg-white', // focus-visible
          'tw:active:text-red-darker', // active
          'tw:invalid:text-grey-light tw:invalid:fill-grey-light', // invalid
        ),
        primaryTertiary: cn(tertiaryBaseStyles, primaryColors),
      },
    },
    defaultVariants: {
      variant: 'primaryTertiary',
    },
  },
);

export function ButtonSmall({
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
      <>
        {iconPosition === 'left' && Icon}
        {children}
        {iconPosition === 'right' && Icon}
      </>
    </Comp>
  );
}
