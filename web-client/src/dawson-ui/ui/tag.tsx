import * as React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@web-client/lib/utils';

const tagVariants = cva(
  cn('tw:rounded-lg tw:bg-destructive-darker tw:h-[50px]'),
  {
    variants: {
      variant: {
        primary: cn(''),
        destructive: cn(''),
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

export const Tag = ({
  children,
  variant,
}: {
  children: React.ReactNode;
} & VariantProps<typeof tagVariants>) => {
  return <span className={cn(tagVariants({ variant }))}>{children}</span>;
};
