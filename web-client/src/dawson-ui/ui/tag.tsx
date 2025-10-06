import * as React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@web-client/lib/utils';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import { omit } from 'lodash';

const tagVariants = cva(
  cn(
    'tw:rounded-[4px] tw:font-bold tw:uppercase tw:text-nowrap',
    'tw:[&_svg]:align-[-1px]',
    //Mobile
    'tw:text-[12px]',
    'tw:px-[6px]',
    'tw:py-[2.25px]',
    'tw:[&_svg]:h-[10px]',
    'tw:[&_svg]:w-[10px]',
    //Desktop
    'tw:xs:text-[14px]',
    'tw:xs:py-[3px]',
    'tw:xs:px-[8px]',
    'tw:xs:[&_svg]:h-[12px]',
    'tw:xs:[&_svg]:w-[12px]',
  ),
  {
    variants: {
      variant: {
        primary: cn('tw:bg-white tw:text-primary-darker'),
        destructive: cn('tw:bg-destructive-dark tw:text-white'),
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

type TagProps = {
  iconProps?: FontAwesomeIconProps;
};

export const Tag = ({
  children,
  variant,
  iconProps,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof tagVariants> &
  TagProps) => {
  const classes = cn(tagVariants({ variant })) + ` ${props?.className}`;
  const remainingProps = omit(props, 'className');

  return (
    <span className={classes} {...remainingProps}>
      {iconProps && <FontAwesomeIcon className="tw:mr-[4px]" {...iconProps} />}
      {children}
    </span>
  );
};
