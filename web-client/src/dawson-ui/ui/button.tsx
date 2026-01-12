import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@web-client/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { CircleXmark } from './icons';

const tertiaryBaseStyles = cn(
  'tw:px-0 tw:py-0 tw:bg-transparent tw:font-normal tw:underline', // standard
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
    'tw:text-base tw:xs:text-lg tw:font-normal tw:outline-none tw:border-none tw:cursor-pointer tw:inline-flex tw:items-center tw:justify-center tw:whitespace-nowrap tw:rounded-md tw:transition-all tw:disabled:pointer-events-none tw:disabled:opacity-50 tw:[&_svg]:pointer-events-none tw:[&_svg:not([class*=size-])]:size-4 tw:shrink-0 tw:[&_svg]:shrink-0',
    'tw:focus-visible:ring-1 tw:focus-visible:ring-offset-1 tw:focus-visible:ring-ring tw:focus-visible:outline-none', // focus-visible
    'tw:aria-invalid:ring-red-primary/20 tw:aria-invalid:border-red-primary', // aria
    'tw:w-full tw:xs:w-auto tw:px-4 tw:py-2', // small & greater
  ),
  {
    variants: {
      variant: {
        primary: cn(
          'tw:h-10 tw:bg-blue-primary tw:text-white tw:shadow-xs tw:font-bold', // standard
          'tw:hover:bg-blue-dark', // hover
          'tw:active:bg-blue-darker', // active
          'tw:invalid:bg-grey-light', // invalid
        ),
        destructive: cn(
          'tw:h-10 tw:bg-red-primary tw:text-white tw:shadow-xs tw:font-bold', // standard
          'tw:hover:bg-red-dark', // hover
          'tw:active:bg-red-darker', // active
          'tw:invalid:bg-grey-light', // invalid
        ),
        secondary: cn(
          primaryColors,
          'tw:h-10 tw:shadow-none tw:bg-background tw:border-blue-primary tw:border-2 tw:border-solid tw:font-bold', // standard
          'tw:hover:border-blue-dark', // hover
          'tw:active:border-blue-darker', // active
          'tw:invalid:border-grey-light', // invalid
        ),
        destructiveTertiary: cn(
          'tw:px-0 tw:py-0 tw:bg-transparent tw:text-red-primary tw:fill-red-primary tw:font-normal tw:underline', // standard,
          'tw:hover:text-red-dark', // hover
          'tw:focus-visible:bg-white', // focus-visible
          'tw:active:text-red-darker', // active
          'tw:invalid:text-grey-light tw:invalid:fill-grey-light', // invalid
        ),
        primaryTertiary: cn(tertiaryBaseStyles, primaryColors),
        terminatorButton: cn(
          tertiaryBaseStyles,
          primaryColors,
          'tw:xs:text-base tw:text-sm',
          'tw:[&_span]:mr-2',
          'tw:[&_div]:flex tw:[&_div]:items-center',
          'tw:[&_svg]:h-3.5! tw:[&_svg]:w-3.5! tw:xs:[&_svg]:h-4! tw:xs:[&_svg]:w-4!',
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
      className={`${iconPosition === 'left' ? 'tw:mr-2' : 'tw:flex-row-reverse tw:ml-2'} tw:xs:w-4.5! tw:w-4! tw:xs:h-4.5! tw:h-4!`}
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
