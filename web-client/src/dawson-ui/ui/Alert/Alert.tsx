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
    'tw:font-normal tw:xs:text-base tw:text-base/4',
    'tw:[&_ul]:m-0 tw:[&_ul]:-ml-4 tw:[&_ul]:list-disc',
    'tw:xs:[&_svg]:h-7 tw:xs:[&_svg]:w-7 tw:[&_svg]:h-6 tw:[&_svg]:w-6',
    'tw:xs:max-w-[740px] tw:w-full',
  ),
  {
    variants: {
      variant: {
        info: 'tw:[&_button]:focus-visible:bg-blue-lightest tw:[&_button]:focus-visible:ring-offset-blue-lightest tw:bg-blue-lightest tw:border-blue-accent',
        warning:
          'tw:[&_button]:focus-visible:bg-yellow-lighter tw:[&_button]:focus-visible:ring-offset-yellow-lighter tw:bg-yellow-lighter tw:border-yellow-warning',
        error:
          'tw:[&_button]:focus-visible:bg-red-error tw:[&_button]:focus-visible:ring-offset-red-error tw:bg-red-error tw:border-red-primary',
        success:
          'tw:[&_button]:focus-visible:bg-green-success tw:[&_button]:focus-visible:ring-offset-green-success tw:bg-green-success tw:border-green',
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
      <div className="tw:relative">{children}</div>
    </div>
  );
}
type AlertHeaderType = {
  closeButtonOnClick?: () => React.MouseEventHandler<HTMLButtonElement> | void;
  isDismissible?: boolean;
  title?: string;
  variant: string;
};

function AlertHeader({
  closeButtonOnClick,
  isDismissible = true,
  title,
  variant,
  ...props
}: React.ComponentProps<'p'> & AlertHeaderType) {
  return (
    <div className="tw:flex">
      <div className="tw:pt-[0px] tw:xs:pt-[2px] tw:ml-3 tw:mr-3">
        <FontAwesomeIcon
          icon={iconType[variant ?? 'info']}
          className="tw:!h-[20px] tw:!w-[20px] tw:xs:!h-[24px] tw:xs:!w-[24px]"
        />
      </div>
      <div
        className={cn(
          title ? 'tw:font-bold' : '',
          'tw:text-sm/4.5 tw:xs:text-base/7 tw:xs:mb-1 tw:mb-1 tw:pb-0',
        )}
        data-slot="alert-title"
        data-testid="alert-header"
        {...props}
      ></div>
      {isDismissible && (
        <Button
          className="tw:m-0 tw:p-0 tw:gap-3 tw:w-auto tw:fill-primary tw:self-start tw:ml-auto"
          variant={'primaryTertiary'}
          onClick={closeButtonOnClick}
        >
          <div className="tw:flex tw:hover:text-primary-dark tw:active:text-primary-darker tw:active:fill-primary-darker tw:hover:fill-primary-dark">
            <span className="tw:mr-2 tw:text-sm/4.5 tw:xs:text-base/5.5">
              Close
            </span>
            <CircleXmark className="tw:!h-[20px] tw:!w-[20px] tw:xs:!h-[24px] tw:xs:!w-[24px]" />
          </div>
        </Button>
      )}
    </div>
  );
}

function AlertDescription({ ...props }: React.ComponentProps<'p'>) {
  return (
    <div
      className="tw:text-sm/4.5 tw:xs:text-base/6.5 tw:ml-11"
      data-slot="alert-description"
      {...props}
    />
  );
}

export { Alert, AlertHeader, AlertDescription };
