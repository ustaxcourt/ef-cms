import * as React from 'react';
import { Button } from '@web-client/dawson-ui/ui/button';

import { cn } from '@web-client/lib/utils';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'tw:bg-card tw:text-card-foreground tw:flex',
        'tw:flex-col',
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
interface MainCardProps {
  content: string;
  children?: React.ReactNode;
  caseDetail?: object;
}

function MainCard({ content, children }: MainCardProps) {
  return (
    <Card>
      <CardHeader className={cn('tw:border-b tw:pb-4')}>
        <CardTitle>Card</CardTitle>
        <Button
          variant="primaryTertiary"
          icon="file"
          aria-label="Primary Default"
        >
          Tertiary Default
        </Button>
      </CardHeader>
      <CardContent>{content}</CardContent>
      {children}
      <CardFooter>
        <Button variant={'primary'}>Primary Default</Button>
      </CardFooter>
    </Card>
  );
}
// TODO: Refactor
function FieldRow({
  label,
  children,
  action,
  labelVariant = 'primary',
  className,
}: {
  label: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
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
        'tw:px-5 md:tw:px-8 tw:py-4',
        'tw:grid tw:gap-y-2 tw:gap-x-4',
        'md:tw:grid-cols-[12rem_1fr_auto]',
        className,
      )}
    >
      {/* Label */}
      <div className={cn('tw:px-4 tw:py-4', variant)}>{label}</div>

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
  editSequence?: () => void;
  name: string;
  content?: string; // Optional if not always required
  counsel?: { name: string; description: string }; // Optional if not always required
  role: string;
  service_preference?: string; // Optional if not always required
  email?: string; // Optional if not always required
}
function RoleCard({
  children,
  name,
  role,
  counsel,
  service_preference,
  email,
  content,
  editSequence,
}: RoleCardProps) {
  return (
    <Card>
      <CardHeader className="tw:px-5 md:tw:px-8 tw:pb-4">
        <CardTitle className="tw:mt-2">
          {name + ' - Under Construction'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Role stripe row (blue) directly under the title */}
        <FieldRow label={role} labelVariant="primary" />
        {content}
        {/* Any additional rows/fields go here */}
        {children}
      </CardContent>
    </Card>
  );
}

const sampleCardContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                          eiusmod tempor incididunt ut labore et dolore magna aliqua.`;

const sampleEmail = `someEmail@server.com`;
const sampleServicePreference = `In Person`;

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
  sampleEmail,
  sampleServicePreference,
};
