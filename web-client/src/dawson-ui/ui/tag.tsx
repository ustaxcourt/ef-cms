import * as React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@web-client/lib/utils';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';

const tagVariants = cva(
  cn(
    'tw:rounded-[4px] tw:font-bold tw:uppercase tw:text-nowrap tw:inline-flex tw:items-center tw:justify-center',
    //Mobile
    'tw:text-xs',
    'tw:px-[6px]',
    'tw:py-[2px]',
    'tw:[&_svg]:h-[10px]',
    'tw:[&_svg]:w-[10px]',
    //Desktop
    'tw:xs:text-sm',
    'tw:xs:py-[2px]',
    'tw:xs:px-[8px]',
    'tw:xs:[&_svg]:h-[12px]',
    'tw:xs:[&_svg]:w-[12px]',
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
      {iconProps && <FontAwesomeIcon className="tw:mr-[4px]" {...iconProps} />}
      <span>{children}</span>
    </span>
  );
};
