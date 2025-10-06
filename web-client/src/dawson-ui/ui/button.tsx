import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@web-client/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { CircleXmark } from './icons';

const tertiaryBaseStyles = cn(
  'tw:px-0 tw:py-0 tw:bg-transparent tw:font-[400] tw:underline', // standard
  'tw:focus-visible:bg-white', // focus-visible
);

const primaryColors = cn(
  'tw:text-primary tw:fill-primary', // standard
  'tw:hover:text-primary-dark tw:hover:fill-primary-dark', // hover
  'tw:active:text-primary-darker tw:active:fill-primary-darker', // active
  'tw:invalid:text-grey-light tw:invalid:fill-grey-light', // invalid
);

const buttonVariants = cva(
  cn(
    'tw:text-[16px] tw:xs:text-[18px] tw:font-normal tw:outline-none tw:border-none tw:cursor-pointer tw:inline-flex tw:items-center tw:justify-center tw:whitespace-nowrap tw:rounded-[6px] tw:transition-all tw:disabled:pointer-events-none tw:disabled:opacity-50 tw:[&_svg]:pointer-events-none tw:[&_svg:not([class*=size-])]:size-4 tw:shrink-0 tw:[&_svg]:shrink-0',
    'tw:focus-visible:ring-[4px] tw:focus-visible:ring-offset-[4px] tw:focus-visible:ring-ring tw:focus-visible:outline-none', // focus-visible
    'tw:aria-invalid:ring-destructive/20 tw:aria-invalid:border-destructive', // aria
    'tw:w-full tw:xs:w-auto tw:px-[16px] tw:py-[8px]', // small & greater
  ),
  {
    variants: {
      variant: {
        primary: cn(
          'tw:h-[40px] tw:bg-primary tw:text-primary-foreground tw:shadow-xs tw:font-bold', // standard
          'tw:hover:bg-primary-dark', // hover
          'tw:active:bg-primary-darker', // active
          'tw:invalid:bg-grey-light', // invalid
        ),
        destructive: cn(
          'tw:h-[40px] tw:bg-destructive tw:text-white tw:shadow-xs tw:font-bold', // standard
          'tw:hover:bg-destructive-dark', // hover
          'tw:active:bg-destructive-darker', // active
          'tw:invalid:bg-grey-light', // invalid
        ),
        secondary: cn(
          primaryColors,
          'tw:h-[40px] tw:shadow-none tw:bg-background tw:border-primary tw:border-[2px] tw:border-solid tw:font-bold', // standard
          'tw:hover:border-primary-dark', // hover
          'tw:active:border-primary-darker', // active
          'tw:invalid:border-grey-light', // invalid
        ),
        destructiveTertiary: cn(
          'tw:px-0 tw:py-0 tw:bg-transparent tw:text-destructive tw:fill-destructive tw:font-[400] tw:underline', // standard,
          'tw:hover:text-destructive-dark', // hover
          'tw:focus-visible:bg-white', // focus-visible
          'tw:active:text-destructive-darker', // active
          'tw:invalid:text-grey-light tw:invalid:fill-grey-light', // invalid
        ),
        primaryTertiary: cn(tertiaryBaseStyles, primaryColors),
        terminatorButton: cn(
          tertiaryBaseStyles,
          primaryColors,
          'tw:xs:text-[16px] tw:text-[14px]',
          'tw:[&_span]:mr-[8px]',
          'tw:[&_div]:flex tw:[&_div]:items-center',
          'tw:[&_svg]:!h-[14px] tw:[&_svg]:!w-[14px] tw:xs:[&_svg]:!h-[16px] tw:xs:[&_svg]:!w-[16px]',
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
      {variant === 'terminatorButton' ? (
        <div>
          <span>{children}</span>
          <CircleXmark />
        </div>
      ) : (
        <>
          {iconPosition === 'left' && Icon}
          {children}
          {iconPosition === 'right' && Icon}
        </>
      )}
    </Comp>
  );
}
