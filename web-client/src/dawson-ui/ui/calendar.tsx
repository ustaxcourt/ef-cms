'use client';

import * as React from 'react';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import { DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker';
import '@web-client/dawson-ui/styles/main.css';
import { cn } from '@web-client/lib/utils';
import { Button } from '@web-client/dawson-ui/ui/button';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'tw:rounded-lg tw:pt-3 tw:px-3 tw:pb-3 tw:[--cell-size:2rem] tw:bg-white tw:[&_.rdp-week]:hover:bg-transparent tw:[&_.rdp-week]:hover:shadow-none tw:[&_.rdp-weekdays]:hover:bg-transparent tw:[&_.rdp-weekday]:hover:bg-transparent tw:[&_.rdp-month]:hover:bg-transparent tw:[&_.rdp-months]:hover:bg-transparent tw:[&_.rdp-table]:hover:bg-transparent tw:[&_.rdp-tbody]:hover:bg-transparent tw:[&_.rdp-thead]:hover:bg-transparent tw:[&_thead]:hover:bg-transparent tw:[&_thead]:hover:shadow-none tw:[&_thead]:hover:border-none tw:[&_thead]:hover:outline-none tw:[&_thead]:hover:ring-0 tw:[&_thead]:hover:ring-offset-0 tw:[&_thead]:hover:ring-inset-0 tw:[&_thead]:hover:ring-opacity-0 tw:[&_tr]:hover:shadow-none tw:[&_tr]:hover:box-shadow-none tw:[&_tr]:hover:!shadow-none tw:[&_tr]:hover:!box-shadow-none tw:[&_tr]:min-h-0',
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: date =>
          date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: cn('tw:w-fit tw:h-auto', defaultClassNames.root),
        months: cn(
          'tw:flex tw:gap-4 tw:flex-col tw:md:flex-row tw:relative tw:bg-white',
          defaultClassNames.months,
        ),
        month: cn(
          'tw:flex tw:flex-col tw:w-full tw:gap-0',
          defaultClassNames.month,
        ),
        nav: cn(
          'tw:flex tw:items-center tw:gap-1 tw:w-full tw:absolute tw:top-0 tw:inset-x-0 tw:justify-between',
          defaultClassNames.nav,
        ),
        button_previous: cn(
          'tw:w-7 tw:h-7 tw:aria-disabled:opacity-50 tw:p-0 tw:select-none tw:bg-white tw:hover:bg-gray-100 tw:rounded-md tw:transition-colors tw:duration-150 tw:flex tw:items-center tw:justify-center tw:border tw:border-gray-300 tw:cursor-pointer',
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          'tw:w-7 tw:h-7 tw:aria-disabled:opacity-50 tw:p-0 tw:select-none tw:bg-white tw:hover:bg-gray-100 tw:rounded-md tw:transition-colors tw:duration-150 tw:flex tw:items-center tw:justify-center tw:border tw:border-gray-300 tw:cursor-pointer',
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          'tw:flex tw:items-center tw:justify-center tw:h-(--cell-size) tw:w-full tw:px-(--cell-size)',
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          'tw:w-full tw:flex tw:items-center tw:text-sm tw:font-medium tw:justify-center tw:h-(--cell-size) tw:gap-1.5',
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          'tw:relative tw:has-focus:border-ring tw:border tw:border-input tw:shadow-xs tw:has-focus:ring-ring/50 tw:has-focus:ring-[3px] tw:rounded-md',
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn(
          'tw:absolute tw:bg-popover tw:inset-0 tw:opacity-0',
          defaultClassNames.dropdown,
        ),
        caption_label: cn(
          'tw:select-none tw:font-semibold',
          captionLayout === 'label'
            ? 'tw:text-base'
            : 'tw:rounded-md tw:pl-2 tw:pr-1 tw:flex tw:items-center tw:gap-1 tw:text-sm tw:h-8 tw:[&>svg]:text-muted-foreground tw:[&>svg]:size-3.5',
          defaultClassNames.caption_label,
        ),
        table: 'tw:w-full tw:border-collapse table',
        weekdays: cn('tw:flex', defaultClassNames.weekdays),
        weekday: cn(
          'tw:text-gray-400 tw:rounded-md tw:flex-1 tw:font-normal tw:text-[0.8rem] tw:select-none',
          defaultClassNames.weekday,
        ),
        week: cn(
          'tw:flex tw:w-full tw:mt-1 tw:hover:bg-transparent',
          defaultClassNames.week,
        ),
        week_number_header: cn(
          'tw:select-none tw:w-(--cell-size)',
          defaultClassNames.week_number_header,
        ),
        week_number: cn(
          'tw:text-[0.8rem] tw:select-none tw:text-muted-foreground',
          defaultClassNames.week_number,
        ),
        day: cn(
          'tw:relative tw:w-full tw:h-full tw:p-0 tw:text-center tw:[&:first-child[data-selected=true]_button]:rounded-l-md tw:[&:last-child[data-selected=true]_button]:rounded-r-md tw:aspect-square tw:select-none',
          defaultClassNames.day,
        ),
        range_start: cn(
          'tw:rounded-l-md tw:bg-accent',
          defaultClassNames.range_start,
        ),
        range_middle: cn('tw:rounded-none', defaultClassNames.range_middle),
        range_end: cn(
          'tw:rounded-r-md tw:bg-accent',
          defaultClassNames.range_end,
        ),
        today: cn(
          'tw:bg-accent tw:text-accent-foreground tw:rounded-md tw:data-[selected=true]:rounded-none',
          defaultClassNames.today,
        ),
        outside: cn(
          'tw:text-gray-400 tw:aria-selected:text-gray-400 tw:opacity-50',
          defaultClassNames.outside,
        ),
        disabled: cn(
          'tw:text-muted-foreground tw:opacity-50',
          defaultClassNames.disabled,
        ),
        hidden: cn('tw:invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          );
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === 'left') {
            return (
              <ChevronLeftIcon
                className={cn('tw:size-4 tw:text-gray-400', className)}
                {...props}
              />
            );
          }

          if (orientation === 'right') {
            return (
              <ChevronRightIcon
                className={cn('tw:size-4 tw:text-gray-400', className)}
                {...props}
              />
            );
          }

          return (
            <ChevronDownIcon
              className={cn('tw:size-4 tw:text-gray-400', className)}
              {...props}
            />
          );
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="tw:flex tw:size-(--cell-size) tw:items-center tw:justify-center tw:text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="secondary"
      size="default"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        'tw:data-[selected-single=true]:bg-primary tw:data-[selected-single=true]:text-primary-foreground tw:data-[range-middle=true]:bg-gray-200 tw:data-[range-middle=true]:text-gray-800 tw:data-[range-start=true]:bg-primary tw:data-[range-start=true]:text-primary-foreground tw:data-[range-end=true]:bg-primary tw:data-[range-end=true]:text-primary-foreground tw:flex tw:aspect-square tw:w-full tw:h-full tw:min-h-8 tw:min-w-8 tw:max-h-8 tw:max-w-8 tw:flex-col tw:gap-0 tw:leading-none tw:font-normal tw:data-[range-end=true]:rounded-md tw:data-[range-end=true]:rounded-r-md tw:data-[range-middle=true]:rounded-none tw:data-[range-start=true]:rounded-md tw:data-[range-start=true]:rounded-l-md tw:[&>span]:text-xs tw:[&>span]:opacity-70 tw:justify-center tw:items-center tw:text-center tw:hover:bg-gray-100 tw:hover:text-gray-900 tw:transition-colors tw:duration-150 tw:border-0 tw:focus:border-0 tw:focus:ring-0 tw:focus:outline-none tw:outline-none tw:outline-0 tw:text-black',
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
