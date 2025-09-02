import * as React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@web-client/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const tagVariants = cva(
  cn(
    'tw:xs:[&_svg]:h-[12px] tw:xs:[&_svg]:w-[12px] tw:[&_svg]:h-[10px] tw:[&_svg]:w-[10px]',
    'tw:rounded-[.5em] tw:font-bold',
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
  fontProps?: {
    icon: string;
  };
};

export const Tag = ({
  children,
  variant,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof tagVariants> &
  TagProps) => {
  return (
    <span className={cn(tagVariants({ variant }))} {...props}>
      <FontAwesomeIcon className="tw:mr-[4px]" icon="gavel" />
      {children}
    </span>
  );
};
