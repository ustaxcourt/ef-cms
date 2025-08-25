import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { cn } from '@web-client/lib/utils';

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
  header,
  description,
  ...props
}: React.ComponentProps<'div'> &
  VariantProps<typeof alertVariants> & {
    header?: string;
    description: string;
  }) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className, '')}
      {...props}
    >
      <div className="tw:flex tw:items-center">
        <FontAwesomeIcon className="tw:h-6 tw:w-6" icon={iconType[variant]} />

        {header ? (
          <AlertTitle>{header}</AlertTitle>
        ) : (
          <AlertDescription className="tw:ml-4 mt-1.5">
            {description}
          </AlertDescription>
        )}
      </div>
      {header && (
        <AlertDescription className="tw:ml-10 tw:mt-2.5">
          {description}
        </AlertDescription>
      )}
    </div>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        'tw:font-bold tw:text-base tw:leading-6 tw:mt-1.5 tw:mb-1.5 tw:ml-4',
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn('tw:font-normal tw:text-base tw:leading-6', className)}
      {...props}
    />
  );
}

export { Alert };
