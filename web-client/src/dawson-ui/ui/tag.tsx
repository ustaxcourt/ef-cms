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
    'tw:xs:[&_svg]:h-[12px] tw:xs:[&_svg]:w-[12px] tw:[&_svg]:h-[10px] tw:[&_svg]:w-[10px]',
    'tw:rounded-[.5em] tw:font-bold tw:uppercase text-nowrap',
    'tw:py-[1px] tw:px-[.5em]',
    'tw:text-[12px]', //Mobile
    'tw:xs:text-[14px]', //Desktop
  ),
  {
    variants: {
      variant: {
        primary: cn('tw:bg-white tw:text-primary-darker'),
        destructive: cn('tw:bg-destructive-darker tw:text-white'),
      },
      size: {
        default: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
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
      {iconProps && (
        <FontAwesomeIcon className="tw:mr-[4px]" icon={iconProps.icon} />
      )}
      {children}
    </span>
  );
};
