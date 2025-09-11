import * as React from 'react';
import { Button } from '@web-client/dawson-ui/ui/button';
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
        'tw:px-8',
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
        'tw:border-b tw:pb-4',
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
      <CardHeader>
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
// Not Implemented - yet
function RoleCard({ role, content }: React.ComponentProps<'div'>) {
  return { role, content };
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
