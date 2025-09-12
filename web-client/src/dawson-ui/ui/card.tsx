import * as React from 'react';
import { Button, buttonVariant } from '@web-client/dawson-ui/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { cn } from '@web-client/lib/utils';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'tw:bg-card tw:text-card-foreground tw:flex',
        'tw:flex-col tw:gap-6',
        'tw:border tw:py-6 tw:shadow-sm',
        'tw:px-8 tw:my-8',
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'tw:grid tw:grid-cols-[1fr_auto] tw:auto-rows-min tw:items-start',
        'tw:gap-y-3',
        'tw:m-0',
        'tw:[&>[data-slot=card-description]]:col-span-2',
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('tw:text-3xl tw:font-serif tw:leading-none', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('tw:text-base tw:text-muted-foreground', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'tw:col-start-2 tw:row-span-2 tw:row-start-1',
        'tw:self-start tw:justify-self-end',
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('tw:py-6', className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('tw:flex tw:items-center tw:pt-6', className)}
      {...props}
    />
  );
}

function MainCard({ content }: React.ComponentProps<'div'>) {
  return (
    <Card>
      <CardHeader className={cn('tw:border-b tw:pb-4')}>
        <CardTitle>Card</CardTitle>
        <Button variant={'primaryTertiary'}>
          <FontAwesomeIcon
            className="fa:margin-right-1"
            icon="file"
            size="1x"
          />
          Tertiary Default
        </Button>
      </CardHeader>
      <CardContent>{content}</CardContent>
      <CardFooter>
        <Button
          variant={'primary'}
          className={cn('tw:align-self: flex-start tw:w-full')}
        >
          Primary Default
        </Button>
      </CardFooter>
    </Card>
  );
}

function FieldRow({
  label,
  children,
  action,
  labelVariant = 'primary',
  className,
}: {
  label: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  /** "default" | "primary" | "muted" */
  labelVariant?: 'default' | 'primary' | 'muted';
  className?: string;
}) {
  const variant = {
    primary: cn(
      'tw:bg-primary tw:text-primary-foreground tw:shadow-xs tw:outline-none', // standard
      'tw:focus-visible:ring-offset-[4px] tw:focus-visible:ring-[4px]', // focus-visible
      'tw:active:bg-primary-active', // active
      'tw:invalid:bg-primary-invalid', // inactive / invalid
    ),
  }[labelVariant];

  return (
    <div
      className={cn(
        // gutters + grid
        'tw:px-5 md:tw:px-8 tw:py-2',
        'tw:grid tw:gap-y-2 tw:gap-x-4',
        // mobile: 1 col; desktop: label | value | (optional) action
        'md:tw:grid-cols-[12rem_1fr_auto]',
        // subtle row divider
        'tw:border-b last:tw:border-b-0',
        className,
      )}
    >
      {/* Label */}
      <div
        className={cn(
          'tw:px-4 tw:py-2', // half the distance as left/right gutters
          // stretch label down the row height on desktop
          variant,
        )}
      >
        {label}
      </div>

      {/* Value */}
      <div className="tw:py-2">{children}</div>

      {/* Optional right-side action (e.g., Edit) */}
      {action ? (
        <div className="tw:py-2 tw:justify-self-end">{action}</div>
      ) : null}
    </div>
  );
}

interface RoleCardProps {
  children: React.ReactNode;
  name: string;
  role: string;
  content?: string; // Optional if not always required
}
function RoleCard({ children, name, role }: RoleCardProps) {
  return (
    <Card>
      <CardHeader className="tw:px-5 md:tw:px-8 tw:pb-4">
        <CardTitle>{name + ' - Under Construction'}</CardTitle>
      </CardHeader>
      <CardContent className="tw:px-0 tw:pb-8">
        {/* Role stripe row (blue) directly under the title */}
        <FieldRow label={role} labelVariant="primary">
          {role}
        </FieldRow>

        {/* Any additional rows/fields go here */}
        {children}
      </CardContent>
    </Card>
  );
}

const sampleCardContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                          eiusmod tempor incididunt ut labore et dolore magna aliqua.`;

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  MainCard,
  RoleCard,
  sampleCardContent,
};
