import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
  faExclamationTriangle,
  faExclamationCircle,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';

import { cn } from '@web-client/lib/utils';
import { Button } from '@web-client/dawson-ui/ui/button';
import { CircleXmark } from './icons';

const alertVariants = cva(
  cn(
    'tw:relative rounded-none tw:border-solid tw:border-0',
    'tw:xs:border-l-8 tw:xs:p-4 tw:border-l-6 tw:p-3 tw:pt-2.5',
    'tw:font-normal tw:xs:text-lg tw:text-base',
    'tw:[&_ul]:m-0 tw:[&_ul]:-ml-4 tw:[&_ul]:list-disc',
    'tw:xs:[&_svg]:h-7 tw:xs:[&_svg]:w-7 tw:[&_svg]:h-6 tw:[&_svg]:w-6',
    'tw:w-full',
  ),
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
  info: faInfoCircle,
  warning: faExclamationTriangle,
  error: faExclamationCircle,
  success: faCheckCircle,
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
        <div className="tw:flex tw:pt-0.5">
          <FontAwesomeIcon icon={iconType[variant ?? 'info']} />
          <div className="tw:relative tw:xs:ml-4 tw:ml-3">{props.children}</div>
        </div>
        <Button
          className="tw:m-0 tw:p-0 tw:gap-3 tw:w-auto tw:fill-primary tw:self-start tw:ml-auto"
          variant={'primaryTertiary'}
        >
          <div className='tw:flex tw:items-center'>
            <span className="tw:mr-2">Close</span>
            <CircleXmark className={'tw:h-6 tw:w-6'} />
          </div>
        </Button>
      </div>
    </div>
  );
}

function AlertHeader({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        'tw:xs:font-bold tw:font-semibold tw:xs:mb-1 tw:mb-0.5',
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return <div data-slot="alert-description" {...props} />;
}

export { Alert, AlertHeader, AlertDescription };
