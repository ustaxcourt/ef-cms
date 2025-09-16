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
import { CircleXmark } from '../icons';

const alertVariants = cva(
  cn(
    'tw:relative tw:border-solid tw:border-0',
    'tw:xs:border-l-8 tw:xs:p-4 tw:border-l-6 tw:p-3 tw:pt-[12px] tw:xs:pt-[14px]',
    'tw:font-normal tw:xs:text-lg tw:text-base/4',
    'tw:[&_ul]:m-0 tw:[&_ul]:-ml-4 tw:[&_ul]:list-disc',
    'tw:xs:[&_svg]:h-7 tw:xs:[&_svg]:w-7 tw:[&_svg]:h-6 tw:[&_svg]:w-6',
    'tw:xs:max-w-[740px] tw:w-full',
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
  children,
  className,
  closeButtonOnClick,
  isDismissible = true,
  variant,
  ...props
}: Omit<React.ComponentProps<'div'>, 'children'> &
  VariantProps<typeof alertVariants> & {
    children?: React.ReactNode;
    closeButtonOnClick?: () => React.MouseEventHandler<HTMLButtonElement> | void;
    isDismissible?: boolean;
  }) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <div className="tw:flex">
        <div className="tw:pt-[0px] tw:xs:pt-[2px]">
          <FontAwesomeIcon
            icon={iconType[variant ?? 'info']}
            className="tw:!h-[20px] tw:!w-[20px] tw:xs:!h-[24px] tw:xs:!w-[24px]"
          />
        </div>
        <div className="tw:relative tw:xs:ml-4 tw:ml-3">{children}</div>
        {isDismissible && (
          <Button
            className="tw:m-0 tw:p-0 tw:gap-3 tw:w-auto tw:fill-primary tw:self-start tw:ml-auto"
            variant={'primaryTertiary'}
            onClick={closeButtonOnClick}
          >
            <div className="tw:flex tw:items-center">
              <span className="tw:mr-2 tw:text-base">Close</span>
              <CircleXmark className="tw:!h-[20px] tw:!w-[20px] tw:xs:!h-[24px] tw:xs:!w-[24px]" />
            </div>
          </Button>
        )}
      </div>
    </div>
  );
}

function AlertHeader({ ...props }: React.ComponentProps<'p'>) {
  return (
    <div
      className="tw:text-base/5 tw:font-bold tw:xs:mb-1 tw:mb-1 tw:pb-0"
      data-slot="alert-title"
      data-testid="alert-header"
      {...props}
    />
  );
}

function AlertDescription({ ...props }: React.ComponentProps<'p'>) {
  return (
    <div className="tw:text-base/5" data-slot="alert-description" {...props} />
  );
}

export { Alert, AlertHeader, AlertDescription };
