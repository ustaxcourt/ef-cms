import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@web-client/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';

const tertiaryBaseStyles = cn(
  'tw:px-0 tw:py-0 tw:bg-transparent tw:font-[400] tw:underline', // standard
  'tw:focus-visible:bg-white', // focus-visible
);

const primaryColors = cn(
  'tw:text-blue-primary tw:fill-blue-primary', // standard
  'tw:hover:text-blue-dark tw:hover:fill-blue-dark', // hover
  'tw:active:text-blue-darker tw:active:fill-blue-darker', // active
  'tw:aria-invalid:ring-red-primary/20 tw:aria-invalid:border-red-primary', // aria
  'tw:invalid:text-grey-light tw:invalid:fill-grey-light', // invalid
);

const buttonVariants = cva(
  cn(
    'tw:text-sm tw:xs:text-base tw:font-normal tw:outline-none tw:border-none tw:cursor-pointer',
    'tw:inline-flex tw:items-center tw:justify-center tw:whitespace-nowrap',
    'tw:rounded-lg tw:transition-all',
    'tw:disabled:cursor-not-allowed tw:disabled:opacity-50',
    'tw:[&_svg]:pointer-events-none tw:[&_svg:not([class*=size-])]:size-4',
    'tw:shrink-0 tw:[&_svg]:shrink-0',

    // focus-visible
    'tw:focus-visible:ring-4 tw:focus-visible:ring-offset-4 tw:focus-visible:ring-ring tw:focus-visible:outline-none',

    // layout
    'tw:w-full tw:xs:w-auto tw:px-4 tw:py-2',
  ),
  {
    variants: {
      variant: {
        destructiveTertiary: cn(
          'tw:px-0 tw:py-0 tw:bg-transparent tw:text-red-primary tw:fill-red-primary tw:font-normal tw:underline', // standard
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

export const ButtonSmall = connect(
  {
    readOnlyMode: state.readOnlyMode,
  },
  function ButtonSmall({
    asChild = false,
    children,
    className,
    icon,
    iconPosition = 'left',
    overrideReadOnly = false,
    readOnlyMode,
    variant,
    ...props
  }: React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
      icon?: IconProp;
      iconPosition?: 'left' | 'right';
      overrideReadOnly?: boolean;
      readOnlyMode?: boolean;
    }) {
    const Comp = asChild ? Slot : 'button';

    const Icon = icon ? (
      <FontAwesomeIcon
        className={cn(
          iconPosition === 'left' ? 'tw:mr-2' : 'tw:flex-row-reverse tw:ml-2',
          'tw:w-4! tw:h-4!',
          'tw:xs:w-4.5! tw:xs:h-4.5!',
        )}
        icon={icon}
        role="img"
        aria-label="icon"
      />
    ) : null;

    return (
      <Comp
        className={cn(buttonVariants({ variant, className }))}
        data-slot="button"
        {...props}
        disabled={props.disabled || (readOnlyMode && !overrideReadOnly)}
        role="button"
      >
        <>
          {iconPosition === 'left' && Icon}
          {children}
          {iconPosition === 'right' && Icon}
        </>
      </Comp>
    );
  },
);
