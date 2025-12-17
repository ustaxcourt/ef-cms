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

const alertVariants = cva(
  cn(
    'tw:relative tw:border-solid tw:border-0 tw:border-l-[6px] tw:p-[12px] tw:font-normal tw:text-[16px] tw:leading-[20px]',
    'tw:[&_ul]:m-0 tw:[&_ul]:-ml-[16px] tw:[&_ul]:list-disc',
    'tw:[&_svg]:h-[24px] tw:[&_svg]:w-[24px]',
    'tw:xs:border-l-[8px] tw:xs:p-[16px] tw:xs:text-[18px] tw:xs:leading-[24px]',
    'tw:xs:[&_svg]:h-[28px] tw:xs:[&_svg]:w-[28px]',
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
          'tw:[&_button]:focus-visible:bg-green-success tw:[&_button]:focus-visible:ring-offset-green-success tw:bg-green-success tw:border-green-primary',
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
  dataTestId,

}: React.ComponentProps<'div'> &
  VariantProps<typeof alertVariants> & {
    closeButtonOnClick?: () => React.MouseEventHandler<HTMLButtonElement> | void;
    isDismissible?: boolean;
    dataTestId?: string;
  }) {

    
  return (
    /* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      data-testId={dataTestId}
        onClick={closeButtonOnClick}>
      <div className="tw:relative">{children}</div>
    </div>
  );
}
type AlertHeaderType = {
  closeButtonOnClick?: () => React.MouseEventHandler<HTMLButtonElement> | void;
  isDismissible?: boolean;
  title?: string;
  variant: string;
  dataTestId?: string;
};

function AlertHeader({
  closeButtonOnClick,
  isDismissible = true,
  title,
  variant,
  dataTestId,
  children
}: React.ComponentProps<'p'> & AlertHeaderType) {
  return (
    <div className="tw:flex">
      <div className="tw:xs:text-[24px] tw:xs:leading-[24px] tw:!h-[20px] tw:!w-[20px] tw:xs:!h-[24px] tw:xs:!w-[24px]">
        <FontAwesomeIcon
          icon={iconType[variant ?? 'info']}
          className="tw:!h-[20px] tw:!w-[20px] tw:xs:!h-[24px] tw:xs:!w-[24px]"
        />
      </div>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className={cn(
          title ? 'tw:font-bold' : '',
          'tw:pb-0 tw:xs:ml-[16px] tw:ml-[12px] tw:xs:mr-[16px] tw:mr-[12px] tw:text-[16px] tw:leading-[20px] tw:xs:text-[18px] tw:xs:leading-[24px]',
        )}
        data-slot="alert-title"
        data-testid={`alert-header-${dataTestId}`}
        onClick={closeButtonOnClick}
      >
        {children}
      </div>
      {isDismissible && (
        <div className="tw:ml-auto">
          <Button variant="terminatorButton" aria-label="Terminator Button">
            Close
          </Button>
        </div>
      )}
    </div>
  );
}

function AlertDescription({ dataTestId, children, ...props }: React.ComponentProps<'p'> & { dataTestId?: string }) {

  return (
    <div
      className="tw:xs:mt-[8px] tw:xs:text-[18px] tw:xs:leading-[24px] tw:ml-[32px] tw:xs:ml-[40px] tw:pt-[8px] tw:xs:pt-0"
      data-slot="alert-description"
      data-testid={`alert-description-${dataTestId}`}
      {...props}
    >
      {children}
    </div>
  );
}

export { Alert, AlertHeader, AlertDescription };
