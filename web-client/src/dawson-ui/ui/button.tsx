import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@web-client/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { CircleXmark } from './icons';

const buttonVariants = cva(
  cn(
    'tw:text-[16px] tw:xs:text-[18px] tw:cursor-pointer tw:inline-flex tw:items-center tw:justify-center tw:whitespace-nowrap tw:rounded-[6px] tw:text-base tw:transition-all tw:disabled:pointer-events-none tw:disabled:opacity-50 tw:[&_svg]:pointer-events-none tw:[&_svg:not([class*=size-])]:size-4 tw:shrink-0 tw:[&_svg]:shrink-0 tw:border-none',
    'tw:focus-visible:ring-[4px] tw:focus-visible:ring-ring', // focus-visible
    'tw:aria-invalid:ring-destructive/20 tw:aria-invalid:border-destructive', // aria
    'tw:w-full tw:xs:w-auto tw:px-[16px] tw:py-[8px]', // small & greater
  ),
  {
    variants: {
      variant: {
        primary: cn(
          'tw:h-[40px] tw:bg-primary tw:text-primary-foreground tw:shadow-xs tw:outline-none tw:font-bold', // standard
          'tw:hover:bg-primary-dark', // hover
          'tw:focus-visible:ring-offset-[4px]', // focus-visible
          'tw:active:bg-primary-darker', // active
          'tw:invalid:bg-grey-light', // inactive / invalid
        ),
        destructive: cn(
          'tw:h-[40px] tw:bg-destructive tw:text-white tw:shadow-xs  tw:outline-none tw:border-none tw:font-bold', // standard
          'tw:hover:bg-destructive-dark', // hover
          'tw:focus-visible:ring-offset-[4px]', // focus-visible
          'tw:active:bg-destructive-darker', // active
          'tw:invalid:bg-grey-light', // invalid
        ),
        secondary: cn(
          'tw:h-[40px] tw:shadow-none tw:bg-background tw:border-primary tw:border-[2px] tw:border-solid tw:text-primary tw:font-bold', // standard
          'tw:hover:text-primary-dark tw:hover:border-primary-dark', // hover
          'tw:focus:outline-none tw:focus:border-primary', // focus
          'tw:focus-visible:ring-offset-[4px] tw:focus-visible:border-primary tw:focus-visible:outline-none', // focus-visible
          'tw:active:text-primary-darker tw:active:border-primary-darker', // active
          'tw:invalid:text-grey-light tw:invalid:border-grey-light', // inactive / invalid
        ),
        destructiveTertiary: cn(
          'tw:px-0 tw:py-0 tw:bg-transparent tw:text-destructive tw:font-[400] tw:underline tw:outline-none tw:font-normal', // standard,
          'tw:hover:underline tw:hover:text-destructive-dark', // hover
          'tw:focus-visible:ring-offset-[4px] tw:focus-visible:bg-white', // focus-visible
          'tw:active:text-destructive-darker', // active
          'tw:invalid:text-grey-light', // invalid
        ),
        primaryTertiary: cn(
          'tw:px-0 tw:py-0 tw:bg-transparent tw:text-primary tw:font-[400] tw:underline tw:outline-none tw:font-normal', // standard
          'tw:hover:underline tw:hover:text-primary-dark', // hover,
          'tw:focus-visible:ring-offset-[4px] tw:focus-visible:bg-white', // focus-visible
          'tw:active:text-primary-darker', // active
          'tw:invalid:text-grey-light', // inactive
          'tw:ml-0 tw:mr-auto tw:text-left', // left alignment
        ),
        terminatorButton: cn(
          'tw:text-[16px] tw:xs:text-[18px] tw:inline-flex tw:cursor-pointer tw:whitespace-nowrap tw:w-auto tw:xs:w-auto',
          'tw:m-0 tw:p-0 tw:gap-[12px] tw:bg-transparent tw:text-primary tw:fill-primary tw:text-left tw:font-normal tw:underline tw:border-none tw:outline-none',
          'tw:rounded-[2px] tw:self-start tw:ml-auto tw:mt-auto tw:mb-auto tw:transition-all tw:shrink-0', // standard          
          'tw:hover:underline tw:hover:text-primary-dark', // Hover state
          'tw:active:text-primary-darker', // Active state
          'tw:focus-visible:ring-[4px] tw:focus-visible:ring-ring tw:focus-visible:ring-offset-[4px] tw:focus-visible:bg-white', // Focus visible state
          'tw:disabled:pointer-events-none tw:disabled:opacity-50', // Disabled state         
          'tw:invalid:text-grey-light tw:aria-invalid:ring-destructive/20 tw:aria-invalid:border-destructive', // Invalid state
          'tw:[&_svg]:pointer-events-none tw:[&_svg]:shrink-0 tw:[&_svg:not([class*=size-])]:size-4' // SVG/Icon styles
        )
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
      {variant === "terminatorButton" ? (
        <div className="tw:flex tw:items-center tw:text-[14px]/3 tw:xs:text-[16px]/4 tw:hover:text-primary-dark tw:active:text-primary-darker tw:fill-primary tw:active:fill-primary-darker tw:hover:fill-primary-darker">
          <span className="tw:mr-[8px]">{children}</span>
          <CircleXmark className="tw:!h-[14px] tw:!w-[14px] tw:xs:!h-[16px] tw:xs:!w-[16px]"/>
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