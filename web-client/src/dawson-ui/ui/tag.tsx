import * as React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@web-client/lib/utils';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';

const tagVariants = cva(
  cn(
    'tw:rounded-[0.25rem] tw:font-bold tw:uppercase tw:text-nowrap tw:inline-flex tw:items-center tw:justify-center tw:align-middle',
    //Mobile
    'tw:text-xs',
    'tw:px-1.5',
    'tw:py-0.5',
    'tw:[&_svg]:h-2.5',
    'tw:[&_svg]:w-2.5',
    //Desktop
    'tw:xs:text-sm',
    'tw:xs:py-0.5',
    'tw:xs:px-2',
    'tw:xs:[&_svg]:h-3',
    'tw:xs:[&_svg]:w-3',
  ),
  {
    variants: {
      variant: {
        primary: cn('tw:bg-white tw:text-blue-darker'),
        destructive: cn('tw:bg-red-dark tw:text-white'),
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

type TagProps = {
  iconProps?: FontAwesomeIconProps;
  dataTestId?: string;
};

export const Tag = ({
  children,
  variant,
  iconProps,
  className = '',
  dataTestId,
  id,
}: React.ComponentProps<'span'> &
  VariantProps<typeof tagVariants> &
  TagProps) => {
  const classes = cn(tagVariants({ variant })) + ` ${className}`;

  return (
    <span className={classes} id={id} data-testid={dataTestId}>
      {iconProps && <FontAwesomeIcon className="tw:mr-1" {...iconProps} />}
      <span>{children}</span>
    </span>
  );
};
