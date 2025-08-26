import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { cn } from '@web-client/lib/utils';
import { Button } from '@web-client/dawson-ui/ui/button';
import { CircleXmark } from './icons';

const alertVariants = cva(
  'tw:relative tw:w-full rounded-none tw:border-solid tw:border-0 tw:border-l-8 tw:p-4',
  {
    variants: {
      variant: {
        info: 'tw:bg-blue-lightest tw:border-blue-accent ',
        warning: 'tw:bg-yellow-lighter tw:border-yellow-warning',
        error: 'tw:bg-red-error tw:border-red-primary',
        success: 'tw:bg-green-success tw:border-green',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);

const iconType = {
  info: 'info-circle',
  warning: 'exclamation-triangle',
  error: 'exclamation-circle',
  success: 'check-circle',
};

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className, '')}
      {...props}
    >
      <div className="tw:flex">
        <FontAwesomeIcon className="tw:h-6 tw:w-6" icon={iconType[variant]} />
        <div className="tw:relative tw:ml-4">{props.children}</div>
        <Button variant={'primaryTertiary'}>
          Close
          <CircleXmark />
        </Button>
      </div>
    </div>
  );
}

function AlertHeader({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn('tw:font-bold tw:text-base tw:mb-1', className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn('tw:font-normal tw:text-base', className)}
      {...props}
    />
  );
}

export { Alert, AlertHeader, AlertDescription };
